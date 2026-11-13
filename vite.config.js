import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wishesCsv from './dev/wishes-csv.js';

export default defineConfig({
  plugins: [react(), wishesCsv()],
});
