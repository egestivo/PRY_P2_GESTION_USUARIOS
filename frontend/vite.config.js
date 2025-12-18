import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: '0.0.0.0', // Escuchar en todas las interfaces de red
        proxy: {
            '/api': {
                target: 'http://localhost:1234',
                changeOrigin: true,
                secure: false,
            },
            '/uploads': {
                target: 'http://localhost:1234',
                changeOrigin: true,
                secure: false,
            }
        },
        port: 5173,
        open: true
    }
});
