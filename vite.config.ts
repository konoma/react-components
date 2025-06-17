import path from 'node:path';

import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import type { UserConfigExport } from 'vite';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

import packageJson from './package.json' with { type: 'json' };

const app = async (): Promise<UserConfigExport> => {
  const formattedName = packageJson.name.match(/[^/]+$/)?.[0] ?? packageJson.name;

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
        plugins: [tailwindcss()],
      },
    },
    build: {
      minify: false,
      lib: {
        entry: path.resolve(__dirname, 'main.ts'),
        name: formattedName,
        formats: ['es'],
        fileName: `@konoma-development/react-components`,
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
