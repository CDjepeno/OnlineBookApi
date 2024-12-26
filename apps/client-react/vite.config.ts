import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: '0.0.0.0', // Permet l'accès au serveur Vite depuis l'extérieur du conteneur Docker
    watch: {
      usePolling: true, // Active le mécanisme de polling pour la détection des fichiers modifiés (important dans Docker)
    },
    port: 5173, // Assurez-vous que Vite écoute sur le bon port
  },
  optimizeDeps: {
    exclude: [
      // Liste des modules problématiques à exclure
      'chunk-JXL2BQXN',
      'chunk-XXMZDULW',
      'chunk-SKZERVZA',
      'chunk-H3AUP6SJ',
      'chunk-QZDI5KS6',
    ],
  },
});
