// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';

export default {
  input: 'src/server.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    del({
      targets: 'dist/*'
    }),
    copy({
      targets: [{ src: 'src/public/*', dest: 'dist' }]
    }),
    typescript(),
    terser()
  ],
  external: ['express', 'path', 'node-fetch'],
  watch: {
    include: ['src/**'],
    extra: ['src/**'],
    exclude: ['node_modules/**'],
    chokidar: false
  }
};