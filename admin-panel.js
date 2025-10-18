// ===== ADMIN PANEL - LA PREVIA =====
// Sistema de administración completo con Firebase

'use strict';

// ===== INICIALIZAR FIREBASE =====
// La configuración se carga desde firebase-config.js
let auth = null;
let db = null;
let storage = null;

try {
    // Verificar si Firebase ya está inicializado
    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
    
    // Inicializar servicios de Firebase sin autenticación
    db = firebase.firestore();
    storage = firebase.storage();
    
    // Deshabilitar autenticación para evitar errores de CONFIGURATION_NOT_FOUND
    auth = {
        signInWithEmailAndPassword: () => Promise.reject(new Error('Auth disabled')),
        signOut: () => Promise.resolve(),
        onAuthStateChanged: (callback) => {
            // Simular usuario no autenticado
            callback(null);
            return () => {};
        },
        currentUser: null
    };
    
    // Configurar Firestore para modo offline
    db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
        ignoreUndefinedProperties: true
    });
    
    // Habilitar persistencia offline
    db.enablePersistence({
        synchronizeTabs: true
    }).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.log('⚠️ Múltiples pestañas abiertas, persistencia deshabilitada');
        } else if (err.code === 'unimplemented') {
            console.log('⚠️ Navegador no soporta persistencia offline');
        }
    });
    
    // Suprimir errores específicos de Firebase que no afectan la funcionalidad
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;
    
    console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('CONFIGURATION_NOT_FOUND') || 
            message.includes('identitytoolkit') ||
            message.includes('getProjectConfig') ||
            message.includes('400 (Bad Request)') ||
            message.includes('googleapis.com')) {
            // Suprimir estos errores específicos
            return;
        }
        originalConsoleError.apply(console, args);
    };
    
    console.warn = function(...args) {
        const message = args.join(' ');
        if (message.includes('CONFIGURATION_NOT_FOUND') || 
            message.includes('identitytoolkit') ||
            message.includes('getProjectConfig') ||
            message.includes('400 (Bad Request)') ||
            message.includes('googleapis.com')) {
            // Suprimir estos warnings específicos
            return;
        }
        originalConsoleWarn.apply(console, args);
    };
    
    // Interceptar errores de red
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (url && url.includes('googleapis.com') && url.includes('getProjectConfig')) {
            // Suprimir esta petición específica
            return Promise.reject(new Error('Request suppressed'));
        }
        return originalFetch.apply(this, args);
    };
    
    // Interceptar XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (url && url.includes('googleapis.com') && url.includes('getProjectConfig')) {
            // Suprimir esta petición específica
            this._suppressed = true;
            return;
        }
        return originalXHROpen.call(this, method, url, ...args);
    };
    
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(...args) {
        if (this._suppressed) {
            return;
        }
        return originalXHRSend.apply(this, args);
    };
    
    console.log('✅ Firebase inicializado en admin panel');
} catch (error) {
    console.error('❌ Error inicializando Firebase en admin:', error);
    console.log('🔄 Continuando sin Firebase...');
    
    // Crear objetos mock para evitar errores
    auth = {
        signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase no disponible')),
        signOut: () => Promise.resolve(),
        onAuthStateChanged: (callback) => callback(null)
    };
    
    db = {
        collection: () => ({
            add: () => Promise.reject(new Error('Firebase no disponible')),
            get: () => Promise.resolve({ docs: [] }),
            doc: () => ({
                get: () => Promise.resolve({ exists: false }),
                set: () => Promise.reject(new Error('Firebase no disponible')),
                update: () => Promise.reject(new Error('Firebase no disponible')),
                delete: () => Promise.reject(new Error('Firebase no disponible'))
            }),
            where: () => ({
                get: () => Promise.resolve({ docs: [] })
            })
        })
    };
    
    storage = {
        ref: () => ({
            put: () => Promise.reject(new Error('Firebase no disponible'))
        })
    };
}

// ===== VARIABLES GLOBALES =====
let currentUser = null;
let products = [];
let banners = [];
let categories = [];
let editingProductId = null;
let editingBannerId = null;
let editingCategoryId = null;
let isOfflineMode = false;

// Estado global de la aplicación (compatible con script-optimized.js)
const AppState = {
    products: [],
    useFirebase: false
};

// ===== ELEMENTOS DEL DOM =====
const loginScreen = document.getElementById('login-screen');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');

// Navegación
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('page-title');

// Productos
const btnAddProduct = document.getElementById('btn-add-product');
const productModal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const productsTableBody = document.getElementById('products-table-body');
const searchProducts = document.getElementById('search-products');
const filterCategory = document.getElementById('filter-category');
const filterStatus = document.getElementById('filter-status');

// Banners
const btnAddBanner = document.getElementById('btn-add-banner');
const bannerModal = document.getElementById('banner-modal');
const bannerForm = document.getElementById('banner-form');
const bannersGrid = document.getElementById('banners-grid');

// Estadísticas
const totalProductos = document.getElementById('total-productos');
const productosActivos = document.getElementById('productos-activos');
const productosOferta = document.getElementById('productos-oferta');
const totalBanners = document.getElementById('total-banners');

// ===== AUTENTICACIÓN =====
// Usuarios permitidos (sin Firebase)
const USUARIOS_PERMITIDOS = {
    'tomi': 'laprevia',
    'facu': 'laprevia'
};

// Variable para el usuario actual
let currentUsername = null;

// Verificar si hay sesión guardada
const savedUser = localStorage.getItem('adminUser');
if (savedUser) {
    currentUsername = savedUser;
    showAdminPanel();
    document.getElementById('user-email').textContent = currentUsername.charAt(0).toUpperCase() + currentUsername.slice(1);
    loadAllData();
} else {
    showLoginScreen();
}

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('email').value.toLowerCase().trim();
    const password = document.getElementById('password').value;
    
    // Verificar credenciales
    if (USUARIOS_PERMITIDOS[username] && USUARIOS_PERMITIDOS[username] === password) {
        currentUsername = username;
        localStorage.setItem('adminUser', username);
        document.getElementById('user-email').textContent = username.charAt(0).toUpperCase() + username.slice(1);
        showAdminPanel();
        showToast('Sesión iniciada correctamente', 'success');
        loadAllData();
    } else {
        showError('Usuario o contraseña incorrectos');
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminUser');
    currentUsername = null;
    showLoginScreen();
    showToast('Sesión cerrada', 'success');
});

function showLoginScreen() {
    loginScreen.style.display = 'flex';
    adminPanel.style.display = 'none';
}

function showAdminPanel() {
    loginScreen.style.display = 'none';
    adminPanel.style.display = 'flex';
}

function showError(message) {
    loginError.textContent = message;
    loginError.classList.add('show');
    setTimeout(() => {
        loginError.classList.remove('show');
    }, 5000);
}

// ===== NAVEGACIÓN =====
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionName = item.dataset.section;
        
        // Actualizar navegación activa
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Mostrar sección correspondiente
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(`section-${sectionName}`).classList.add('active');
        
        // Actualizar título
        const titles = {
            'dashboard': 'Dashboard',
            'productos': 'Gestión de Productos',
            'banners': 'Gestión de Banners',
            'configuracion': 'Configuración'
        };
        pageTitle.textContent = titles[sectionName];
    });
});

// Acciones rápidas del dashboard
document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'add-category') {
            openCategoryModal();
        } else if (action === 'add-product') {
            openProductModal();
        } else if (action === 'add-banner') {
            openBannerModal();
        } else if (action === 'view-site') {
            window.open('index.html', '_blank');
        }
    });
});

// Botón adicional para agregar categoría desde sección productos
document.getElementById('btn-add-category-2').addEventListener('click', () => openCategoryModal());

// ===== PRODUCTOS =====
// Cargar productos desde Firebase
async function loadProducts() {
    try {
        const snapshot = await db.collection('productos').orderBy('createdAt', 'desc').get();
        products = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // LIMPIAR placeholder.jpg automáticamente
            if (data.image && (data.image.includes('placeholder.jpg') || data.image.includes('IMG/placeholder'))) {
                console.log(`🧹 Limpiando placeholder.jpg de: ${data.name}`);
                // Actualizar en Firebase
                doc.ref.update({ image: '' }).catch(err => console.error('Error actualizando:', err));
                // Usar cadena vacía localmente
                data.image = '';
            }
            
            return {
                id: doc.id,
                ...data
            };
        });
        
        // Actualizar la variable global de productos
        AppState.products = products;
        
        renderProducts();
        updateStats();
        
        // Actualizar contador de categorías
        renderCategoriesQuickView();
        
        // Los cambios se reflejan automáticamente en tiempo real via Firebase listeners
    } catch (error) {
        console.error('Error cargando productos:', error);
        showToast('Error al cargar productos', 'error');
    }
}

// Renderizar tabla de productos
function renderProducts() {
    const searchTerm = searchProducts.value.toLowerCase();
    const category = filterCategory.value;
    const status = filterStatus.value;
    
    let filteredProducts = products.filter(product => {
        const matchSearch = product.name.toLowerCase().includes(searchTerm);
        const matchCategory = category === 'todos' || product.category === category;
        const matchStatus = status === 'todos' || 
            (status === 'activo' && product.active) ||
            (status === 'inactivo' && !product.active) ||
            (status === 'oferta' && product.onOffer);
        
        return matchSearch && matchCategory && matchStatus;
    });
    
    productsTableBody.innerHTML = filteredProducts.map(product => `
        <tr>
            <td>
                ${product.image && product.image.trim() !== '' 
                    ? `<img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                       <div style="display:none; width:60px; height:60px; background:linear-gradient(135deg, #1A0033, #4A0044); border-radius:8px; align-items:center; justify-content:center; color:#E0E0E0;"><i class="fas fa-image"></i></div>`
                    : `<div style="display:flex; width:60px; height:60px; background:linear-gradient(135deg, #1A0033, #4A0044); border-radius:8px; align-items:center; justify-content:center; color:#E0E0E0;"><i class="fas fa-image"></i></div>`
                }
            </td>
            <td>${product.name}</td>
            <td><span class="category-badge">${product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Sin categoría'}</span></td>
            <td>$${product.price.toLocaleString()}</td>
            <td>
                <span class="status-badge ${product.active ? 'status-active' : 'status-inactive'}">
                    ${product.active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                ${product.onOffer ? '<i class="fas fa-tag" style="color: #4CAF50;"></i>' : '-'}
            </td>
            <td>
                ${product.featured ? '<i class="fas fa-star" style="color: #FFD700;"></i>' : '-'}
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon-sm" onclick="editProduct('${product.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon-sm" onclick="toggleProductStatus('${product.id}')" title="Activar/Desactivar">
                        <i class="fas fa-${product.active ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="btn-icon-sm delete" onclick="deleteProduct('${product.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Cargar categorías en el select de productos
function loadCategoriesIntoSelect() {
    const categorySelect = document.getElementById('product-category-select');
    if (!categorySelect) return;
    
    // Limpiar select y agregar opción por defecto
    categorySelect.innerHTML = '<option value="">-- Seleccionar categoría --</option>';
    
    // Agregar cada categoría al select
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1);
        categorySelect.appendChild(option);
    });
    
    if (categories.length === 0) {
        categorySelect.innerHTML = '<option value="">Primero crea una categoría</option>';
    }
}


// Abrir modal de producto
function openProductModal(productId = null) {
    editingProductId = productId;
    const modalTitle = document.getElementById('modal-product-title');
    
    // Cargar categorías en el select
    loadCategoriesIntoSelect();
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        modalTitle.textContent = 'Editar Producto';
        
        // Rellenar formulario
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category-select').value = product.category;
        
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-original-price').value = product.originalPrice || '';
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-image-url').value = product.image || '';
        document.getElementById('product-active').checked = product.active;
        document.getElementById('product-offer').checked = product.onOffer;
        document.getElementById('product-featured').checked = product.featured;
        
        // Mostrar preview de imagen
        if (product.image) {
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${product.image}" alt="Preview">`;
            preview.classList.add('show');
        }
    } else {
        modalTitle.textContent = 'Agregar Producto';
        productForm.reset();
        document.getElementById('image-preview').classList.remove('show');
    }
    
    productModal.classList.add('show');
}

// Cerrar modales
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        productModal.classList.remove('show');
        bannerModal.classList.remove('show');
        productForm.reset();
        bannerForm.reset();
        editingProductId = null;
        editingBannerId = null;
    });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        productModal.classList.remove('show');
        bannerModal.classList.remove('show');
    });
});

// Preview de imagen de producto
document.getElementById('product-image-url').addEventListener('input', (e) => {
    const imageUrl = e.target.value.trim();
    if (imageUrl) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `<img src="${imageUrl}" alt="Preview" onerror="this.src='./Logo/La Previa.jpg'">`;
        preview.classList.add('show');
    } else {
        document.getElementById('image-preview').classList.remove('show');
    }
});

// Selector de archivos para productos
document.getElementById('product-image-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('image-preview');
    const urlInput = document.getElementById('product-image-url');
    
    if (file) {
        // Crear URL temporal para preview
        const imageUrl = URL.createObjectURL(file);
        
        // Mostrar preview
        preview.innerHTML = `
            <img src="${imageUrl}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px; border: 2px solid var(--primary-color);">
            <p style="color: var(--text-light); font-size: 12px; margin-top: 0.5rem;">
                📁 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
        `;
        preview.classList.add('show');
        
        // Actualizar input de URL con nombre del archivo
        urlInput.value = `./IMG/${file.name}`;
        
        // Guardar archivo en memoria para envío
        window.selectedProductImage = file;
    }
});

// Botón limpiar imagen de producto
document.getElementById('clear-image-btn').addEventListener('click', function() {
    document.getElementById('product-image-file').value = '';
    document.getElementById('product-image-url').value = '';
    document.getElementById('image-preview').classList.remove('show');
    window.selectedProductImage = null;
});

// Guardar producto
productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let imageUrl = document.getElementById('product-image-url').value.trim();
    
    // Si se seleccionó un archivo, usar ese nombre
    if (window.selectedProductImage) {
        imageUrl = `./IMG/${window.selectedProductImage.name}`;
    }
    
    // La imagen es opcional, no validamos si está vacía
    
    // Obtener categoría
    const category = document.getElementById('product-category-select').value.trim();
    
    if (!category) {
        showToast('Por favor selecciona una categoría', 'error');
        return;
    }
    
    const productData = {
        name: document.getElementById('product-name').value,
        category: category,
        price: parseFloat(document.getElementById('product-price').value),
        originalPrice: parseFloat(document.getElementById('product-original-price').value) || null,
        description: document.getElementById('product-description').value,
        image: imageUrl || '', // Sin imagen por defecto
        active: document.getElementById('product-active').checked,
        onOffer: document.getElementById('product-offer').checked,
        featured: document.getElementById('product-featured').checked,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (editingProductId) {
            // Actualizar producto existente
            await db.collection('productos').doc(editingProductId).update(productData);
            showToast('Producto actualizado correctamente', 'success');
        } else {
            // Crear nuevo producto
            productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('productos').add(productData);
            showToast('Producto agregado correctamente', 'success');
        }
        
        productModal.classList.remove('show');
        productForm.reset();
        document.getElementById('image-preview').classList.remove('show');
        editingProductId = null;
        
        // Limpiar archivos seleccionados
        window.selectedProductImage = null;
        document.getElementById('product-image-file').value = '';
        
        loadProducts();
    } catch (error) {
        console.error('Error guardando producto:', error);
        showToast('Error al guardar producto', 'error');
    }
});

// Editar producto
window.editProduct = function(productId) {
    openProductModal(productId);
};

// Alternar estado de producto
window.toggleProductStatus = async function(productId) {
    const product = products.find(p => p.id === productId);
    try {
        await db.collection('productos').doc(productId).update({
            active: !product.active
        });
        showToast('Estado actualizado', 'success');
        loadProducts();
    } catch (error) {
        console.error('Error actualizando estado:', error);
        showToast('Error al actualizar estado', 'error');
    }
};

// Eliminar producto
window.deleteProduct = async function(productId) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
        await db.collection('productos').doc(productId).delete();
        showToast('Producto eliminado', 'success');
        loadProducts();
    } catch (error) {
        console.error('Error eliminando producto:', error);
        showToast('Error al eliminar producto', 'error');
    }
};

// Filtros de productos
searchProducts.addEventListener('input', renderProducts);
filterCategory.addEventListener('change', renderProducts);
filterStatus.addEventListener('change', renderProducts);

// Botón agregar producto
btnAddProduct.addEventListener('click', () => openProductModal());

// ===== BANNERS =====
// Cargar banners
async function loadBanners() {
    try {
        const snapshot = await db.collection('banners').orderBy('order', 'asc').get();
        banners = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // LIMPIAR placeholder.jpg automáticamente
            if (data.image && (data.image.includes('placeholder.jpg') || data.image.includes('IMG/placeholder'))) {
                console.log(`🧹 Limpiando placeholder.jpg de banner: ${data.title}`);
                // Actualizar en Firebase
                doc.ref.update({ image: '' }).catch(err => console.error('Error actualizando:', err));
                // Usar cadena vacía localmente
                data.image = '';
            }
            
            return {
                id: doc.id,
                ...data
            };
        });
        renderBanners();
        updateStats();
    } catch (error) {
        console.error('Error cargando banners:', error);
        showToast('Error al cargar banners', 'error');
    }
}

// Renderizar banners
function renderBanners() {
    bannersGrid.innerHTML = banners.map(banner => `
        <div class="banner-card">
            ${banner.image && banner.image.trim() !== '' 
                ? `<img src="${banner.image}" alt="${banner.title}" class="banner-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                   <div style="display:none; width:100%; height:150px; background:linear-gradient(135deg, #1A0033, #4A0044); border-radius:8px; align-items:center; justify-content:center; color:#E0E0E0; font-size:2rem;"><i class="fas fa-image"></i></div>`
                : `<div style="display:flex; width:100%; height:150px; background:linear-gradient(135deg, #1A0033, #4A0044); border-radius:8px; align-items:center; justify-content:center; color:#E0E0E0; font-size:2rem;"><i class="fas fa-image"></i></div>`
            }
            <div class="banner-info">
                <h3>${banner.title}</h3>
                <p>${banner.description || ''}</p>
                <div class="banner-actions">
                    <button class="btn-icon-sm" onclick="editBanner('${banner.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon-sm" onclick="toggleBannerStatus('${banner.id}')" title="Activar/Desactivar">
                        <i class="fas fa-${banner.active ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="btn-icon-sm delete" onclick="deleteBanner('${banner.id}')" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <span class="status-badge ${banner.active ? 'status-active' : 'status-inactive'}">
                    ${banner.active ? 'Activo' : 'Inactivo'}
                </span>
            </div>
        </div>
    `).join('');
}

// Abrir modal de banner
function openBannerModal(bannerId = null) {
    editingBannerId = bannerId;
    const modalTitle = document.getElementById('modal-banner-title');
    
    if (bannerId) {
        const banner = banners.find(b => b.id === bannerId);
        modalTitle.textContent = 'Editar Banner';
        
        document.getElementById('banner-title').value = banner.title;
        document.getElementById('banner-description').value = banner.description || '';
        document.getElementById('banner-image-url').value = banner.image || '';
        document.getElementById('banner-order').value = banner.order;
        document.getElementById('banner-active').checked = banner.active;
        
        if (banner.image) {
            const preview = document.getElementById('banner-preview');
            preview.innerHTML = `<img src="${banner.image}" alt="Preview">`;
            preview.classList.add('show');
        }
    } else {
        modalTitle.textContent = 'Agregar Banner';
        bannerForm.reset();
        document.getElementById('banner-preview').classList.remove('show');
    }
    
    bannerModal.classList.add('show');
}

// Preview de imagen de banner
document.getElementById('banner-image-url').addEventListener('input', (e) => {
    const imageUrl = e.target.value.trim();
    if (imageUrl) {
        const preview = document.getElementById('banner-preview');
        preview.innerHTML = `<img src="${imageUrl}" alt="Preview" onerror="this.src='./Logo/La Previa.jpg'">`;
        preview.classList.add('show');
    } else {
        document.getElementById('banner-preview').classList.remove('show');
    }
});

// Selector de archivos para banners
document.getElementById('banner-image-file').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('banner-preview');
    const urlInput = document.getElementById('banner-image-url');
    
    if (file) {
        // Crear URL temporal para preview
        const imageUrl = URL.createObjectURL(file);
        
        // Mostrar preview
        preview.innerHTML = `
            <img src="${imageUrl}" alt="Preview" style="max-width: 300px; max-height: 150px; border-radius: 8px; border: 2px solid var(--primary-color);">
            <p style="color: var(--text-light); font-size: 12px; margin-top: 0.5rem;">
                📁 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
        `;
        preview.classList.add('show');
        
        // Actualizar input de URL con nombre del archivo
        urlInput.value = `./Banner/${file.name}`;
        
        // Guardar archivo en memoria para envío
        window.selectedBannerImage = file;
    }
});

// Botón limpiar imagen de banner
document.getElementById('clear-banner-btn').addEventListener('click', function() {
    document.getElementById('banner-image-file').value = '';
    document.getElementById('banner-image-url').value = '';
    document.getElementById('banner-preview').classList.remove('show');
    window.selectedBannerImage = null;
});

// Guardar banner
bannerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let imageUrl = document.getElementById('banner-image-url').value.trim();
    
    // Si se seleccionó un archivo, usar ese nombre
    if (window.selectedBannerImage) {
        imageUrl = `./Banner/${window.selectedBannerImage.name}`;
    }
    
    if (!imageUrl) {
        showToast('Por favor selecciona una imagen para el banner', 'error');
        return;
    }
    
    const bannerData = {
        title: document.getElementById('banner-title').value,
        description: document.getElementById('banner-description').value,
        image: imageUrl,
        order: parseInt(document.getElementById('banner-order').value),
        active: document.getElementById('banner-active').checked,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (editingBannerId) {
            await db.collection('banners').doc(editingBannerId).update(bannerData);
            showToast('Banner actualizado correctamente', 'success');
        } else {
            bannerData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('banners').add(bannerData);
            showToast('Banner agregado correctamente', 'success');
        }
        
        bannerModal.classList.remove('show');
        bannerForm.reset();
        document.getElementById('banner-preview').classList.remove('show');
        editingBannerId = null;
        
        // Limpiar archivos seleccionados
        window.selectedBannerImage = null;
        document.getElementById('banner-image-file').value = '';
        
        loadBanners();
    } catch (error) {
        console.error('Error guardando banner:', error);
        showToast('Error al guardar banner', 'error');
    }
});

// Funciones de banners
window.editBanner = function(bannerId) {
    openBannerModal(bannerId);
};

window.toggleBannerStatus = async function(bannerId) {
    const banner = banners.find(b => b.id === bannerId);
    try {
        await db.collection('banners').doc(bannerId).update({
            active: !banner.active
        });
        showToast('Estado actualizado', 'success');
        loadBanners();
    } catch (error) {
        console.error('Error actualizando estado:', error);
        showToast('Error al actualizar estado', 'error');
    }
};

window.deleteBanner = async function(bannerId) {
    if (!confirm('¿Estás seguro de eliminar este banner?')) return;
    
    try {
        await db.collection('banners').doc(bannerId).delete();
        showToast('Banner eliminado', 'success');
        loadBanners();
    } catch (error) {
        console.error('Error eliminando banner:', error);
        showToast('Error al eliminar banner', 'error');
    }
};

btnAddBanner.addEventListener('click', () => openBannerModal());

// ===== ESTADÍSTICAS =====
function updateStats() {
    totalProductos.textContent = products.length;
    productosActivos.textContent = products.filter(p => p.active).length;
    productosOferta.textContent = products.filter(p => p.onOffer).length;
    totalBanners.textContent = banners.filter(b => b.active).length;
}

// ===== CONFIGURACIÓN =====
// Guardar configuración de contacto
document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const configData = {
        whatsapp: document.getElementById('config-whatsapp').value,
        email: document.getElementById('config-email').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('configuracion').doc('contacto').set(configData, { merge: true });
        showToast('Configuración de contacto guardada', 'success');
        
        // Los cambios se reflejan automáticamente en tiempo real via Firebase listeners
    } catch (error) {
        console.error('Error guardando configuración:', error);
        showToast('Error al guardar configuración', 'error');
    }
});

// Guardar configuración de redes sociales
document.getElementById('social-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const socialData = {
        instagram: document.getElementById('config-instagram').value,
        facebook: document.getElementById('config-facebook').value,
        tiktok: document.getElementById('config-tiktok').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await db.collection('configuracion').doc('redes-sociales').set(socialData, { merge: true });
        showToast('Configuración de redes sociales guardada', 'success');
        
        // Los cambios se reflejan automáticamente en tiempo real via Firebase listeners
    } catch (error) {
        console.error('Error guardando configuración:', error);
        showToast('Error al guardar configuración', 'error');
    }
});

// Botones de ocultar/mostrar redes sociales
document.querySelectorAll('.btn-toggle').forEach(button => {
    button.addEventListener('click', async (e) => {
        const social = e.target.dataset.social;
        const currentText = e.target.textContent.trim();
        const isCurrentlyVisible = currentText === 'Ocultar';
        
        // Si dice "Ocultar" -> ocultar (hidden = true)
        // Si dice "Mostrar" -> mostrar (hidden = false)
        const shouldHide = isCurrentlyVisible;
        
        try {
            await db.collection('configuracion').doc('redes-sociales').update({
                [`${social}_hidden`]: shouldHide,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Actualizar texto del botón
            e.target.textContent = shouldHide ? 'Mostrar' : 'Ocultar';
            e.target.style.background = shouldHide ? 'var(--gray-500)' : 'var(--accent-gradient)';
            
            const action = shouldHide ? 'ocultado' : 'mostrado';
            showToast(`${social.charAt(0).toUpperCase() + social.slice(1)} ${action}`, 'success');
        } catch (error) {
            console.error('Error actualizando visibilidad:', error);
            showToast('Error al actualizar visibilidad', 'error');
        }
    });
});

// Cargar configuración
async function loadConfig() {
    try {
        const contactDoc = await db.collection('configuracion').doc('contacto').get();
        if (contactDoc.exists) {
            const data = contactDoc.data();
            document.getElementById('config-whatsapp').value = data.whatsapp || '';
            document.getElementById('config-email').value = data.email || '';
        }
        
        const socialDoc = await db.collection('configuracion').doc('redes-sociales').get();
        if (socialDoc.exists) {
            const data = socialDoc.data();
            document.getElementById('config-instagram').value = data.instagram || '';
            document.getElementById('config-facebook').value = data.facebook || '';
            document.getElementById('config-tiktok').value = data.tiktok || '';
            
            // Actualizar estado de botones de visibilidad
            updateSocialToggleButtons(data);
        }
    } catch (error) {
        console.error('Error cargando configuración:', error);
    }
}

// Actualizar estado de botones de visibilidad de redes sociales
function updateSocialToggleButtons(data) {
    const socials = ['instagram', 'facebook', 'tiktok'];
    
    socials.forEach(social => {
        const button = document.getElementById(`toggle-${social}`);
        if (button) {
            const isHidden = data[`${social}_hidden`] === true;
            button.textContent = isHidden ? 'Mostrar' : 'Ocultar';
            button.style.background = isHidden ? 'var(--gray-500)' : 'var(--accent-gradient)';
        }
    });
}

// ===== NOTIFICACIONES =====
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== MANEJO DE ERRORES DE IMÁGENES =====
// Interceptar errores de carga de imágenes
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        // Suprimir el warning para placeholder.jpg
        if (!e.target.src.includes('placeholder.jpg')) {
            console.warn('⚠️ Error cargando imagen:', e.target.src);
        }
        
        // Si es placeholder.jpg, reemplazar con un placeholder inline
        if (e.target.src.includes('placeholder.jpg')) {
            e.target.style.display = 'none';
            
            // Crear un placeholder SVG inline
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, #1A0033, #4A0044);
                border-radius: 8px;
                color: #E0E0E0;
                font-size: 2rem;
                opacity: 0.7;
            `;
            placeholder.innerHTML = '<i class="fas fa-image"></i>';
            
            e.target.parentNode.insertBefore(placeholder, e.target);
        }
    }
}, true);

// ===== PREVENIR CARGA DE PLACEHOLDER.JPG =====
// Interceptar intentos de cargar placeholder.jpg antes de que ocurran
const originalImageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
Object.defineProperty(HTMLImageElement.prototype, 'src', {
    get: originalImageSrc.get,
    set: function(value) {
        if (value && value.includes('placeholder.jpg')) {
            // No cargar placeholder.jpg, usar placeholder inline
            this.style.display = 'none';
            
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 200px;
                background: linear-gradient(135deg, #1A0033, #4A0044);
                border-radius: 8px;
                color: #E0E0E0;
                font-size: 2rem;
                opacity: 0.7;
            `;
            placeholder.innerHTML = '<i class="fas fa-image"></i>';
            
            this.parentNode.insertBefore(placeholder, this);
            return;
        }
        originalImageSrc.set.call(this, value);
    }
});

// ===== SIDEBAR SIMPLE =====
const sidebar = document.querySelector('.sidebar');
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const closeSidebarMobile = document.getElementById('close-sidebar-mobile');

// Función simple para cerrar sidebar
function closeSidebar() {
    sidebar.classList.remove('active', 'show');
    if (sidebarOverlay) {
        sidebarOverlay.classList.remove('active');
    }
    document.body.style.overflow = '';
}

// Función simple para abrir sidebar
function openSidebar() {
    sidebar.classList.add('active', 'show');
    if (sidebarOverlay) {
        sidebarOverlay.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
}

// Función simple para toggle sidebar
function toggleSidebar() {
    if (sidebar.classList.contains('active')) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// Event listeners simples
if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', toggleSidebar);
}

if (closeSidebarMobile) {
    closeSidebarMobile.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Cerrar sidebar al hacer click en enlaces del menú (solo en móviles)
const sidebarLinks = sidebar.querySelectorAll('.nav-item');
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    });
});

// Cerrar sidebar al hacer click en cualquier parte del sidebar (solo en móviles)
sidebar.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        // Si no es un enlace de navegación, cerrar el sidebar
        if (!e.target.closest('.nav-item')) {
            closeSidebar();
        }
    }
});

// Cerrar con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        closeSidebar();
    }
});

// Responsive simple
function handleResize() {
    if (window.innerWidth > 768) {
        // Desktop: sidebar normal, ocultar hamburger
        closeSidebar();
        if (hamburgerMenu) hamburgerMenu.style.display = 'none';
        if (closeSidebarMobile) closeSidebarMobile.style.display = 'none';
    } else {
        // Mobile: mostrar hamburger
        closeSidebar();
        if (hamburgerMenu) hamburgerMenu.style.display = 'flex';
        if (closeSidebarMobile) closeSidebarMobile.style.display = 'none';
    }
}

window.addEventListener('resize', handleResize);
window.addEventListener('load', handleResize);

// ===== CATEGORÍAS =====
// Cargar categorías
async function loadCategories() {
    try {
        const snapshot = await db.collection('categorias').orderBy('name', 'asc').get();
        categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderCategories();
        renderCategoriesQuickView();
        updateStats();
    } catch (error) {
        // Suprimir errores de Firebase offline
        if (error.code === 'unavailable' || error.message.includes('offline') || error.message.includes('Failed to get document')) {
            console.log('⚠️ Modo offline: usando datos locales para categorías');
            categories = []; // Usar array vacío en modo offline
            renderCategories();
            renderCategoriesQuickView();
            updateStats();
            return;
        }
        console.error('Error cargando categorías:', error);
        showToast('Error al cargar categorías', 'error');
    }
}

// Renderizar vista rápida de categorías (en sección productos)
function renderCategoriesQuickView() {
    const quickView = document.getElementById('categories-quick-view');
    if (!quickView) return;
    
    if (categories.length === 0) {
        quickView.innerHTML = `
            <p style="color: var(--text-light); margin: 0;">
                <i class="fas fa-info-circle"></i>
                No hay categorías creadas. Haz clic en "Agregar Categoría" para crear una.
            </p>
        `;
        return;
    }
    
    quickView.innerHTML = categories.map(category => {
        // Usar la variable global de productos actualizada
        const productCount = AppState.products.filter(p => p.category === category.name).length;
        return `
            <div class="category-chip">
                ${category.icon ? category.icon : '🏷️'}
                <span>${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</span>
                <span class="category-chip-count">${productCount}</span>
            </div>
        `;
    }).join('');
    
    // También actualizar el filtro de categorías
    const filterCategory = document.getElementById('filter-category');
    if (filterCategory) {
        filterCategory.innerHTML = '<option value="todos">Todas las categorías</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1);
            filterCategory.appendChild(option);
        });
    }
}

// Renderizar categorías
function renderCategories() {
    const categoriesGrid = document.getElementById('categories-grid');
    if (!categoriesGrid) return;
    
    if (categories.length === 0) {
        categoriesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-tags" style="font-size: 3rem; opacity: 0.5; margin-bottom: 1rem;"></i>
                <h3>No hay categorías</h3>
                <p>Crea tu primera categoría para empezar a organizar tus productos</p>
            </div>
        `;
        return;
    }
    
    categoriesGrid.innerHTML = categories.map(category => {
        const productCount = products.filter(p => p.category === category.name).length;
        
        return `
            <div class="category-card">
                <div class="category-card-header">
                    ${category.icon ? `<i class="fas ${category.icon} category-icon"></i>` : ''}
                    <h3>${category.name}</h3>
                </div>
                <p class="category-description">${category.description || 'Sin descripción'}</p>
                <div class="category-stats">
                    <span class="category-count">
                        <i class="fas fa-box"></i> ${productCount} producto${productCount !== 1 ? 's' : ''}
                    </span>
                    <div class="category-actions">
                        <button class="btn-icon-sm" onclick="editCategory('${category.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon-sm delete" onclick="deleteCategory('${category.id}')" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Abrir modal de categoría
function openCategoryModal(categoryId = null) {
    editingCategoryId = categoryId;
    const modalTitle = document.getElementById('modal-category-title');
    const categoryModal = document.getElementById('category-modal');
    
    if (categoryId) {
        const category = categories.find(c => c.id === categoryId);
        modalTitle.textContent = 'Editar Categoría';
        
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-icon').value = category.icon || '';
        document.getElementById('category-description').value = category.description || '';
    } else {
        modalTitle.textContent = 'Agregar Categoría';
        document.getElementById('category-form').reset();
    }
    
    categoryModal.classList.add('show');
}


// Preview de ícono en categorías
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('icon-option')) {
        const selectedIcon = e.target.dataset.icon;
        const previewIcon = document.getElementById('preview-icon');
        const hiddenInput = document.getElementById('category-icon');
        
        // Actualizar preview
        previewIcon.textContent = selectedIcon || '❓';
        
        // Actualizar input hidden
        hiddenInput.value = selectedIcon;
        
        // Actualizar estilos de botones
        document.querySelectorAll('.icon-option').forEach(btn => {
            btn.style.background = 'rgba(255,255,255,0.1)';
            btn.style.border = '1px solid var(--primary-color)';
        });
        
        // Resaltar botón seleccionado
        e.target.style.background = 'var(--accent-gradient)';
        e.target.style.border = '2px solid var(--primary-color)';
    }
});

// Guardar categoría
document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const categoryName = document.getElementById('category-name').value.trim().toLowerCase();
    
    if (!categoryName) {
        showToast('Por favor ingresa el nombre de la categoría', 'error');
        return;
    }
    
    // Verificar si ya existe (solo al crear)
    if (!editingCategoryId) {
        const exists = categories.some(c => c.name === categoryName);
        if (exists) {
            showToast('Ya existe una categoría con ese nombre', 'error');
            return;
        }
    }
    
    const categoryData = {
        name: categoryName,
        icon: document.getElementById('category-icon').value,
        description: document.getElementById('category-description').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (editingCategoryId) {
            await db.collection('categorias').doc(editingCategoryId).update(categoryData);
            showToast('Categoría actualizada correctamente', 'success');
        } else {
            categoryData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('categorias').add(categoryData);
            showToast('Categoría agregada correctamente', 'success');
        }
        
        document.getElementById('category-modal').classList.remove('show');
        document.getElementById('category-form').reset();
        editingCategoryId = null;
        loadCategories();
        loadCategories(); // Recargar para actualizar el select en productos
    } catch (error) {
        console.error('Error guardando categoría:', error);
        showToast('Error al guardar categoría', 'error');
    }
});

// Editar categoría
window.editCategory = function(categoryId) {
    openCategoryModal(categoryId);
};

// Eliminar categoría
window.deleteCategory = async function(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    const productCount = products.filter(p => p.category === category.name).length;
    
    if (productCount > 0) {
        if (!confirm(`Esta categoría tiene ${productCount} producto(s). ¿Estás seguro de eliminarla? Los productos quedarán sin categoría.`)) {
            return;
        }
    } else {
        if (!confirm('¿Estás seguro de eliminar esta categoría?')) {
            return;
        }
    }
    
    try {
        await db.collection('categorias').doc(categoryId).delete();
        showToast('Categoría eliminada', 'success');
        loadCategories();
    } catch (error) {
        console.error('Error eliminando categoría:', error);
        showToast('Error al eliminar categoría', 'error');
    }
};

// ===== MODO OFFLINE =====
function checkFirebaseConnection() {
    if (!db) {
        isOfflineMode = true;
        console.log('🔄 Modo offline activado - Firebase no disponible');
        return;
    }
    
    // Intentar una operación simple para verificar conexión
    db.collection('test').limit(1).get()
        .then(() => {
            isOfflineMode = false;
            console.log('✅ Conexión a Firebase establecida');
        })
        .catch(() => {
            isOfflineMode = true;
            console.log('🔄 Modo offline activado - Sin conexión a Firebase');
        });
}

// ===== CARGAR DATOS =====
function loadAllData() {
    checkFirebaseConnection();
    
    if (isOfflineMode) {
        console.log('📱 Cargando datos en modo offline...');
        // Cargar datos locales o mostrar mensaje
        showToast('Modo offline - Algunas funciones pueden estar limitadas', 'warning');
    }
    
    loadCategories();
    loadProducts();
    loadBanners();
    loadConfig();
}

// ===== INICIALIZACIÓN =====
console.log('Panel de administración cargado correctamente');

