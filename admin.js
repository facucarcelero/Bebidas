const USER = 'admin';
const PASS = '1234';

function showAdmin() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    loadProducts();
}

function hideAdmin() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-section').style.display = 'none';
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    products.forEach((p, index) => {
        const li = document.createElement('li');
        li.textContent = `${p.name} - $${p.price}`;
        const del = document.createElement('button');
        del.textContent = 'Eliminar';
        del.addEventListener('click', () => {
            products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(products));
            loadProducts();
        });
        li.appendChild(del);
        list.appendChild(li);
    });
}

document.getElementById('login-button').addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (user === USER && pass === PASS) {
        localStorage.setItem('loggedIn', 'true');
        showAdmin();
    } else {
        alert('Credenciales incorrectas');
    }
});

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('loggedIn');
    hideAdmin();
});

const addBtn = document.getElementById('add-product');
addBtn.addEventListener('click', () => {
    const name = document.getElementById('prod-name').value;
    const price = document.getElementById('prod-price').value;
    const image = document.getElementById('prod-image').value;
    const details = document.getElementById('prod-details').value;
    if (!name || !price) {
        alert('Nombre y precio son obligatorios');
        return;
    }
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({ name, price, image, details });
    localStorage.setItem('products', JSON.stringify(products));
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-image').value = '';
    document.getElementById('prod-details').value = '';
    loadProducts();
});

if (localStorage.getItem('loggedIn') === 'true') {
    showAdmin();
} else {
    hideAdmin();
}
