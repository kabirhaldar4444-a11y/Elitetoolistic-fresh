export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Forwarded-For');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const PAYALMA_API_URL = 'https://gate.payalma.com/api/v1/purchases/';
    const PAYALMA_BRAND_ID = '9a0999f4-1298-4336-8b85-7c5d86238553';
    const PAYALMA_API_KEY = 'q_H9dTYyAEtoFVVhGPkREQLc27gGVIq3g8EONZemZN4wEvcqcZBou-7LckEecYcxVyjW46kSrvV6sSSNNnOWXA==';

    try {
        let payload = req.body;
        if (typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            } catch (e) {
                payload = {};
            }
        }
        payload = payload || {};
        payload.brand_id = PAYALMA_BRAND_ID;

        // Ensure country is set to India for Indian UPI/P2P agents
        if (!payload.client) payload.client = {};
        if (!payload.client.country) payload.client.country = 'IN';

        // Extract real visitor IP (from India) and forward to PayAlma
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.headers['x-real-ip'];

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PAYALMA_API_KEY}`
        };

        if (clientIp) {
            headers['X-Forwarded-For'] = clientIp;
            headers['X-Real-IP'] = clientIp;
        }

        const response = await fetch(PAYALMA_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('PayAlma Vercel Error:', error);
        return res.status(500).json({ error: error.message || 'Payment initiation failed' });
    }
}
