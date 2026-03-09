import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()], // Active le support React (HMR, JSX, etc.)
  server: {
    port: 5173,      // Port du serveur de développement
    open: true,       // Ouvre automatiquement le navigateur
    proxy: {          // Redirige les requêtes API vers le backend
      '/api': {
        target: 'http://localhost:5000', // Backend Express
        changeOrigin: true,
        secure: false,
      }
    }
  },
  resolve: {
    alias: {          // Permet d'utiliser '@' comme raccourci vers /src
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',   // Dossier de build (au lieu de 'build' pour CRA)
    sourcemap: true,  // Génère les sourcemaps pour le débogage
  }
})