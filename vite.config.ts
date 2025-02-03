import path from 'node:path';

import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import type { UserConfigExport } from 'vite';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

import { peerDependencies } from './package.json';
import { name } from './package.json';

const app = async (): Promise<UserConfigExport> => {
  const formattedName = name.match(/[^/]+$/)?.[0] ?? name;

  return defineConfig({
    plugins: [
      react(),
      dts({
        insertTypesEntry: true,
      }),
      cssInjectedByJsPlugin(),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    build: {
      minify: false,
      lib: {
        entry: path.resolve(__dirname, 'main.ts'),
        name: formattedName,
        formats: ['es'],
        fileName: `@konoma/react-components`,
      },
      rollupOptions: {
        // external: [...Object.keys(peerDependencies)],
        external: ['react', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react/jsx-runtime': 'react/jsx-runtime',
            'react-dom': 'ReactDOM',
            tailwindcss: 'tailwindcss',
          },
        },
      },
      target: 'esnext',
      sourcemap: true,
    },
  });
};
// https://vitejs.dev/config/
export default app;
