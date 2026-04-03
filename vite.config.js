import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const MINIMAX_UPSTREAM_URL = 'https://api.minimaxi.com/v1/chat/completions';

const readRequestBody = async (req) =>
    new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => resolve(raw));
        req.on('error', reject);
    });

const writeJson = (res, statusCode, payload) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
};

const createMiniMaxMiddleware = (apiKey) => async (req, res, next) => {
    if (req.method !== 'POST') {
        return next();
    }

    if (!apiKey) {
        return writeJson(res, 500, {
            error: 'MINIMAX_API_KEY is missing. Add it to .env.local before using AI features.',
        });
    }

    try {
        const rawBody = await readRequestBody(req);
        const parsedBody = rawBody ? JSON.parse(rawBody) : {};
        const upstreamRes = await fetch(MINIMAX_UPSTREAM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(parsedBody),
        });

        const upstreamText = await upstreamRes.text();
        res.statusCode = upstreamRes.status;
        res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'application/json; charset=utf-8');
        res.end(upstreamText);
    } catch (error) {
        console.error('MiniMax proxy error:', error);
        writeJson(res, 502, {
            error: 'Failed to reach MiniMax upstream.',
        });
    }
};

const minimaxProxyPlugin = (apiKey) => ({
    name: 'moly-minimax-proxy',
    configureServer(server) {
        server.middlewares.use('/api/minimax/chat', createMiniMaxMiddleware(apiKey));
    },
    configurePreviewServer(server) {
        server.middlewares.use('/api/minimax/chat', createMiniMaxMiddleware(apiKey));
    },
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const minimaxApiKey = env.MINIMAX_API_KEY || '';

    return {
        plugins: [react(), minimaxProxyPlugin(minimaxApiKey)],
    };
});
