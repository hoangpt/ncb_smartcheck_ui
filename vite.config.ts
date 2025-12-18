import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/

const TARGET = 'https://ncb-smart-dev.hocai.qzz.io/api';
const ORIGINS_TO_REWRITE = [
  'https://ncb-smart-dev.hocai.qzz.io/api',
  'https://ncb-smartapi-dev.hocai.qzz.io'
];

const proxyConfig = {
  target: TARGET,
  changeOrigin: true,
  secure: false,
  cookieDomainRewrite: 'localhost',
  configure: (proxy, _options) => {
    proxy.on('proxyRes', (proxyRes, req, _res) => {
      if (proxyRes.headers['location']) {
        ORIGINS_TO_REWRITE.forEach((origin) => {
          proxyRes.headers['location'] = proxyRes.headers['location'].replace(origin, '');
        });
      }
    });
  }
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ensure a single React instance is used everywhere
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  server: {
    proxy: {
      '/auth': proxyConfig,
      '/users': proxyConfig,
      '/api': proxyConfig
    }
  }
})
