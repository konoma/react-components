import type { UserConfigExport } from 'vite';

import path from 'node:path';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';
import { defineConfig, esmExternalRequirePlugin } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

import packageJson from './package.json' with { type: 'json' };

async function app(): Promise<UserConfigExport> {
  const formattedName = packageJson.name.match(/[^/]+$/)?.[0] ?? packageJson.name;

  return defineConfig({
    plugins: [
      tailwindcss(),
      react(),
      dts({
        insertTypesEntry: true,
      }),
      cssInjectedByJsPlugin(),
      esmExternalRequirePlugin({
        external: ['react', /^node:/],
      }),
    ],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'main.ts'),
        name: formattedName,
        formats: ['es'],
        fileName: `@konoma-development/react-components`,
      },
      rolldownOptions: {
        // external: [...Object.keys(peerDependencies)],
        external: ['react/jsx-runtime', '@emotion/react', '@emotion/styled'],
        output: {
          minify: false,
          globals: {
            'react': 'React',
            'react/jsx-runtime': 'react/jsx-runtime',
            'react-dom': 'ReactDOM',
            'tailwindcss': 'tailwindcss',
          },
        },
      },
      target: 'esnext',
      sourcemap: true,
    },
  });
}
// https://vitejs.dev/config/
export default app;
