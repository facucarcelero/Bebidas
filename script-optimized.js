// ===== INFUSION - JAVASCRIPT OPTIMIZADO =====
// Version: 2.0 - Completamente mejorado para rendimiento y UX

'use strict';

// ===== CONFIGURACIÓN Y ESTADO GLOBAL =====
const AppState = {
    cart: {},
    currentFilter: 'todos',
    currentSearch: '',
    isLoading: true,
    products: []
};

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
            localStorage.setItem('infusion_cart', JSON.stringify(AppState.cart));
        } catch (e) {
            console.error('Error al guardar carrito:', e);
        }
    },

    load() {
        try {
            const saved = localStorage.getItem('infusion_cart');
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

        let message = "Hola inFusion! Me gustaría consultar el stock de los siguientes productos:\n\n";
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
    products: [
        {
            id: 1,
            name: "Gin Belladonna",
            price: 25000,
            image: "./IMG/Gin Belladonna.jpg",
            category: "gin",
            description: "El Gin Belladonna combina un perfil de enebro con toques florales y cítricos, destacando por su cambio de color de lila a rosa intenso al mezclarlo con tónica. Una experiencia visual y sensorial única."
        },
        {
            id: 2,
            name: "Cordero Con Piel de Lobo Malbec",
            price: 5500,
            image: "./IMG/Cordero Con Piel de Lobo Malbec.jpg",
            category: "vino",
            description: "Vino tinto Malbec con notas de frutas maduras y taninos suaves. Ideal para acompañar carnes rojas y quesos."
        },
        {
            id: 3,
            name: "EL GORDO MOTONETA MALBEC 750CC",
            price: 5500,
            image: "./IMG/EL GORDO MOTONETA MALBEC 750CC.jpg",
            category: "vino",
            description: "Malbec de alta calidad con cuerpo y carácter distintivo. Notas de ciruelas y especias."
        },
        {
            id: 4,
            name: "HIERBA MALA GINEBRA X 1000 CC",
            price: 23500,
            image: "./IMG/HIERBA MALA GINEBRA X 1000 CC.jpg",
            category: "gin",
            description: "Ginebra artesanal con hierbas seleccionadas y botánica única. Perfil aromático complejo y refrescante."
        },
        {
            id: 5,
            name: "CAJA X 6 UNIDADES GINEBRA HIERBA MALA X 1 LT",
            price: 119000,
            image: "./IMG/CAJA X 6 UNIDADES GINEBRA HIERBA MALA X 1 LT.jpg",
            category: "gin",
            description: "Pack de 6 unidades de ginebra Hierba Mala de 1 litro cada una. Precio especial por cantidad."
        },
        {
            id: 6,
            name: "NICASIA RED BLEND ESTUCHE X2 X 750 CC",
            price: 20999,
            image: "./IMG/NICASIA RED BLEND ESTUCHE X2 X 750 CC.jpg",
            category: "vino",
            description: "Estuche elegante con dos botellas de vino tinto blend premium. Perfecto para regalo."
        },
        {
            id: 7,
            name: "EL RELATOR CABERNET FRANC",
            price: 9900,
            image: "./IMG/EL RELATOR CABERNET FRANC.JPG",
            category: "vino",
            description: "Cabernet Franc con notas de pimiento verde y frutas rojas. Elegante y estructurado."
        },
        {
            id: 8,
            name: "CAJA X 6 UNIDADES GIN BELLADONNA X 1 LT",
            price: 126700,
            image: "./IMG/CAJA X 6 UNIDADES GIN BELLADONNA X 1 LT.jpg",
            category: "gin",
            description: "Pack de 6 unidades de Gin Belladonna de 1 litro cada una. El mejor precio."
        },
        {
            id: 9,
            name: "EL RELATOR EXTRA BRUT",
            price: 10300,
            image: "./IMG/EL RELATOR EXTRA BRUT.jpg",
            category: "vino",
            description: "Champagne extra brut con burbujas finas y sabor seco. Ideal para celebraciones."
        },
        {
            id: 10,
            name: "EL PORVENIR - ROSA ROSA",
            price: 7200,
            image: "./IMG/EL PORVENIR - ROSA ROSA.jpg",
            category: "vino",
            description: "Vino rosado con notas florales y frutales refrescantes. Perfecto para el verano."
        },
        {
            id: 11,
            name: "EL PORVENIR - AMAUTA ABSOLUTO TANNAT",
            price: 11000,
            image: "./IMG/EL PORVENIR - AMAUTA ABSOLUTO TANNAT.jpg",
            category: "vino",
            description: "Tannat de alta expresión con taninos potentes y estructura compleja. Para paladares exigentes."
        },
        {
            id: 12,
            name: "ELEGIDOS DE SEBASTIAN ZUCCARDI ESTUCHE DE MADERA X4",
            price: 257000,
            image: "./IMG/ELEGIDOS DE SEBASTIAN ZUCCARDI ESTUCHE DE MADERA X4.jpg",
            category: "vino",
            description: "Estuche de madera premium con 4 vinos seleccionados por Sebastián Zuccardi. Colección exclusiva."
        },
        {
            id: 13,
            name: "UN MUNDO CHIQUITO MALBEC",
            price: 5000,
            image: "./IMG/UN MUNDO CHIQUITO MALBEC.jpg",
            category: "vino",
            description: "Malbec joven y accesible con frutas rojas y taninos suaves. Excelente relación precio-calidad."
        },
        {
            id: 14,
            name: "UN MUNDO CHIQUITO CORTE DE BLANCAS X 750 CC",
            price: 5000,
            image: "./IMG/UN MUNDO CHIQUITO CORTE DE BLANCAS X 750 CC.jpg",
            category: "vino",
            description: "Blend de uvas blancas con notas cítricas y minerales. Fresco y aromático."
        },
        {
            id: 15,
            name: "PYROS APPELLATION MALBEC X 750 CC",
            price: 11000,
            image: "./IMG/PYROS APPELLATION MALBEC X 750 CC.jpg",
            category: "vino",
            description: "Malbec de altura con notas de ciruelas y especias. Vino de alta gama."
        },
        {
            id: 16,
            name: "PYROS APPELLATION SYRAH X 750 CC",
            price: 11000,
            image: "./IMG/PYROS APPELLATION SYRAH X 750 CC.jpg",
            category: "vino",
            description: "Syrah de altura con notas de pimienta negra y frutas oscuras. Complejo y elegante."
        },
        {
            id: 17,
            name: "PYROS APPELLATION CHARDONNAY X 750 CC",
            price: 11000,
            image: "./IMG/PYROS APPELLATION CHARDONNAY X 750 CC.jpg",
            category: "vino",
            description: "Chardonnay de altura con notas de manzana verde y vainilla. Equilibrado y persistente."
        },
        {
            id: 18,
            name: "LICOR DE CAÑA LEGUI X 750 CC",
            price: 6000,
            image: "./IMG/LICOR DE CAÑA LEGUI X 750 CC.jpg",
            category: "licor",
            description: "Licor de caña artesanal con notas dulces y cálidas. Tradición argentina."
        },
        {
            id: 19,
            name: "JÄGERMEISTER X 700 CC",
            price: 26000,
            image: "./IMG/JÄGERMEISTER X 700 CC.jpg",
            category: "licor",
            description: "Licor herbal alemán con 56 hierbas y especias seleccionadas. Sabor único e inconfundible."
        },
        {
            id: 20,
            name: "JAGËRMEISTER X 1750 CC",
            price: 64000,
            image: "./IMG/JAGËRMEISTER X 1750 CC.jpg",
            category: "licor",
            description: "Botella grande de Jägermeister, perfecta para eventos y reuniones."
        },
        {
            id: 21,
            name: "BEEFEATER GIN X 700 CC",
            price: 24300,
            image: "./IMG/BEEFEATER GIN X 700 CC.jpg",
            category: "gin",
            description: "Gin londinense clásico con notas de enebro y cítricos. Elegante y versátil."
        },
        {
            id: 22,
            name: "BOMBAY GIN X 750 CC",
            price: 28000,
            image: "./IMG/BOMBAY GIN X 750 CC.jpg",
            category: "gin",
            description: "Gin premium con botánica exótica y sabor refinado. Destilado en alambiques de cobre."
        },
        {
            id: 23,
            name: "CONTRAVIENTO BLEND DE TINTAS X6",
            price: 24000,
            image: "./IMG/CONTRAVIENTO BLEND DE TINTAS X6.jpg",
            category: "vino",
            description: "Pack de 6 vinos tintos blend de alta calidad. Ideal para eventos."
        },
        {
            id: 24,
            name: "Vino Portillo Cabernet Sauvignon x3",
            price: 6500,
            image: "./IMG/Vino Portillo Cabernet Sauvignon x3.jpg",
            category: "vino",
            description: "Pack de 3 botellas de Cabernet Sauvignon de Portillo. Calidad consistente."
        },
        {
            id: 25,
            name: "Vino Tinto Elementos Malbec x3",
            price: 9900,
            image: "./IMG/Vino Tinto Elementos Malbec x3.jpg",
            category: "vino",
            description: "Pack de 3 botellas de Malbec de la línea Elementos. Expresión pura."
        },
        {
            id: 26,
            name: "Las Perdices Malbec x3",
            price: 19000,
            image: "./IMG/Las Perdices Malbec x3.jpg",
            category: "vino",
            description: "Pack de 3 botellas de Malbec de Las Perdices. Premium quality."
        },
        {
            id: 27,
            name: "HEREDERO GIN AÑEJO X 700 CC",
            price: 25100,
            image: "./IMG/HEREDERO GIN AÑEJO X 700 CC.jpg",
            category: "gin",
            description: "Gin añejo con notas de roble y especias complejas. Único en su categoría."
        },
        {
            id: 28,
            name: "ACONCAGUA GIN X750CC CAJA x6",
            price: 73500,
            image: "./IMG/ACONCAGUA GIN X750CC CAJA x6.jpg",
            category: "gin",
            description: "Pack de 6 botellas de Gin Aconcagua de 750cc cada una. Inspirado en los Andes."
        }
    ],

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
        
        const encodedImage = Utils.encodeImagePath(product.image);
        
        card.innerHTML = `
            <img src="${encodedImage}" 
                 alt="${product.name}" 
                 loading="lazy" 
                 onerror="this.src='./IMG/vino.jpg';">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price" aria-label="Precio: ${Utils.formatPrice(product.price)} pesos">$${Utils.formatPrice(product.price)}</p>
                <button class="add-to-cart" 
                        data-product-id="${product.id}"
                        aria-label="Agregar ${product.name} al carrito">
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

    init() {
        AppState.products = this.products;
        this.render();
    }
};

// ===== FILTROS Y BÚSQUEDA =====
const FilterManager = {
    init() {
        // Filtros de categoría
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

        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
            
            navMobile.classList.toggle('show');
            navMobile.setAttribute('aria-hidden', isExpanded);
            
            // Prevenir scroll cuando el menú está abierto
            document.body.style.overflow = navMobile.classList.contains('show') ? 'hidden' : '';
        });

        // Cerrar al hacer clic en un enlace
        const navLinks = navMobile.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                navMobile.classList.remove('show');
                navMobile.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
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

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 inFusion - Iniciando aplicación optimizada v2.0');

    try {
        // Inicializar todos los módulos
        ProductManager.init();
        CartManager.init();
        ProductModal.init();
        FilterManager.init();
        CarouselManager.init();
        MobileMenuManager.init();
        SmoothScroll.init();
        HeaderManager.init();

        console.log('✅ Todos los módulos inicializados correctamente');

        // Ocultar loading screen
        LoadingManager.hide();

        // Toast de bienvenida
        setTimeout(() => {
            ToastManager.show('¡Bienvenido a inFusion! Explora nuestros productos premium', 'info', 4000);
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

console.log('📦 Script optimizado de inFusion cargado correctamente');

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

