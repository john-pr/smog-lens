import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    svgr(),
  ],
   server: {
    proxy: {
      "/gios": {
        target: "https://api.gios.gov.pl",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/gios/, ""),
      },
    },
  },
})
