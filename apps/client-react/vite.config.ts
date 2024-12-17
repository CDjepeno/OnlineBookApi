import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
})
