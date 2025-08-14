document.addEventListener('DOMContentLoaded', function() {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || {};

    const cartButton = document.getElementById('cart-button');
    const cartCountElement = document.getElementById('cart-count');
    const cartDetails = document.getElementById('cart-details');
    const cartItemsElement = document.getElementById('cart-items');
    const checkoutButton = document.getElementById('checkout-button');
    const closeCart = document.getElementById('close-cart');
    const track = document.getElementById('carousel-track');
    const slides = Array.from(track.children);
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('nav');

    renderStoredProducts();
    setupProductInteractions();

    let currentIndex = 0;

    // Crear indicadores dinámicamente
    slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        if (index === 0) indicator.classList.add('active');
        indicatorsContainer.appendChild(indicator);
        indicator.addEventListener('click', () => moveToSlide(index));
    });

    const updateIndicators = () => {
        document.querySelectorAll('.carousel-indicators button').forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    };

    const moveToSlide = (index) => {
        const amountToMove = -slides[index].getBoundingClientRect().width * index;
        track.style.transform = `translateX(${amountToMove}px)`;
        currentIndex = index;
        updateIndicators();
    };

    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            moveToSlide(currentIndex + 1);
        } else {
            moveToSlide(0);
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        } else {
            moveToSlide(slides.length - 1);
        }
    });

    function renderStoredProducts() {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        const container = document.getElementById('productos');
        storedProducts.forEach((p, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-details', p.details || '');
            card.innerHTML = `
                <img src="${p.image}" alt="${p.name}">
                <h2>${p.name}</h2>
                <p><strong>$${p.price}</strong></p>
                <button class="add-to-cart" data-product-id="new-${index}">Agregar al Carrito</button>
            `;
            container.appendChild(card);
        });
    }

    document.getElementById('productos').addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-product-id');
            const productName = e.target.closest('.product-card').querySelector('h2').textContent;
            if (cartItems[productId]) {
                cartItems[productId].quantity++;
            } else {
                cartItems[productId] = { name: productName, quantity: 1 };
            }
            updateCart();
        }
    });

    cartButton.addEventListener('click', function() {
        cartDetails.style.display = cartDetails.style.display === 'block' ? 'none' : 'block';
    });

    checkoutButton.addEventListener('click', function() {
        sendToWhatsApp();
    });

    closeCart.addEventListener('click', function() {
        cartDetails.style.display = 'none';
    });

    navToggle.addEventListener('click', function() {
        nav.classList.toggle('open');
    });

    function updateCart() {
        cartItemsElement.innerHTML = '';
        let totalItems = 0;

        for (const id in cartItems) {
            totalItems += cartItems[id].quantity;

            const li = document.createElement('li');
            li.textContent = `${cartItems[id].name} (x${cartItems[id].quantity})`;

            const removeButton = document.createElement('button');
            removeButton.textContent = '-';
            removeButton.addEventListener('click', () => {
                reduceQuantity(id);
            });

            const sumButton = document.createElement('button');
            sumButton.textContent = '+';
            sumButton.addEventListener('click', () => {
                improveQuantity(id);
            });

            li.appendChild(removeButton);
            li.appendChild(sumButton);
            cartItemsElement.appendChild(li);
        }

        cartCountElement.textContent = totalItems;
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Guardar el carrito en localStorage
    }

    function reduceQuantity(id) {
        if (cartItems[id].quantity > 1) {
            cartItems[id].quantity--;
        } else {
            delete cartItems[id];
        }
        updateCart();
    }

    function improveQuantity(id) {
        cartItems[id].quantity++;
        updateCart();
    }

    function removeFromCart(productId) {
        if (cartItems[productId].quantity > 1) {
            cartItems[productId].quantity--;
        } else {
            delete cartItems[productId];
        }
        updateCart();
    }

    function setupProductInteractions() {
        document.querySelectorAll('.product-card').forEach(card => {
            const detailsText = card.getAttribute('data-details');
            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'product-details';
            detailsDiv.textContent = detailsText;
            card.appendChild(detailsDiv);
        });
    }

    function sendToWhatsApp() {
        if (Object.keys(cartItems).length === 0) {
            alert("El carrito está vacío.");
            return;
        }
        let message = "Hola, me gustaría consultar el stock de los siguientes productos: \n";
        for (const id in cartItems) {
            message += `${cartItems[id].name} (x${cartItems[id].quantity})\n`;
        }
        let phoneNumber = "+5492644847330";
        let whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    updateCart(); // Cargar el carrito desde localStorage al cargar la página, sin mostrar el carrito automáticamente
});