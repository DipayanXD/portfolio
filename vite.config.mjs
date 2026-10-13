import { defineConfig } from 'vite';
import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [{
    name: 'portfolio-legacy-assets',
    apply: 'build',
    async writeBundle(options) {
      // Classic desktop scripts and their runtime asset paths remain unchanged.
      const output = resolve(options.dir || 'dist');
      for (const directory of ['icon', 'images', 'background', 'cursor']) {
        await cp(resolve(directory), resolve(output, directory), { recursive: true });
      }
      await mkdir(resolve(output, 'javascript'), { recursive: true });
      for (const script of ['script.js', 'app.js', 'notes-app.js']) {
        await cp(resolve('javascript', script), resolve(output, 'javascript', script));
      }
    },
  }],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  // Root files already belong to Vite's source tree. Serving it again as public
  // bypasses module transforms (including bare Lucide imports and Vite's client).
  publicDir: false,
  build: {
    outDir: 'dist',
  },
});
