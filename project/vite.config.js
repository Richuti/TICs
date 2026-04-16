import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Multi‑página: `index.html` (sitio) + `simulador.html` (solo la placa 3D).
 */
export default defineConfig({
  server: {
    open: '/index.html',
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        simulador: resolve(__dirname, 'simulador.html'),
      },
    },
  },
});
