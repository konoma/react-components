import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    // sourcemap: 'inline',
    lib: {
      entry: resolve(__dirname, 'main.ts'),
      name: 'Konoma React Components',
      formats: ['es'],
      // the proper extensions will be added
      fileName: '@konoma/react-components',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react/jsx-runtime'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
