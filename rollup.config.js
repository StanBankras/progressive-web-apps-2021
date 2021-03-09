// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import uglify from '@lopatnov/rollup-plugin-uglify';

export default {
  input: 'src/server.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [typescript(), uglify()],
  external: ['express', 'path', 'node-fetch']
};