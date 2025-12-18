import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:1234',
                changeOrigin: true,
                secure: false,
            }
        },
        port: 5173,
        open: true
    }
});
