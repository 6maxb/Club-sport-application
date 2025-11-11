import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, 'src'),
    },
  },
  build: {
    // Évite que Prisma (client généré + runtime) soit bundlé dans main.
    // Cela contourne un bug d'interop avec `node:process` dans le bundle CJS.
    rollupOptions: {
      external: (id: string) => {
        return (
          id.includes('src/main/repositories/prisma/generated') ||
          id === '@prisma/client' ||
          id.startsWith('@prisma/')
        );
      },
    },
    target: 'node18',
  },
});
