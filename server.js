const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = __dirname;

const PAYALMA_API_URL = 'https://gate.payalma.com/api/v1/purchases/';
const PAYALMA_BRAND_ID = '9a0999f4-1298-4336-8b85-7c5d86238553';
const PAYALMA_API_KEY = 'q_H9dTYyAEtoFVVhGPkREQLc27gGVIq3g8EONZemZN4wEvcqcZBou-7LckEecYcxVyjW46kSrvV6sSSNNnOWXA==';

const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.htm': 'text/html; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.mjs': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.mp4': 'video/mp4',
    '.txt': 'text/plain; charset=UTF-8'
};

async function handleCheckout(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', async () => {
        try {
            let payload = {};
            try {
                payload = JSON.parse(body || '{}');
            } catch (err) {
                payload = {};
            }

            payload.brand_id = PAYALMA_BRAND_ID;
            if (!payload.client) payload.client = {};
            if (!payload.client.country) payload.client.country = 'IN';

            const response = await fetch(PAYALMA_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${PAYALMA_API_KEY}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            res.writeHead(response.status, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify(data));
        } catch (error) {
            console.error('Checkout error:', error);
            res.writeHead(500, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: error.message || 'Payment initiation failed' }));
        }
    });
}

function resolveFile(pathname) {
    let decoded = decodeURIComponent(pathname);
    let safePath = path.normalize(path.join(ROOT_DIR, decoded));

    if (!safePath.startsWith(ROOT_DIR)) {
        return null; // Path traversal attempt
    }

    // Direct file check
    if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
        return safePath;
    }

    // Directory check with index.html
    if (fs.existsSync(safePath) && fs.statSync(safePath).isDirectory()) {
        const indexFile = path.join(safePath, 'index.html');
        if (fs.existsSync(indexFile) && fs.statSync(indexFile).isFile()) {
            return indexFile;
        }
    }

    // Clean URL check (.html extension)
    const htmlFile = safePath + '.html';
    if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
        return htmlFile;
    }

    // Course rewrites support: /courses/:slug -> /:slug or courses/:slug
    if (decoded.startsWith('/courses/')) {
        const fallbackRel = decoded.replace('/courses/', '/');
        const fallbackPath = path.normalize(path.join(ROOT_DIR, fallbackRel));
        if (fs.existsSync(fallbackPath) && fs.statSync(fallbackPath).isFile()) {
            return fallbackPath;
        }
        if (fs.existsSync(fallbackPath + '.html') && fs.statSync(fallbackPath + '.html').isFile()) {
            return fallbackPath + '.html';
        }
    }

    return null;
}

const server = http.createServer((req, res) => {
    // CORS headers for local testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url);
    const pathname = parsedUrl.pathname;

    // Handle checkout API
    if (req.method === 'POST' && (pathname === '/api/checkout' || pathname === '/api/checkout.php')) {
        return handleCheckout(req, res);
    }

    // Static file serving
    const filePath = resolveFile(pathname);

    if (!filePath) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end('<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(`500 Internal Server Error: ${err.message}`);
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
