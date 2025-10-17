// JavaScript Final para inFusion - Sin problemas de codificación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 JavaScript final iniciado');
    
    // Datos de productos con rutas corregidas
    const products = [
        {
            id: 1,
            name: "Gin Belladonna",
            price: 25000,
            image: "IMG/Gin Belladonna.jpg",
            category: "gin",
            description: "Gin premium con cambio de color"
        },
        {
            id: 2,
            name: "Cordero Con Piel de Lobo Malbec",
            price: 5500,
            image: "IMG/Cordero Con Piel de Lobo Malbec.jpg",
            category: "vino",
            description: "Vino tinto premium"
        },
        {
            id: 3,
            name: "BEEFEATER GIN X 700 CC",
            price: 18000,
            image: "IMG/BEEFEATER GIN X 700 CC.jpg",
            category: "gin",
            description: "Gin Beefeater 700cc"
        },
        {
            id: 4,
            name: "BOMBAY GIN X 750 CC",
            price: 22000,
            image: "IMG/BOMBAY GIN X 750 CC.jpg",
            category: "gin",
            description: "Gin Bombay 750cc"
        },
        {
            id: 5,
            name: "EL GORDO MOTONETA MALBEC 750CC",
            price: 8500,
            image: "IMG/EL GORDO MOTONETA MALBEC 750CC.jpg",
            category: "vino",
            description: "Vino Malbec premium"
        },
        {
            id: 6,
            name: "ACONCAGUA GIN X750CC CAJA x6",
            price: 45000,
            image: "IMG/ACONCAGUA GIN X750CC CAJA x6.jpg",
            category: "gin",
            description: "Caja de 6 unidades Gin Aconcagua"
        },
        {
            id: 7,
            name: "JÄGERMEISTER X 700 CC",
            price: 12000,
            image: "IMG/JÄGERMEISTER X 700 CC.jpg",
            category: "licor",
            description: "Licor Jägermeister 700cc"
        },
        {
            id: 8,
            name: "HEREDERO GIN AÑEJO X 700 CC",
            price: 28000,
            image: "IMG/HEREDERO GIN AÑEJO X 700 CC.jpg",
            category: "gin",
            description: "Gin Heredero Añejo 700cc"
        },
        {
            id: 9,
            name: "HIERBA MALA GINEBRA X 1000 CC",
            price: 15000,
            image: "IMG/HIERBA MALA GINEBRA X 1000 CC.jpg",
            category: "gin",
            description: "Ginebra Hierba Mala 1000cc"
        },
        {
            id: 10,
            name: "LICOR DE CAÑA LEGUI X 750 CC",
            price: 8000,
            image: "IMG/LICOR DE CAÑA LEGUI X 750 CC.jpg",
            category: "licor",
            description: "Licor de Caña Legui 750cc"
        },
        {
            id: 11,
            name: "EL RELATOR MALBEC",
            price: 6500,
            image: "IMG/EL RELATOR MALBEC.jpg",
            category: "vino",
            description: "Vino El Relator Malbec"
        },
        {
            id: 12,
            name: "UN MUNDO CHIQUITO MALBEC",
            price: 7200,
            image: "IMG/UN MUNDO CHIQUITO MALBEC.jpg",
            category: "vino",
            description: "Vino Un Mundo Chiquito Malbec"
        },
        {
            id: 13,
            name: "PYROS APPELLATION MALBEC X 750 CC",
            price: 6800,
            image: "IMG/PYROS APPELLATION MALBEC X 750 CC.jpg",
            category: "vino",
            description: "Vino Pyros Appellation Malbec"
        },
        {
            id: 14,
            name: "PYROS APPELLATION CHARDONNAY X 750 CC",
            price: 6500,
            image: "IMG/PYROS APPELLATION CHARDONNAY X 750 CC.jpg",
            category: "vino",
            description: "Vino Pyros Appellation Chardonnay"
        },
        {
            id: 15,
            name: "NICASIA RED BLEND ESTUCHE X2 X 750 CC",
            price: 12000,
            image: "IMG/NICASIA RED BLEND ESTUCHE X2 X 750 CC.jpg",
            category: "vino",
            description: "Estuche Nicasia Red Blend x2"
        },
        {
            id: 16,
            name: "ELEGIDOS DE SEBASTIAN ZUCCARDI ESTUCHE DE MADERA X4",
            price: 35000,
            image: "IMG/ELEGIDOS DE SEBASTIAN ZUCCARDI ESTUCHE DE MADERA X4.jpg",
            category: "vino",
            description: "Estuche Elegidos Zuccardi x4"
        }
    ];

    // Variables globales
    let cart = [];
    let currentFilter = 'todos';
    let currentSearch = '';

    // Función para renderizar productos
    function renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        
        if (!productsGrid) {
            console.error('❌ No se encontró el contenedor de productos');
            return;
        }

        console.log('🎯 Renderizando productos...');
        
        // Limpiar el grid
        productsGrid.innerHTML = '';
        
        // Filtrar productos
        const filteredProducts = products.filter(product => {
            const matchesFilter = currentFilter === 'todos' || product.category === currentFilter;
            const matchesSearch = product.name.toLowerCase().includes(currentSearch.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        console.log(`📦 Productos filtrados: ${filteredProducts.length}`);

        // Crear tarjetas de productos
        filteredProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                margin: 10px;
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
            `;
            
            // Crear la imagen con manejo de errores mejorado
            const imgElement = document.createElement('img');
            imgElement.src = product.image; // Ruta directa sin ./IMG/
            imgElement.alt = product.name;
            imgElement.style.cssText = 'width: 100%; height: 200px; object-fit: cover; border-radius: 8px;';
            imgElement.onerror = function() {
                console.warn(`⚠️ Imagen no encontrada: ${product.image}, usando fallback`);
                this.src = 'IMG/vino.jpg'; // Fallback sin ./
                this.style.opacity = '0.7';
            };
            imgElement.onload = function() {
                console.log(`✅ Imagen cargada correctamente: ${product.image}`);
            };
            
            card.innerHTML = `
                <div style="padding: 15px 0;">
                    <h3 style="font-size: 18px; margin: 10px 0; color: #333;">${product.name}</h3>
                    <p style="font-size: 20px; font-weight: bold; color: #ff6b35; margin: 10px 0;">$${product.price.toLocaleString()}</p>
                    <button onclick="addToCart(${product.id})" 
                            style="width: 100%; background: #ff6b35; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer;">
                        Agregar al Carrito
                    </button>
                </div>
            `;
            
            // Insertar la imagen al principio del card
            card.insertBefore(imgElement, card.firstChild);
            
            productsGrid.appendChild(card);
        });

        console.log('✅ Productos renderizados');
    }

    // Función para agregar al carrito
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartDisplay();
            console.log(`🛒 Agregado al carrito: ${product.name}`);
        }
    };

    // Función para actualizar display del carrito
    function updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
        
        if (cartTotal) {
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = totalPrice.toLocaleString();
        }
    }

    // Configurar filtros
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remover clase active de todos los botones
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Agregar clase active al botón clickeado
                this.classList.add('active');
                
                currentFilter = this.getAttribute('data-filter');
                console.log(`🔍 Filtro cambiado a: ${currentFilter}`);
                renderProducts();
            });
        });
    }

    // Configurar búsqueda
    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                currentSearch = this.value;
                console.log(`🔍 Búsqueda: ${currentSearch}`);
                renderProducts();
            });
        }
    }

    // Configurar carrito
    function setupCart() {
        const cartButton = document.getElementById('cart-button');
        const cartDetails = document.getElementById('cart-details');
        const closeCart = document.getElementById('close-cart');
        
        if (cartButton && cartDetails) {
            cartButton.addEventListener('click', function() {
                cartDetails.classList.toggle('show');
            });
        }
        
        if (closeCart && cartDetails) {
            closeCart.addEventListener('click', function() {
                cartDetails.classList.remove('show');
            });
        }
    }

    // Inicializar todo
    function init() {
        console.log('🚀 Inicializando aplicación final...');
        
        // Renderizar productos
        renderProducts();
        
        // Configurar eventos
        setupFilters();
        setupSearch();
        setupCart();
        
        // Actualizar carrito
        updateCartDisplay();
        
        console.log('✅ Aplicación final inicializada');
    }

    // Iniciar
    init();
}); 