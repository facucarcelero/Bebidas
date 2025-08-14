const http = require('http');
const fs = require('fs');
const { parse } = require('url');
const crypto = require('crypto');

const DB_FILE = './db.json';
const USERS_FILE = './users.json';
const PORT = 3000;
const sessions = {};

function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ products: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

function sendJSON(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS'
    });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS'
        });
        return res.end();
    }

    const { pathname } = parse(req.url, true);

    if (req.method === 'POST' && pathname === '/login') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const { username, password } = JSON.parse(body || '{}');
            const users = readUsers().users || [];
            const user = users.find(u => u.username === username);
            const hash = crypto.createHash('sha256').update(password).digest('hex');
            if (user && user.passwordHash === hash) {
                const token = crypto.randomBytes(16).toString('hex');
                sessions[token] = username;
                sendJSON(res, 200, { token });
            } else {
                sendJSON(res, 401, { error: 'Unauthorized' });
            }
        });
        return;
    }

    if (req.method === 'GET' && pathname === '/products') {
        const db = readDB();
        return sendJSON(res, 200, db.products);
    }

    if (req.method === 'POST' && pathname === '/products') {
        const token = req.headers['authorization'];
        if (!sessions[token]) return sendJSON(res, 401, { error: 'Unauthorized' });
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const product = JSON.parse(body || '{}');
            const db = readDB();
            product.id = Date.now();
            db.products.push(product);
            writeDB(db);
            sendJSON(res, 200, product);
        });
        return;
    }

    if (req.method === 'DELETE' && pathname.startsWith('/products/')) {
        const token = req.headers['authorization'];
        if (!sessions[token]) return sendJSON(res, 401, { error: 'Unauthorized' });
        const id = parseInt(pathname.split('/')[2], 10);
        const db = readDB();
        const idx = db.products.findIndex(p => p.id === id);
        if (idx >= 0) {
            db.products.splice(idx, 1);
            writeDB(db);
            return sendJSON(res, 200, { success: true });
        }
        return sendJSON(res, 404, { error: 'Not found' });
    }

    sendJSON(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
