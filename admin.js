const API_URL = 'http://localhost:3000';
let token = localStorage.getItem('token');

function showAdmin() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-section').style.display = 'block';
    loadProducts();
}

function hideAdmin() {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-section').style.display = 'none';
}

async function loadProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    try {
        const res = await fetch(`${API_URL}/products`);
        const products = await res.json();
        products.forEach(p => {
            const li = document.createElement('li');
            li.textContent = `${p.name} - $${p.price}`;
            const del = document.createElement('button');
            del.textContent = 'Eliminar';
            del.addEventListener('click', async () => {
                await fetch(`${API_URL}/products/${p.id}`, { method: 'DELETE', headers: { 'Authorization': token }});
                loadProducts();
            });
            li.appendChild(del);
            list.appendChild(li);
        });
    } catch (err) {
        console.error('Error al cargar productos', err);
    }
}

document.getElementById('login-button').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error('Credenciales incorrectas');
        const data = await res.json();
        token = data.token;
        localStorage.setItem('token', token);
        showAdmin();
    } catch (err) {
        alert('Credenciales incorrectas');
    }
});

document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    token = null;
    hideAdmin();
});

const addBtn = document.getElementById('add-product');
addBtn.addEventListener('click', async () => {
    const name = document.getElementById('prod-name').value;
    const price = document.getElementById('prod-price').value;
    const image = document.getElementById('prod-image').value;
    const details = document.getElementById('prod-details').value;
    if (!name || !price) {
        alert('Nombre y precio son obligatorios');
        return;
    }
    await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ name, price, image, details })
    });
    document.getElementById('prod-name').value = '';
    document.getElementById('prod-price').value = '';
    document.getElementById('prod-image').value = '';
    document.getElementById('prod-details').value = '';
    loadProducts();
});

if (token) {
    showAdmin();
} else {
    hideAdmin();
}
