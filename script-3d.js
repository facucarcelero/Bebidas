// JavaScript 3D Premium para inFusion
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando inFusion 3D Premium...');
    
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
    let isAnimating = false;

    // ===== EFECTOS 3D Y ANIMACIONES =====
    
    // Efecto de parallax en scroll
    function initParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px) rotateX(${scrolled * 0.01}deg)`;
            });
        });
    }

    // Efecto de cursor personalizado 3D
    function initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #ff6b35, #f7931e);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Efecto hover en elementos interactivos
        const interactiveElements = document.querySelectorAll('button, a, .product-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2) rotate(45deg)';
            });
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    // Animaciones de entrada con Intersection Observer
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 1s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.product-card, .feature, .section-header');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px) rotateX(20deg)';
            observer.observe(el);
        });
    }

    // Efecto de partículas flotantes
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 107, 53, ${Math.random() * 0.5 + 0.1});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // ===== FUNCIONES PRINCIPALES =====

    // Función para renderizar productos con efectos 3D
    function renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        
        if (!productsGrid) {
            console.error('❌ No se encontró el contenedor de productos');
            return;
        }

        console.log('🎯 Renderizando productos 3D...');
        
        // Limpiar el grid
        productsGrid.innerHTML = '';
        
        // Filtrar productos
        const filteredProducts = products.filter(product => {
            const matchesFilter = currentFilter === 'todos' || product.category === currentFilter;
            const matchesSearch = product.name.toLowerCase().includes(currentSearch.toLowerCase());
            return matchesFilter && matchesSearch;
        });

        console.log(`📦 Productos filtrados: ${filteredProducts.length}`);

        // Crear tarjetas de productos con efectos 3D
        filteredProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Crear la imagen con manejo de errores mejorado
            const imgElement = document.createElement('img');
            imgElement.src = product.image;
            imgElement.alt = product.name;
            imgElement.onerror = function() {
                console.warn(`⚠️ Imagen no encontrada: ${product.image}, usando fallback`);
                this.src = 'IMG/vino.jpg';
                this.style.opacity = '0.7';
            };
            imgElement.onload = function() {
                console.log(`✅ Imagen cargada correctamente: ${product.image}`);
            };
            
            card.innerHTML = `
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toLocaleString()}</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                    <span class="btn-text">Agregar al Carrito</span>
                    <span class="btn-icon">🛒</span>
                </button>
            `;
            
            // Insertar la imagen al principio del card
            card.insertBefore(imgElement, card.firstChild);
            
            // Agregar efectos 3D al hover
            card.addEventListener('mousemove', (e) => {
                if (isAnimating) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateZ(20px)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
            
            productsGrid.appendChild(card);
        });

        console.log('✅ Productos renderizados con efectos 3D');
    }

    // Función para agregar al carrito con animación
    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            
            // Animación de confirmación
            showNotification(`✅ ${product.name} agregado al carrito`, 'success');
            updateCartDisplay();
            console.log(`🛒 Agregado al carrito: ${product.name}`);
        }
    };

    // Función para mostrar notificaciones
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #ff6b35, #f7931e)'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(10px);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remover después de 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Función para actualizar display del carrito
    function updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Animación del contador
            cartCount.style.animation = 'pulse 0.5s ease-in-out';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 500);
        }
        
        if (cartTotal) {
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = totalPrice.toLocaleString();
        }
    }

    // Configurar filtros con animaciones
    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (isAnimating) return;
                
                // Remover clase active de todos los botones
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Agregar clase active al botón clickeado
                this.classList.add('active');
                
                currentFilter = this.getAttribute('data-filter');
                console.log(`🔍 Filtro cambiado a: ${currentFilter}`);
                
                // Animación de transición
                isAnimating = true;
                const productsGrid = document.getElementById('products-grid');
                productsGrid.style.opacity = '0';
                productsGrid.style.transform = 'scale(0.9) rotateX(20deg)';
                
                setTimeout(() => {
                    renderProducts();
                    setTimeout(() => {
                        productsGrid.style.opacity = '1';
                        productsGrid.style.transform = 'scale(1) rotateX(0deg)';
                        isAnimating = false;
                    }, 100);
                }, 300);
            });
        });
    }

    // Configurar búsqueda con debounce
    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                currentSearch = this.value;
                
                searchTimeout = setTimeout(() => {
                    console.log(`🔍 Búsqueda: ${currentSearch}`);
                    if (!isAnimating) {
                        renderProducts();
                    }
                }, 300);
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
                if (cartDetails.classList.contains('show')) {
                    cartDetails.style.transform = 'translateX(0) rotateY(0deg)';
                } else {
                    cartDetails.style.transform = 'translateX(100%) rotateY(-10deg)';
                }
            });
        }
        
        if (closeCart && cartDetails) {
            closeCart.addEventListener('click', function() {
                cartDetails.classList.remove('show');
                cartDetails.style.transform = 'translateX(100%) rotateY(-10deg)';
            });
        }
    }

    // Configurar carrusel 3D
    function initCarousel() {
        const track = document.getElementById('carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevBtn = document.getElementById('prev');
        const nextBtn = document.getElementById('next');
        const indicators = document.getElementById('carousel-indicators');
        
        let currentSlide = 0;
        const slideCount = slides.length;
        
        // Crear indicadores
        slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            indicator.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: rgba(255, 255, 255, 0.3);
                margin: 0 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            indicator.addEventListener('click', () => goToSlide(index));
            indicators.appendChild(indicator);
        });
        
        function updateIndicators() {
            const indicatorBtns = indicators.querySelectorAll('.carousel-indicator');
            indicatorBtns.forEach((btn, index) => {
                if (index === currentSlide) {
                    btn.style.background = 'var(--primary-color)';
                    btn.style.transform = 'scale(1.2)';
                } else {
                    btn.style.background = 'rgba(255, 255, 255, 0.3)';
                    btn.style.transform = 'scale(1)';
                }
            });
        }
        
        function goToSlide(index) {
            currentSlide = index;
            const offset = -index * 100;
            track.style.transform = `translateX(${offset}%)`;
            updateIndicators();
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            goToSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            goToSlide(currentSlide);
        }
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        // Auto-play
        setInterval(nextSlide, 5000);
        
        // Inicializar
        updateIndicators();
    }

    // Configurar menú móvil
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger-menu');
        const mobileNav = document.getElementById('nav-mobile');
        
        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', function() {
                mobileNav.classList.toggle('show');
                this.classList.toggle('active');
            });
        }
    }

    // ===== INICIALIZACIÓN =====
    function init() {
        console.log('🚀 Inicializando inFusion 3D Premium...');
        
        // Inicializar efectos 3D
        initParallaxEffects();
        initCustomCursor();
        initScrollAnimations();
        createParticles();
        
        // Inicializar funcionalidades
        renderProducts();
        setupFilters();
        setupSearch();
        setupCart();
        initCarousel();
        initMobileMenu();
        
        // Actualizar carrito
        updateCartDisplay();
        
        console.log('✅ inFusion 3D Premium inicializado correctamente');
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            showNotification('🎉 ¡Bienvenido a inFusion 3D Premium!', 'success');
        }, 1000);
    }

    // Iniciar aplicación
    init();
}); 