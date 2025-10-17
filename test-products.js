// Archivo de prueba para verificar productos
document.addEventListener('DOMContentLoaded', function() {
    console.log('Test iniciado');
    
    // Datos de productos simplificados
    const testProducts = [
        {
            id: 1,
            name: "Gin Belladonna",
            price: 25000,
            image: "./IMG/Gin Belladonna.jpg",
            category: "gin",
            description: "Gin premium"
        },
        {
            id: 2,
            name: "Vino Malbec",
            price: 5500,
            image: "./IMG/Cordero Con Piel de Lobo Malbec.jpg",
            category: "vino",
            description: "Vino tinto"
        }
    ];

    function renderTestProducts() {
        const productsGrid = document.getElementById('products-grid');
        if (!productsGrid) {
            console.error('No se encontró el contenedor de productos');
            return;
        }

        console.log('Renderizando productos de prueba');
        productsGrid.innerHTML = '';

        testProducts.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover;">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toLocaleString()}</p>
                    <button class="add-to-cart" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Agregar al Carrito
                    </button>
                </div>
            `;
            productsGrid.appendChild(card);
        });

        console.log('Productos de prueba renderizados');
    }

    // Ejecutar después de un pequeño delay
    setTimeout(renderTestProducts, 500);
}); 