// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import CleanCSS from 'clean-css';
import uglify from 'uglify-js';

function getHash(filePath) {
  const file = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(file).digest('hex');
}

const hashes = {
  'style.css': getHash(path.join(__dirname, 'src', 'public', 'css', 'style.css')),
  'index.js': getHash(path.join(__dirname, 'src', 'public', 'js', 'index.js')),
  'serviceworker.js': getHash(path.join(__dirname, 'src', 'public', 'serviceworker.js')),
  'manifest.json': getHash(path.join(__dirname, 'src', 'public', 'manifest.json'))
}

export default {
  input: 'src/server.ts',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [
    del({
      targets: 'dist'
    }),
    copy({
      targets: [
        { 
          src: 'src/public/img/*',
          dest: 'dist/public/img'
        },
        { 
          src: 'src/public/css/style.css',
          dest: 'dist/public/css',
          rename: (name, extension) => `${name}-${hashes['style.css']}.${extension}`,
          transform: (contents) => new CleanCSS().minify(contents).styles
        },
        { 
          src: 'src/public/js/index.js',
          dest: 'dist/public/js',
          rename: (name, extension) => `${name}-${hashes['index.js']}.${extension}`,
          transform: () => uglify.minify(fs.readFileSync(path.join(__dirname, 'src', 'public', 'js', 'index.js'), 'utf8'), {}).code.replace('%service_worker%', `serviceworker-${hashes['serviceworker.js']}.js`)
        },
        { 
          src: 'src/public/manifest.json',
          dest: 'dist/public'
        },
        { 
          src: 'src/public/serviceworker.js',
          dest: 'dist/public',
          rename: (name, extension) => `${name}-${hashes['serviceworker.js']}.${extension}`,
          transform: () => uglify.minify(fs.readFileSync(path.join(__dirname, 'src', 'public', 'serviceworker.js'), 'utf8'), {}).code
        },
        { src: 'src/views/', dest: 'dist' },
        { 
          src: 'src/views/partials/header.ejs',
          dest: 'dist/views/partials', 
          transform: (contents) => contents.toString('utf8').replace('%js%', `index-${hashes['index.js']}.js`).replace('%style%', `style-${hashes['style.css']}.css`)
        }
      ]
    }),
    typescript(),
    terser()
  ],
  external: ['express', 'path', 'node-fetch', 'crypto', 'ejs', 'compression'],
  watch: {
    include: ['src/**'],
    extra: ['src/**'],
    exclude: ['node_modules/**'],
    chokidar: false
  }
};