import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    // ================================================================
    // MANUAL CHUNK SPLITTING — Vendor Library Isolation
    // ================================================================
    // By default, Vite bundles ALL JavaScript into a single chunk.
    // This means when you change one line of App.jsx, users must
    // re-download React, ReactDOM, React Router, and Lucide icons
    // even though those libraries haven't changed.
    //
    // Manual chunks split vendor libraries into separate files:
    //   - vendor-react.js    (~140KB) — React core + ReactDOM
    //   - vendor-router.js   (~50KB)  — React Router DOM
    //   - vendor-icons.js    (~80KB)  — Lucide icon library
    //   - index.js           (~100KB) — Your application code
    //
    // CACHE BENEFIT: Vendor chunks get long-lived cache headers on
    // Vercel (immutable hashes in filenames). When you deploy a code
    // change, users only re-download the changed chunk — typically
    // just index.js. The vendor chunks are served from browser cache.
    // ================================================================
    rollupOptions: {
      output: {
        // Vite 8.x uses Rolldown which requires manualChunks as a function.
        // The function receives the full module path and returns the chunk name.
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/react/')) return 'vendor-react';
          if (id.includes('node_modules/react-router-dom')) return 'vendor-router';
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
        },
      },
    },
  },
})