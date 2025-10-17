// ===== CONFIGURACIÓN GLOBAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};
    let currentFilter = 'todos';
    let currentSearch = '';
    
    // Datos de productos
    const products = [
        {
            id: 1,
            name: "Gin Belladonna",
            price: 25000,
            image: "./IMG/Gin Belladonna.jpg",
            category: "gin",
            description: "El Gin Belladonna combina un perfil de enebro con toques florales y cítricos, destacando por su cambio de color de lila a rosa intenso al mezclarlo con tónica."
        },
        {
            id: 2,
            name: "Cordero Con Piel de Lobo Malbec",
            price: 5500,
            image: "./IMG/Cordero Con Piel de Lobo Malbec.jpg",
            category: "vino",
            description: "Vino tinto Malbec con notas de frutas maduras y taninos suaves."
        },
        {
            id: 3,
            name: "EL GORDO MOTONETA MALBEC 750CC",
            price: 5500,
            image: "./IMG/EL GORDO MOTONETA MALBEC 750CC.jpg",
            category: "vino",
            description: "Malbec de alta calidad con cuerpo y carácter distintivo."
        },
        {
            id: 4,
            name: "HIERBA MALA GINEBRA X 1000 CC",
            price: 23500,
            image: "./IMG/HIERBA MALA GINEBRA X 1000 CC.jpg",
            category: "gin",
            description: "Ginebra artesanal con hierbas seleccionadas y botánica única."
        },
        {
            id: 5,
            name: "CAJA X 6 UNIDADES GINEBRA HIERBA MALA X 1 LT",
            price: 119000,
            image: "./IMG/CAJA X 6 UNIDADES GINEBRA HIERBA MALA X 1 LT.jpg",
            category: "gin",
            description: "Pack de 6 unidades de ginebra Hierba Mala de 1 litro cada una."
        },
        {
            id: 6,
            name: "NICASIA RED BLEND ESTUCHE X2 X 750 CC",
            price: 20999,
            image: "./IMG/NICASIA RED BLEND ESTUCHE X2 X 750 CC.jpg",
            category: "vino",
            description: "Estuche elegante con dos botellas de vino tinto blend premium."
        },
        {
            id: 7,
            name: "EL RELATOR CABERNET FRANC",
            price: 9900,
            image: "./IMG/EL RELATOR CABERNET FRANC.JPG",
            category: "vino",
            description: "Cabernet Franc con notas de pimiento verde y frutas rojas."
        },
        {
            id: 8,
            name: "CAJA X 6 UNIDADES GIN BELLADONNA X 1 LT",
            price: 126700,
            image: "./IMG/CAJA X 6 UNIDADES GIN BELLADONNA X 1 LT.jpg",
            category: "gin",
            description: "Pack de 6 unidades de Gin Belladonna de 1 litro cada una."
        },
        {
            id: 9,
            name: "EL RELATOR EXTRA BRUT",
            price: 10300,
            image: "./IMG/EL RELATOR EXTRA BRUT.jpg",
            category: "vino",
            description: "Champagne extra brut con burbujas finas y sabor seco."
        },
        {
            id: 10,
            name: "EL PORVENIR - ROSA ROSA",
            price: 7200,
            image: "./IMG/EL PORVENIR - ROSA ROSA.jpg",
            category: "vino",
            description: "Vino rosado con notas florales y frutales refrescantes."
        },
        {
            id: 11,
            name: "EL PORVENIR - AMAUTA ABSOLUTO TANNAT",
            price: 11000,
            image: "./IMG/EL PORVENIR - AMAUTA ABSOLUTO TANNAT.jpg",
            category: "vino",
            description: "Tannat de alta expresión con taninos potentes y estructura compleja."
        },
        {
            id: 12,
            name: "ELEGIDOS DE SEBASTIAN ZUCCARDI ESTUCHE DE MADERA X4",
            price: 257000,
            image: "./IMG/ELEGIDOS DE SEBASTIAN ZUCCARDI ESTUCHE DE MADERA X4.jpg",
            category: "vino",
            description: "Estuche de madera premium con 4 vinos seleccionados por Sebastián Zuccardi."
        },
        {
            id: 13,
            name: "UN MUNDO CHIQUITO MALBEC",
            price: 5000,
            image: "./IMG/UN MUNDO CHIQUITO MALBEC.jpg",
            category: "vino",
            description: "Malbec joven y accesible con frutas rojas y taninos suaves."
        },
        {
            id: 14,
            name: "UN MUNDO CHIQUITO CORTE DE BLANCAS X 750 CC",
            price: 5000,
            image: "./IMG/UN MUNDO CHIQUITO CORTE DE BLANCAS X 750 CC.jpg",
            category: "vino",
            description: "Blend de uvas blancas con notas cítricas y minerales."
        },
        {
            id: 15,
            name: "PYROS APPELLATION MALBEC X 750 CC",
            price: 11000,
            image: "./IMG/PYROS APPELLATION MALBEC X 750 CC.jpg",
            category: "vino",
            description: "Malbec de altura con notas de ciruelas y especias."
        },
        {
            id: 16,
            name: "PYROS APPELLATION SYRAH X 750 CC",
            price: 11000,
            image: "./IMG/PYROS APPELLATION SYRAH X 750 CC.jpg",
            category: "vino",
            description: "Syrah de altura con notas de pimienta negra y frutas oscuras."
        },
        {
            id: 17,
            name: "PYROS APPELLATION CHARDONNAY X 750 CC",
            price: 11000,
            image: "./IMG/PYROS APPELLATION CHARDONNAY X 750 CC.jpg",
            category: "vino",
            description: "Chardonnay de altura con notas de manzana verde y vainilla."
        },
        {
            id: 18,
            name: "LICOR DE CAÑA LEGUI X 750 CC",
            price: 6000,
            image: "./IMG/LICOR DE CAÑA LEGUI X 750 CC.jpg",
            category: "licor",
            description: "Licor de caña artesanal con notas dulces y cálidas."
        },
        {
            id: 19,
            name: "JÄGERMEISTER X 700 CC",
            price: 26000,
            image: "./IMG/JÄGERMEISTER X 700 CC.jpg",
            category: "licor",
            description: "Licor herbal alemán con 56 hierbas y especias seleccionadas."
        },
        {
            id: 20,
            name: "JAGËRMEISTER X 1750 CC",
            price: 64000,
            image: "./IMG/JAGËRMEISTER X 1750 CC.jpg",
            category: "licor",
            description: "Botella grande de Jägermeister, perfecta para eventos."
        },
        {
            id: 21,
            name: "BEEFEATER GIN X 700 CC",
            price: 24300,
            image: "./IMG/BEEFEATER GIN X 700 CC.jpg",
            category: "gin",
            description: "Gin londinense clásico con notas de enebro y cítricos."
        },
        {
            id: 22,
            name: "BOMBAY GIN X 750 CC",
            price: 28000,
            image: "./IMG/BOMBAY GIN X 750 CC.jpg",
            category: "gin",
            description: "Gin premium con botánica exótica y sabor refinado."
        },
        {
            id: 23,
            name: "CONTRAVIENTO BLEND DE TINTAS X6",
            price: 24000,
            image: "./IMG/CONTRAVIENTO BLEND DE TINTAS X6.jpg",
            category: "vino",
            description: "Pack de 6 vinos tintos blend de alta calidad."
        },
        {
            id: 24,
            name: "Vino Portillo Cabernet Sauvignon x3",
            price: 6500,
            image: "./IMG/Vino Portillo Cabernet Sauvignon x3.jpg",
            category: "vino",
            description: "Pack de 3 botellas de Cabernet Sauvignon de Portillo."
        },
        {
            id: 25,
            name: "Vino Tinto Elementos Malbec x3",
            price: 9900,
            image: "./IMG/Vino Tinto Elementos Malbec x3.jpg",
            category: "vino",
            description: "Pack de 3 botellas de Malbec de la línea Elementos."
        },
        {
            id: 26,
            name: "Las Perdices Malbec x3",
            price: 19000,
            image: "./IMG/Las Perdices Malbec x3.jpg",
            category: "vino",
            description: "Pack de 3 botellas de Malbec de Las Perdices."
        },
        {
            id: 27,
            name: "HEREDERO GIN AÑEJO X 700 CC",
            price: 25100,
            image: "./IMG/HEREDERO GIN AÑEJO X 700 CC.jpg",
            category: "gin",
            description: "Gin añejo con notas de roble y especias complejas."
        },
        {
            id: 28,
            name: "ACONCAGUA GIN X750CC CAJA x6",
            price: 73500,
            image: "./IMG/ACONCAGUA GIN X750CC CAJA x6.jpg",
            category: "gin",
            description: "Pack de 6 botellas de Gin Aconcagua de 750cc cada una."
        }
    ];

    // ===== INICIALIZACIÓN =====
    initApp();

    function initApp() {
        console.log('🚀 Iniciando aplicación...');
        
        // Validar rutas de imágenes primero
        validateImagePaths();
        
        // Funciones básicas
        renderProducts();
        setupEventListeners();
        updateCart();
        initCarousel();
        initMobileMenu();
        
        console.log('✅ Funciones básicas completadas');
        
        // Funcionalidades premium deshabilitadas para evitar conflictos
        // setTimeout(() => {
        //     createParticles();
        //     initCustomCursor();
        //     initParallaxEffects();
        //     initAdvancedAnimations();
        //     initPerformanceOptimizations();
        // }, 1000);
    }

    // Función para validar rutas de imágenes
    function validateImagePaths() {
        products.forEach(product => {
            // Verificar si la imagen existe
            const img = new Image();
            img.onload = function() {
                // La imagen existe, no hacer nada
                console.log(`✅ Imagen cargada correctamente: ${product.image}`);
            };
            img.onerror = function() {
                console.warn(`⚠️ Imagen no encontrada: ${product.image}`);
                // Intentar con una ruta alternativa o usar imagen por defecto
                product.image = './IMG/vino.jpg';
            };
            // Codificar la URL para manejar espacios
            img.src = encodeURI(product.image);
        });
    }

    // ===== RENDERIZADO DE PRODUCTOS =====
    function renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        
        if (!productsGrid) {
            console.error('❌ ERROR: No se encontró el contenedor products-grid');
            return;
        }
        
        const filteredProducts = getFilteredProducts();
        
        console.log('✅ Renderizando productos:', filteredProducts.length);
        console.log('📦 Productos filtrados:', filteredProducts);
        
        productsGrid.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No se encontraron productos</h3>
                    <p>Intenta con otros filtros o términos de búsqueda</p>
                </div>
            `;
            console.log('⚠️ No hay productos para mostrar');
            return;
        }

        filteredProducts.forEach((product, index) => {
            const productCard = createProductCard(product, index);
            productsGrid.appendChild(productCard);
            console.log(`✅ Producto ${index + 1} agregado:`, product.name);
        });

        console.log('🎉 Productos renderizados en el grid');
        
        // Forzar visibilidad
        productsGrid.style.display = 'grid';
        productsGrid.style.opacity = '1';
        productsGrid.style.visibility = 'visible';
    }

    function createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card fade-in-up';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Codificar la URL para manejar espacios correctamente
        const encodedImagePath = encodeURI(product.image);
        
        card.innerHTML = `
            <img src="${encodedImagePath}" alt="${product.name}" loading="lazy" onerror="this.src='./IMG/vino.jpg'; this.style.opacity='0.7';">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toLocaleString()}</p>
                <button class="add-to-cart" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                    Agregar al Carrito
                </button>
            </div>
        `;

        // Event listener para agregar al carrito
        const addButton = card.querySelector('.add-to-cart');
        addButton.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id);
            showNotification(`${product.name} agregado al carrito`);
        });

        return card;
    }

    function getFilteredProducts() {
        console.log('Filtrando productos - Filter:', currentFilter, 'Search:', currentSearch);
        console.log('Total de productos:', products.length);
        
        const filtered = products.filter(product => {
            const matchesFilter = currentFilter === 'todos' || product.category === currentFilter;
            const matchesSearch = product.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                                product.description.toLowerCase().includes(currentSearch.toLowerCase());
            return matchesFilter && matchesSearch;
        });
        
        console.log('Productos después del filtro:', filtered.length);
        return filtered;
    }

    // ===== CARRITO DE COMPRAS =====
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        if (cartItems[productId]) {
            cartItems[productId].quantity++;
        } else {
            cartItems[productId] = {
                name: product.name,
                price: product.price,
                quantity: 1
            };
        }

        updateCart();
        saveCartToStorage();
    }

    function removeFromCart(productId) {
        if (cartItems[productId].quantity > 1) {
            cartItems[productId].quantity--;
        } else {
            delete cartItems[productId];
        }
        updateCart();
        saveCartToStorage();
    }

    function updateCart() {
        const cartCount = document.getElementById('cart-count');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        let totalItems = 0;
        let totalPrice = 0;

        cartItemsContainer.innerHTML = '';

        for (const [productId, item] of Object.entries(cartItems)) {
            totalItems += item.quantity;
            totalPrice += item.price * item.quantity;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toLocaleString()} x ${item.quantity}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="cart-item-btn" onclick="removeFromCart(${productId})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="cart-item-btn" onclick="addToCart(${productId})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        }

        cartCount.textContent = totalItems;
        cartTotal.textContent = totalPrice.toLocaleString();
    }

    function saveCartToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // ===== CARRUSEL =====
    function initCarousel() {
        const track = document.getElementById('carousel-track');
        const slides = Array.from(track.children);
        const prevButton = document.getElementById('prev');
        const nextButton = document.getElementById('next');
        const indicatorsContainer = document.getElementById('carousel-indicators');
        
        let currentIndex = 0;
        let autoplayInterval;

        // Crear indicadores
        slides.forEach((_, index) => {
            const indicator = document.createElement('button');
            if (index === 0) indicator.classList.add('active');
            indicatorsContainer.appendChild(indicator);
            indicator.addEventListener('click', () => moveToSlide(index));
        });

        function moveToSlide(index) {
            const amountToMove = -slides[index].getBoundingClientRect().width * index;
            track.style.transform = `translateX(${amountToMove}px)`;
            currentIndex = index;
            updateIndicators();
        }

        function updateIndicators() {
            document.querySelectorAll('.carousel-indicators button').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }

        function nextSlide() {
            if (currentIndex < slides.length - 1) {
                moveToSlide(currentIndex + 1);
            } else {
                moveToSlide(0);
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            } else {
                moveToSlide(slides.length - 1);
            }
        }

        // Event listeners
        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);

        // Autoplay
        function startAutoplay() {
            autoplayInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        // Pausar autoplay en hover
        track.addEventListener('mouseenter', stopAutoplay);
        track.addEventListener('mouseleave', startAutoplay);

        startAutoplay();
    }

    // ===== MENÚ MÓVIL =====
    function initMobileMenu() {
        const hamburgerMenu = document.getElementById('hamburger-menu');
        const navMobile = document.getElementById('nav-mobile');
        const navLinks = navMobile.querySelectorAll('.nav-link');

        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navMobile.classList.toggle('show');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerMenu.classList.remove('active');
                navMobile.classList.remove('show');
            });
        });
    }

    // ===== FILTROS Y BÚSQUEDA =====
    function setupEventListeners() {
        // Filtros
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentFilter = button.dataset.filter;
                renderProducts();
            });
        });

        // Búsqueda
        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentSearch = e.target.value;
                renderProducts();
            }, 300);
        });

        // Carrito
        const cartButton = document.getElementById('cart-button');
        const cartDetails = document.getElementById('cart-details');
        const closeCart = document.getElementById('close-cart');
        const checkoutButton = document.getElementById('checkout-button');

        cartButton.addEventListener('click', () => {
            cartDetails.classList.toggle('show');
        });

        closeCart.addEventListener('click', () => {
            cartDetails.classList.remove('show');
        });

        checkoutButton.addEventListener('click', sendToWhatsApp);

        // Cerrar carrito al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!cartButton.contains(e.target) && !cartDetails.contains(e.target)) {
                cartDetails.classList.remove('show');
            }
        });
    }

    // ===== WHATSAPP =====
    function sendToWhatsApp() {
        if (Object.keys(cartItems).length === 0) {
            showNotification('El carrito está vacío', 'error');
            return;
        }

        let message = "Hola inFusion! Me gustaría consultar el stock de los siguientes productos:\n\n";
        let total = 0;

        for (const [productId, item] of Object.entries(cartItems)) {
            message += `• ${item.name} (x${item.quantity}) - $${item.price.toLocaleString()}\n`;
            total += item.price * item.quantity;
        }

        message += `\nTotal: $${total.toLocaleString()}\n\nGracias!`;

        const phoneNumber = "+5492644127229";
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // ===== ANIMACIONES AVANZADAS =====
    function animateProductCards() {
        const cards = document.querySelectorAll('.product-card');
        
        // Simplificar las animaciones para evitar problemas
        cards.forEach((card, index) => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }

    // Efectos de parallax
    function initParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Efectos de partículas
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
            z-index: -1;
        `;
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 215, 0, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float-particle ${Math.random() * 10 + 10}s infinite linear;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Efectos de cursor personalizado
    function initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--accent-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        cursorFollower.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid var(--accent-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(cursorFollower);

        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
            cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
        });

        // Efectos en hover
        document.querySelectorAll('a, button, .product-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(1.5)';
                cursorFollower.style.transform += ' scale(1.5)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
                cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
            });
        });
    }

    function initScrollEffects() {
        const header = document.querySelector('.header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }

    // ===== NOTIFICACIONES =====
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // ===== ANIMACIONES AVANZADAS =====
    function initAdvancedAnimations() {
        // Animaciones de entrada para secciones
        const sections = document.querySelectorAll('section');
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Efectos de hover avanzados
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-20px) scale(1.05) rotate(1deg)';
                this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.3)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                this.style.boxShadow = 'var(--shadow-md)';
            });
        });
    }

    // ===== OPTIMIZACIONES DE RENDIMIENTO =====
    function initPerformanceOptimizations() {
        // Lazy loading de imágenes
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Debounce para eventos de scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Optimizar efectos de scroll
            }, 16);
        });

        // Preload de recursos críticos
        const criticalImages = [
            './IMG/Gin Belladonna.jpg',
            './IMG/vino.jpg'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // ===== FUNCIONALIDADES PREMIUM =====
    function initPremiumFeatures() {
        // Modo oscuro
        const darkModeToggle = document.createElement('button');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: var(--accent-gradient);
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 1000;
            transition: var(--transition);
            box-shadow: var(--shadow-md);
        `;

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            darkModeToggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });

        document.body.appendChild(darkModeToggle);

        // Contador de productos en tiempo real
        function updateProductCounter() {
            const counter = document.createElement('div');
            counter.className = 'product-counter';
            counter.innerHTML = `${products.length} productos disponibles`;
            counter.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: var(--glass-bg);
                backdrop-filter: blur(20px);
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius-lg);
                color: white;
                font-weight: 600;
                z-index: 999;
                border: 1px solid var(--glass-border);
                animation: slideInRight 0.5s ease-out;
            `;
            document.body.appendChild(counter);
        }

        updateProductCounter();
    }

    // ===== UTILIDADES GLOBALES =====
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    
    // Inicializar funcionalidades premium
    initPremiumFeatures();
});

// ===== ESTILOS PARA NOTIFICACIONES =====
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #333;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.success {
        border-left: 4px solid #25d366;
    }

    .notification.error {
        border-left: 4px solid #ff6b35;
    }

    .notification i {
        font-size: 1.2rem;
    }

    .notification.success i {
        color: #25d366;
    }

    .notification.error i {
        color: #ff6b35;
    }

    .no-products {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: var(--text-light);
    }

    .no-products i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .no-products h3 {
        margin-bottom: 0.5rem;
        color: var(--text-color);
    }
`;

// Agregar estilos al head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);