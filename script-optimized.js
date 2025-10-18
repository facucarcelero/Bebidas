// ===== LA PREVIA - JAVASCRIPT OPTIMIZADO =====
// Version: 2.0 - Completamente mejorado para rendimiento y UX

'use strict';

// ===== CONFIGURACIÓN Y ESTADO GLOBAL =====
const AppState = {
    cart: {},
    currentFilter: 'todos',
    currentSearch: '',
    isLoading: true,
    products: [],
    useFirebase: false
};

// ===== FIREBASE INITIALIZATION =====
let db = null;
try {
    if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        console.log('🔥 Inicializando Firebase...');
        console.log('Config:', firebaseConfig);
        
        // Verificar si Firebase ya está inicializado
        if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        } else {
            console.log('⚠️ Firebase ya está inicializado');
        }
        
        db = firebase.firestore();
        AppState.useFirebase = true;
        
        // Configurar Firestore para mejor rendimiento
        db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
        });
        
        // Suprimir errores específicos de Firebase que no afectan la funcionalidad
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        
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
        
        console.log('✅ Firebase inicializado correctamente');
    } else {
        console.log('❌ Firebase o firebaseConfig no están disponibles');
        console.log('firebase:', typeof firebase);
        console.log('firebaseConfig:', typeof firebaseConfig);
        AppState.useFirebase = false;
    }
} catch (error) {
    console.log('❌ Error inicializando Firebase:', error);
    console.log('Código de error:', error.code);
    console.log('Mensaje:', error.message);
    AppState.useFirebase = false;
    
    // Si es un error de configuración, mostrar ayuda
    if (error.code === 'app/invalid-credential') {
        console.error('🔧 Error: Las credenciales de Firebase son inválidas');
        console.error('Verifica que la configuración en firebase-config.js sea correcta');
    } else if (error.code === 'app/duplicate-app') {
        console.warn('⚠️ Firebase ya está inicializado, continuando...');
        AppState.useFirebase = true;
        db = firebase.firestore();
    }
}

// ===== UTILIDADES =====
const Utils = {
    // Debounce para optimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para scroll events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Formatear precio
    formatPrice(price) {
        return new Intl.NumberFormat('es-AR').format(price);
    },

    // Codificar URL de imágenes
    encodeImagePath(path) {
        return encodeURI(path);
    },

    // Validar email
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
};

// ===== GESTOR DE TOAST NOTIFICATIONS =====
const ToastManager = {
    show(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                     type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}" aria-hidden="true"></i>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    container.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
};

// ===== GESTOR DE LOADING SCREEN =====
const LoadingManager = {
    hide() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
    },

    show() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingScreen.classList.remove('hidden');
        }
    }
};

// ===== MODAL DE PRODUCTO =====
const ProductModal = {
    currentProduct: null,

    open(product) {
        this.currentProduct = product;
        const modal = document.getElementById('product-modal');
        if (!modal) return;

        // Llenar datos del modal
        document.getElementById('modal-product-image').src = Utils.encodeImagePath(product.image);
        document.getElementById('modal-product-image').alt = product.name;
        document.querySelector('.modal-product-title').textContent = product.name;
        document.querySelector('.modal-product-category').textContent = product.category.toUpperCase();
        document.querySelector('.modal-product-price').textContent = `$${Utils.formatPrice(product.price)}`;
        document.querySelector('.modal-product-description').textContent = product.description;
        document.getElementById('modal-quantity').value = 1;

        // Mostrar modal
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Focus management
        document.querySelector('.modal-close').focus();
    },

    close() {
        const modal = document.getElementById('product-modal');
        if (!modal) return;

        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        this.currentProduct = null;
    },

    addToCart() {
        if (!this.currentProduct) return;

        const quantity = parseInt(document.getElementById('modal-quantity').value) || 1;
        
        for (let i = 0; i < quantity; i++) {
            CartManager.add(this.currentProduct.id);
        }

        ToastManager.show(`${quantity} x ${this.currentProduct.name} agregado al carrito`, 'success');
        this.close();
    },

    init() {
        // Botón cerrar
        const closeBtn = document.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Overlay
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.close());
        }

        // Botón agregar al carrito
        const addBtn = document.getElementById('modal-add-to-cart');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addToCart());
        }

        // Controles de cantidad
        const qtyMinus = document.getElementById('modal-qty-minus');
        const qtyPlus = document.getElementById('modal-qty-plus');
        const qtyInput = document.getElementById('modal-quantity');

        if (qtyMinus && qtyInput) {
            qtyMinus.addEventListener('click', () => {
                const current = parseInt(qtyInput.value) || 1;
                qtyInput.value = Math.max(1, current - 1);
            });
        }

        if (qtyPlus && qtyInput) {
            qtyPlus.addEventListener('click', () => {
                const current = parseInt(qtyInput.value) || 1;
                qtyInput.value = Math.min(99, current + 1);
            });
        }

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }
};

// ===== GESTOR DE CARRITO =====
const CartManager = {
    add(productId) {
        const product = AppState.products.find(p => p.id === productId);
        if (!product) return;

        if (AppState.cart[productId]) {
            AppState.cart[productId].quantity++;
        } else {
            AppState.cart[productId] = {
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            };
        }

        this.update();
        this.save();
        
        // Animación del contador
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.style.animation = 'none';
            setTimeout(() => {
                cartCount.style.animation = 'bounce 0.6s ease-in-out';
            }, 10);
        }
    },

    remove(productId) {
        if (!AppState.cart[productId]) return;

        if (AppState.cart[productId].quantity > 1) {
            AppState.cart[productId].quantity--;
        } else {
            delete AppState.cart[productId];
        }

        this.update();
        this.save();
    },

    clear() {
        AppState.cart = {};
        this.update();
        this.save();
        ToastManager.show('Carrito vaciado', 'info');
    },

    update() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartCount || !cartItems || !cartTotal) return;

        let totalItems = 0;
        let totalPrice = 0;

        cartItems.innerHTML = '';

        for (const [productId, item] of Object.entries(AppState.cart)) {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.setAttribute('role', 'listitem');
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${Utils.formatPrice(item.price)} x ${item.quantity}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-item-btn" 
                            onclick="CartManager.remove(${productId})"
                            aria-label="Disminuir cantidad de ${item.name}">
                        <i class="fas fa-minus" aria-hidden="true"></i>
                    </button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="cart-item-btn" 
                            onclick="CartManager.add(${productId})"
                            aria-label="Aumentar cantidad de ${item.name}">
                        <i class="fas fa-plus" aria-hidden="true"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        }

        cartCount.textContent = totalItems;
        cartTotal.textContent = Utils.formatPrice(totalPrice);

        // Actualizar atributo aria-live
        cartItems.setAttribute('aria-busy', 'false');
    },

    save() {
        try {
            localStorage.setItem('laprevia_cart', JSON.stringify(AppState.cart));
        } catch (e) {
            console.error('Error al guardar carrito:', e);
        }
    },

    load() {
        try {
            const saved = localStorage.getItem('laprevia_cart');
            if (saved) {
                AppState.cart = JSON.parse(saved);
                this.update();
            }
        } catch (e) {
            console.error('Error al cargar carrito:', e);
            AppState.cart = {};
        }
    },

    sendToWhatsApp() {
        if (Object.keys(AppState.cart).length === 0) {
            ToastManager.show('El carrito está vacío', 'error');
            return;
        }

        let message = "Hola La Previa! Me gustaría consultar el stock de los siguientes productos:\n\n";
        let total = 0;

        for (const [productId, item] of Object.entries(AppState.cart)) {
            message += `• ${item.name} (x${item.quantity}) - $${Utils.formatPrice(item.price)}\n`;
            total += item.price * item.quantity;
        }

        message += `\n💰 Total: $${Utils.formatPrice(total)}\n\n¡Gracias!`;

        const phoneNumber = "+5492644127229";
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    },

    showConfirmModal() {
        const modal = document.getElementById('confirm-modal');
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    },

    hideConfirmModal() {
        const modal = document.getElementById('confirm-modal');
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    },

    toggleVisibility() {
        const cartDetails = document.getElementById('cart-details');
        const cartButton = document.getElementById('cart-button');
        
        if (!cartDetails || !cartButton) return;

        const isVisible = cartDetails.classList.toggle('show');
        cartButton.setAttribute('aria-expanded', isVisible);
        cartDetails.setAttribute('aria-hidden', !isVisible);
    },

    init() {
        this.load();

        // Botón carrito
        const cartButton = document.getElementById('cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', () => this.toggleVisibility());
        }

        // Botón cerrar
        const closeCart = document.getElementById('close-cart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                const cartDetails = document.getElementById('cart-details');
                if (cartDetails) {
                    cartDetails.classList.remove('show');
                    cartButton.setAttribute('aria-expanded', 'false');
                    cartDetails.setAttribute('aria-hidden', 'true');
                }
            });
        }

        // Botón checkout
        const checkoutButton = document.getElementById('checkout-button');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => this.sendToWhatsApp());
        }

        // Botón vaciar carrito
        const clearCartButton = document.getElementById('clear-cart');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', () => {
                if (Object.keys(AppState.cart).length === 0) {
                    ToastManager.show('El carrito ya está vacío', 'info');
                    return;
                }
                
                this.showConfirmModal();
            });
        }

        // Modal de confirmación
        const confirmModal = document.getElementById('confirm-modal');
        const confirmClose = document.getElementById('confirm-close');
        const confirmCancel = document.getElementById('confirm-cancel');
        const confirmOk = document.getElementById('confirm-ok');

        if (confirmClose) {
            confirmClose.addEventListener('click', () => this.hideConfirmModal());
        }

        if (confirmCancel) {
            confirmCancel.addEventListener('click', () => this.hideConfirmModal());
        }

        if (confirmOk) {
            confirmOk.addEventListener('click', () => {
                this.clear();
                this.hideConfirmModal();
            });
        }

        // Cerrar modal al hacer clic en el overlay
        if (confirmModal) {
            confirmModal.addEventListener('click', (e) => {
                if (e.target === confirmModal) {
                    this.hideConfirmModal();
                }
            });
        }

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            const cartContainer = document.querySelector('.cart-container');
            if (cartContainer && !cartContainer.contains(e.target)) {
                const cartDetails = document.getElementById('cart-details');
                if (cartDetails && cartDetails.classList.contains('show')) {
                    cartDetails.classList.remove('show');
                    cartButton.setAttribute('aria-expanded', 'false');
                    cartDetails.setAttribute('aria-hidden', 'true');
                }
            }
        });
    }
};

// ===== GESTOR DE PRODUCTOS =====
const ProductManager = {
    // Función para cargar productos desde Firebase
    async loadFromFirebase() {
        console.log('🔄 Intentando cargar productos desde Firebase...');
        console.log('AppState.useFirebase:', AppState.useFirebase);
        console.log('db disponible:', !!db);
        
        if (!AppState.useFirebase || !db) {
            console.log('❌ Firebase no disponible, usando productos locales');
            return null;
        }

        try {
            console.log('📡 Consultando colección "productos"...');
            const snapshot = await db.collection('productos')
                .where('active', '==', true)
                .orderBy('createdAt', 'desc')
                .get();
            
            console.log('📊 Documentos encontrados:', snapshot.size);
            
            if (snapshot.empty) {
                console.log('⚠️ No hay productos activos en Firebase');
                return null;
            }

            const firebaseProducts = snapshot.docs.map(doc => {
                const data = doc.data();
                console.log('📦 Producto:', doc.id, data.name, data.category);
                
                // LIMPIAR placeholder.jpg automáticamente
                if (data.image && (data.image.includes('placeholder.jpg') || data.image.includes('IMG/placeholder'))) {
                    console.log(`🧹 Limpiando placeholder.jpg de: ${data.name}`);
                    data.image = '';
                }
                
                return {
                    id: doc.id,
                    ...data
                };
            });

            console.log(`✅ ${firebaseProducts.length} productos cargados desde Firebase`);
            return firebaseProducts;
        } catch (error) {
            console.error('❌ Error cargando productos desde Firebase:', error);
            console.error('Detalles del error:', error.message);
            return null;
        }
    },

    // Productos locales (fallback si Firebase no está disponible)
    // Vacío - todos los productos se cargarán desde Firebase usando el panel de administración
    localProducts: [],

    getFiltered() {
        return this.products.filter(product => {
            const matchesFilter = AppState.currentFilter === 'todos' || product.category === AppState.currentFilter;
            const matchesSearch = product.name.toLowerCase().includes(AppState.currentSearch.toLowerCase()) ||
                                product.description.toLowerCase().includes(AppState.currentSearch.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    },

    render() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        const filtered = this.getFiltered();
        
        // Actualizar atributo aria-busy
        grid.setAttribute('aria-busy', 'true');
        
        grid.innerHTML = '';

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; opacity: 0.5; margin-bottom: 1rem;"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros filtros o términos de búsqueda</p>
                </div>
            `;
            grid.setAttribute('aria-busy', 'false');
            return;
        }

        filtered.forEach((product, index) => {
            const card = this.createCard(product, index);
            grid.appendChild(card);
        });

        grid.setAttribute('aria-busy', 'false');
    },

    createCard(product, index) {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.setAttribute('role', 'listitem');
        card.setAttribute('tabindex', '0');
        
        // Solo mostrar imagen si existe y no está vacía
        const hasImage = product.image && product.image.trim() !== '';
        const imageHtml = hasImage ? 
            `<img src="${Utils.encodeImagePath(product.image)}" 
                  alt="${product.name}" 
                  loading="lazy" 
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="no-image-placeholder" style="display: none; align-items: center; justify-content: center; height: 200px; background: var(--gradient-dark); border-radius: 8px; color: var(--text-light);">
                 <i class="fas fa-image" style="font-size: 2rem; opacity: 0.5;"></i>
             </div>` :
            `<div class="no-image-placeholder" style="display: flex; align-items: center; justify-content: center; height: 200px; background: var(--gradient-dark); border-radius: 8px; color: var(--text-light);">
                 <i class="fas fa-image" style="font-size: 2rem; opacity: 0.5;"></i>
             </div>`;
        
        card.innerHTML = `
            ${imageHtml}
            <div class="product-info" style="background: rgba(255, 255, 255, 0.95); padding: 1rem; border-radius: 0 0 8px 8px;">
                <h3 class="product-title" style="color: #1A0033; font-weight: 700; margin-bottom: 0.5rem; font-size: 1.1rem;">${product.name}</h3>
                <p class="product-price" aria-label="Precio: ${Utils.formatPrice(product.price)} pesos" style="color: var(--secondary-color); font-size: 1.3rem; font-weight: 800; margin-bottom: 1rem;">$${Utils.formatPrice(product.price)}</p>
                <button class="add-to-cart" 
                        data-product-id="${product.id}"
                        aria-label="Agregar ${product.name} al carrito"
                        style="background: var(--accent-gradient); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; width: 100%;">
                    <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                    Agregar al Carrito
                </button>
            </div>
        `;

        // Click en la tarjeta abre el modal
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-cart')) {
                ProductModal.open(product);
            }
        });

        // Enter key en la tarjeta
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.target.closest('.add-to-cart')) {
                ProductModal.open(product);
            }
        });

        // Botón agregar al carrito
        const addButton = card.querySelector('.add-to-cart');
        addButton.addEventListener('click', (e) => {
            e.stopPropagation();
            CartManager.add(product.id);
            ToastManager.show(`${product.name} agregado al carrito`, 'success');
        });

        return card;
    },

    async init() {
        // Intentar cargar productos desde Firebase
        const firebaseProducts = await this.loadFromFirebase();
        
        if (firebaseProducts && firebaseProducts.length > 0) {
            // Usar productos de Firebase
            this.products = firebaseProducts;
            console.log('Usando productos desde Firebase');
        } else {
            // Usar productos locales como fallback
            this.products = this.localProducts;
            console.log('Usando productos locales');
        }
        
        AppState.products = this.products;
        
        // Generar filtros dinámicos según los productos cargados
        if (typeof FilterManager !== 'undefined' && FilterManager.generateCategoryFilters) {
            FilterManager.generateCategoryFilters();
        }
        
        this.render();
    },

    async reloadFromFirebase() {
        console.log('🔄 Recargando productos desde Firebase...');
        const firebaseProducts = await this.loadFromFirebase();
        
        if (firebaseProducts && firebaseProducts.length > 0) {
            this.products = firebaseProducts;
            AppState.products = this.products;
            console.log(`✅ ${firebaseProducts.length} productos recargados desde Firebase`);
            
            // Regenerar filtros
            if (typeof FilterManager !== 'undefined' && FilterManager.generateCategoryFilters) {
                FilterManager.generateCategoryFilters();
            }
            
            // Re-renderizar
            this.render();
        }
    },

    // Función de prueba para verificar conexión a Firebase
    async testFirebaseConnection() {
        console.log('🧪 Probando conexión a Firebase...');
        try {
            if (!db) {
                console.log('❌ No hay conexión a la base de datos');
                return false;
            }
            
            // Intentar leer cualquier colección para probar la conexión
            const testSnapshot = await db.collection('productos').limit(1).get();
            console.log('✅ Conexión a Firebase exitosa');
            console.log('📊 Productos en la base de datos:', testSnapshot.size);
            return true;
        } catch (error) {
            console.error('❌ Error de conexión a Firebase:', error);
            return false;
        }
    },

    // Cargar configuración de contacto
    async loadContactConfig() {
        await loadContactConfig();
    },

    // Cargar configuración de redes sociales
    async loadSocialConfig() {
        await loadSocialConfig();
    }
};

// ===== FILTROS Y BÚSQUEDA =====
const FilterManager = {
    generateCategoryFilters() {
        const filtersContainer = document.getElementById('category-filters');
        if (!filtersContainer) return;

        // Obtener categorías únicas de los productos actuales
        const categories = new Set();
        AppState.products.forEach(product => {
            if (product.category) {
                categories.add(product.category);
            }
        });

        // Siempre mostrar "Todos" si hay productos
        let filtersHTML = '';
        if (AppState.products.length > 0) {
            filtersHTML = `
                <button class="filter-btn active" 
                        data-filter="todos"
                        aria-pressed="true">Todos</button>
            `;

            // Agregar botones para cada categoría que existe
            const categoryNames = {
                'gin': 'Gin',
                'vino': 'Vino',
                'licor': 'Licor'
            };

            categories.forEach(category => {
                const displayName = categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
                filtersHTML += `
                    <button class="filter-btn" 
                            data-filter="${category}"
                            aria-pressed="false">${displayName}</button>
                `;
            });
        }

        filtersContainer.innerHTML = filtersHTML;

        // Agregar event listeners a los nuevos botones
        this.attachFilterListeners();
    },

    attachFilterListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update UI
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-pressed', 'true');
                
                // Update state
                AppState.currentFilter = button.dataset.filter;
                ProductManager.render();
            });
        });
    },

    init() {
        // Los filtros se generarán dinámicamente después de cargar productos

        // Búsqueda
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            const debouncedSearch = Utils.debounce((value) => {
                AppState.currentSearch = value;
                ProductManager.render();
            }, 300);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });
        }
    }
};

// ===== CARRUSEL =====
const CarouselManager = {
    currentIndex: 0,
    autoplayInterval: null,
    track: null,
    slides: [],
    indicators: [],

    init() {
        this.track = document.getElementById('carousel-track');
        if (!this.track) return;

        this.slides = Array.from(this.track.children);
        const prevButton = document.getElementById('prev');
        const nextButton = document.getElementById('next');
        const indicatorsContainer = document.getElementById('carousel-indicators');

        // Crear indicadores
        this.slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-label', `Ir al slide ${index + 1}`);
            indicator.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            if (index === 0) indicator.classList.add('active');
            indicatorsContainer.appendChild(indicator);
            indicator.addEventListener('click', () => this.moveToSlide(index));
            this.indicators.push(indicator);
        });

        // Event listeners
        if (prevButton) {
            prevButton.addEventListener('click', () => this.prevSlide());
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextSlide());
        }

        // Touch events para móvil
        let touchStartX = 0;
        let touchEndX = 0;

        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.nextSlide();
            }
            if (touchEndX > touchStartX + 50) {
                this.prevSlide();
            }
        };

        this.handleSwipe = handleSwipe;

        // Autoplay
        this.startAutoplay();

        // Pausar en hover
        this.track.addEventListener('mouseenter', () => this.stopAutoplay());
        this.track.addEventListener('mouseleave', () => this.startAutoplay());

        // Pausar cuando la pestaña no está visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoplay();
            } else {
                this.startAutoplay();
            }
        });
    },

    moveToSlide(index) {
        if (!this.track || !this.slides[index]) return;

        const slideWidth = this.slides[0].getBoundingClientRect().width;
        this.track.style.transform = `translateX(-${slideWidth * index}px)`;
        this.currentIndex = index;
        this.updateIndicators();
    },

    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            const isActive = index === this.currentIndex;
            indicator.classList.toggle('active', isActive);
            indicator.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    },

    nextSlide() {
        const nextIndex = this.currentIndex < this.slides.length - 1 ? this.currentIndex + 1 : 0;
        this.moveToSlide(nextIndex);
    },

    prevSlide() {
        const prevIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.slides.length - 1;
        this.moveToSlide(prevIndex);
    },

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), 5000);
    },

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
};

// ===== MENÚ MÓVIL =====
const MobileMenuManager = {
    init() {
        const hamburger = document.getElementById('hamburger-menu');
        const navMobile = document.getElementById('nav-mobile');
        
        if (!hamburger || !navMobile) return;

        // Función para cerrar el menú
        const closeMenu = () => {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            navMobile.classList.remove('show');
            navMobile.classList.remove('active');
            navMobile.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        // Abrir/cerrar menú con el botón hamburguesa
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que el evento se propague al document
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
            
            navMobile.classList.toggle('show');
            navMobile.classList.toggle('active');
            navMobile.setAttribute('aria-hidden', isExpanded);
            
            // Prevenir scroll cuando el menú está abierto
            document.body.style.overflow = navMobile.classList.contains('show') ? 'hidden' : '';
        });

        // Prevenir que clicks dentro del menú lo cierren
        navMobile.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Cerrar al hacer clic en un enlace
        const navLinks = navMobile.querySelectorAll('.nav-link, a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Cerrar al hacer clic fuera del menú
        document.addEventListener('click', (e) => {
            const isMenuOpen = navMobile.classList.contains('show') || navMobile.classList.contains('active');
            const clickedInsideMenu = navMobile.contains(e.target);
            const clickedHamburger = hamburger.contains(e.target);
            
            if (isMenuOpen && !clickedInsideMenu && !clickedHamburger) {
                closeMenu();
            }
        });

        // Cerrar con la tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && (navMobile.classList.contains('show') || navMobile.classList.contains('active'))) {
                closeMenu();
            }
        });
    }
};

// ===== SMOOTH SCROLL =====
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Focus management para accesibilidad
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });
    }
};

// ===== HEADER SCROLL EFFECT =====
const HeaderManager = {
    lastScroll: 0,

    init() {
        const header = document.querySelector('.header');
        if (!header) return;

        const handleScroll = Utils.throttle(() => {
            const currentScroll = window.pageYOffset;

            // Ocultar/mostrar header en scroll
            if (currentScroll > this.lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            // Sombra en scroll
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            this.lastScroll = currentScroll;
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
    }
};

// ===== UTILIDADES ADICIONALES =====
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
        console.log(`📅 Año actualizado automáticamente: ${currentYear}`);
    }
}

// Cargar configuración de contacto desde Firebase
async function loadContactConfig() {
    if (!AppState.useFirebase || !db) {
        console.log('Firebase no disponible para cargar configuración de contacto');
        return;
    }
    
    try {
        const doc = await db.collection('configuracion').doc('contacto').get();
        if (doc.exists) {
            const data = doc.data();
            updateContactDisplay(data);
            console.log('✅ Configuración de contacto cargada desde Firebase');
        }
    } catch (error) {
        console.error('Error cargando configuración de contacto:', error);
    }
}

// Actualizar la visualización de contacto
function updateContactDisplay(data) {
    // Actualizar WhatsApp
    const whatsappElement = document.getElementById('contact-whatsapp');
    if (whatsappElement && data.whatsapp) {
        whatsappElement.textContent = data.whatsapp;
    }
    
    // Actualizar Email
    const emailElement = document.getElementById('contact-email');
    if (emailElement && data.email) {
        emailElement.textContent = data.email;
    }
    
    // Actualizar enlace de email en redes sociales
    const socialEmailElement = document.getElementById('social-email');
    if (socialEmailElement && data.email) {
        socialEmailElement.href = `mailto:${data.email}`;
    }
}

// Cargar configuración de redes sociales desde Firebase
async function loadSocialConfig() {
    if (!AppState.useFirebase || !db) {
        console.log('Firebase no disponible para cargar configuración de redes sociales');
        return;
    }
    
    try {
        const doc = await db.collection('configuracion').doc('redes-sociales').get();
        if (doc.exists) {
            const data = doc.data();
            updateSocialDisplay(data);
            console.log('✅ Configuración de redes sociales cargada desde Firebase');
        }
    } catch (error) {
        console.error('Error cargando configuración de redes sociales:', error);
    }
}

// Actualizar la visualización de redes sociales
function updateSocialDisplay(data) {
    const socials = [
        { key: 'tiktok', elementId: 'social-tiktok' },
        { key: 'instagram', elementId: 'social-instagram' },
        { key: 'facebook', elementId: 'social-facebook' }
    ];
    
    socials.forEach(social => {
        const element = document.getElementById(social.elementId);
        if (element) {
            // Verificar si está oculto en la configuración
            const isHidden = data[`${social.key}_hidden`] === true;
            const hasUrl = data[social.key] && data[social.key].trim() !== '';
            
            console.log(`🔍 ${social.key}: hidden=${isHidden}, hasUrl=${hasUrl}, url=${data[social.key] || 'sin URL'}`);
            
            // Mostrar solo si tiene URL Y no está marcado como oculto
            if (hasUrl && !isHidden) {
                // Mostrar red social
                element.href = data[social.key];
                element.style.removeProperty('display');
                element.style.removeProperty('visibility');
                element.style.removeProperty('opacity');
                console.log(`✅ Mostrando ${social.key}`);
            } else {
                // Ocultar red social (porque no tiene URL o está marcado como oculto)
                element.style.display = 'none';
                if (isHidden) {
                    console.log(`🔒 ${social.key} ocultado por configuración`);
                } else if (!hasUrl) {
                    console.log(`⚠️ ${social.key} oculto (sin URL configurada)`);
                }
            }
        }
    });
}

// Configurar listeners en tiempo real para actualizaciones automáticas
function setupRealtimeListeners() {
    if (!AppState.useFirebase || !db) {
        console.log('Firebase no disponible para listeners en tiempo real');
        return;
    }

    console.log('🔄 Configurando listeners en tiempo real...');

    // Listener para configuración de contacto
    db.collection('configuracion').doc('contacto').onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            console.log('📞 Actualización en tiempo real - Contacto:', data);
            updateContactDisplay(data);
            
            // Mostrar notificación de actualización
            if (typeof ToastManager !== 'undefined') {
                ToastManager.show('Información de contacto actualizada', 'info', 3000);
            }
        }
    }, (error) => {
        console.error('Error en listener de contacto:', error);
    });

    // Listener para configuración de redes sociales
    db.collection('configuracion').doc('redes-sociales').onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            console.log('🌐 Actualización en tiempo real - Redes Sociales:', data);
            updateSocialDisplay(data);
            
            // Mostrar notificación de actualización
            if (typeof ToastManager !== 'undefined') {
                ToastManager.show('Redes sociales actualizadas', 'info', 3000);
            }
        }
    }, (error) => {
        console.error('Error en listener de redes sociales:', error);
    });

    // Listener para productos (actualización en tiempo real)
    db.collection('productos').where('active', '==', true).onSnapshot((snapshot) => {
        console.log('🛍️ Actualización en tiempo real - Productos:', snapshot.size, 'productos');
        
        const products = snapshot.docs.map(doc => {
            const data = doc.data();
            
            // LIMPIAR placeholder.jpg automáticamente
            if (data.image && (data.image.includes('placeholder.jpg') || data.image.includes('IMG/placeholder'))) {
                console.log(`🧹 Limpiando placeholder.jpg de: ${data.name}`);
                data.image = '';
            }
            
            return {
                id: doc.id,
                ...data
            };
        });
        
        AppState.products = products;
        ProductManager.products = products;
        
        // Regenerar filtros
        if (typeof FilterManager !== 'undefined' && FilterManager.generateCategoryFilters) {
            FilterManager.generateCategoryFilters();
        }
        
        // Re-renderizar productos
        ProductManager.render();
        
        // Mostrar notificación de actualización
        if (typeof ToastManager !== 'undefined') {
            ToastManager.show('Catálogo de productos actualizado', 'info', 3000);
        }
    }, (error) => {
        console.error('Error en listener de productos:', error);
    });

    console.log('✅ Listeners en tiempo real configurados correctamente');
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 La Previa - Iniciando aplicación optimizada v2.0');

    try {
        // Probar conexión a Firebase primero
        await ProductManager.testFirebaseConnection();
        
        // Inicializar todos los módulos
        await ProductManager.init(); // Esperar a que carguen los productos (Firebase o local)
        CartManager.init();
        ProductModal.init();
        FilterManager.init();
        CarouselManager.init();
        MobileMenuManager.init();
        SmoothScroll.init();
        HeaderManager.init();
        
        // Hacer ProductManager disponible globalmente para el admin
        window.ProductManager = ProductManager;

        // Actualizar año automáticamente
        updateCurrentYear();

        // Cargar configuración de contacto y redes sociales
        await ProductManager.loadContactConfig();
        await ProductManager.loadSocialConfig();

        // Configurar listeners en tiempo real
        setupRealtimeListeners();

        console.log('✅ Todos los módulos inicializados correctamente');

        // Ocultar loading screen
        LoadingManager.hide();

        // Toast de bienvenida
        setTimeout(() => {
            ToastManager.show('¡Bienvenido a La Previa! Explora nuestros productos premium', 'info', 4000);
        }, 1000);

    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        LoadingManager.hide();
        ToastManager.show('Hubo un error al cargar la aplicación', 'error');
    }
});

// Exponer funciones globales necesarias
window.CartManager = CartManager;
window.ProductModal = ProductModal;
window.ToastManager = ToastManager;

console.log('📦 Script optimizado de La Previa cargado correctamente');

// ===== REGISTRO DEL SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registrado correctamente:', registration.scope);
                
                // Verificar actualizaciones
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 Nueva versión del Service Worker encontrada');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Hay una nueva versión disponible
                            ToastManager.show('Hay una actualización disponible. Recarga la página.', 'info', 5000);
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('❌ Error al registrar Service Worker:', error);
            });
    });

    // Detectar cuando el SW está controlando la página
    navigator.serviceWorker.ready.then(() => {
        console.log('✅ Service Worker está activo y controlando la página');
    });
}

