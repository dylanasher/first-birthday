import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wishesCsv from './dev/wishes-csv.js';

// The site is published on GitHub Pages at https://dylanasher.github.io/first-birthday/, so production
// builds live under /first-birthday/. Local development stays at the root (http://localhost:5173/).
const BASE = '/first-birthday/';

// The scenes refer to artwork as "/art/…". In a build under a sub-folder, prefix those with the base.
function artUnderBase(base) {
  return {
    name: 'art-under-base',
    apply: 'build',
    enforce: 'pre',
    transform(code, id) {
      if (base === '/' || !/\/src\/.*\.(jsx?|css)$/.test(id)) return null;
      const out = code.replace(/(["'`(])\/art\//g, `$1${base}art/`);
      return out === code ? null : { code: out, map: null };
    },
  };
}

export default defineConfig(({ command }) => {
  const base = command === 'build' ? (process.env.BASE_PATH ?? BASE) : '/';
  return {
    base,
    plugins: [react(), wishesCsv(), artUnderBase(base)],
  };
});
