import { defineConfig } from 'vite';
import path from 'path';

// index.html과 함께 pdfResult.html도 build해주기 위해 설정
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        result: path.resolve(__dirname, 'pdfResult.html'),
      },
    },
  },
});
