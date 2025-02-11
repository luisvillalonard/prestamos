import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import dotenv from 'dotenv'

dotenv.config();

export default defineConfig(() => {
  const env = loadEnv("mock", process.cwd(), "");

  return {
    define: {
      'process.env': env
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@contexts': path.resolve(__dirname, 'src/contexts'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@interfaces': path.resolve(__dirname, 'src/interfaces'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@reducers': path.resolve(__dirname, 'src/reducers'),
      },
    },
    plugins: [react()],
  };
});
