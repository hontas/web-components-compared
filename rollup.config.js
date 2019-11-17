import fs from 'fs';
import path from 'path';

import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

const svelteConfig = require('./svelte.config');

const production = !process.env.ROLLUP_WATCH;
const svelteDir = 'src/svelte';
const svelteFiles = fs
  .readdirSync(path.resolve(__dirname, svelteDir))
  .filter((file) => file.endsWith('.svelte'))
  .map((file) => `${svelteDir}/${file}`);

export default {
  input: ['src/index.js', 'src/litElement/toggle-lit.js', 'src/custom-elements/toggle-native.js', ...svelteFiles],
  output: {
    sourcemap: !production,
    format: 'esm',
    name: 'app',
    dir: 'public'
  },
  plugins: [
    postcss({
      plugins: []
    }),
    svelte({
      dev: !production,
      // Tell the compiler to output a custom element.
      ...svelteConfig
    }),
    resolve(),
    commonjs(),

    // Enable live reloading in development mode
    !production && livereload('public'),

    // Minify the production build (npm run build)
    production && terser()
  ]
};
