/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
  return {
    plugins: [react(), tsconfigPaths()],
    base: process.env.VITE_BO_ROUTER_BASENAME || '',
    server: {
      fs: {
        allow: ['..'],
      },
      proxy: {
        '/api/bo': {
          target: process.env.BO_PUBLIC_API_URL,
          changeOrigin: true,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(
                'Proxying:',
                req.method,
                req.url,
                '->',
                options.target + proxyReq.path
              );
            });
          },
        },
        '/uploads': {
          target: process.env.BO_PUBLIC_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
