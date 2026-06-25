import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "mfe_product",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductListPage":      "./src/pages/ProductList",
        "./ProductDetailPage":    "./src/pages/ProductDetail",
        "./ProductListAdminPage": "./src/pages/ProductCreate",
        "./ProductEditAdminPage": "./src/pages/ProdutEdit",
      },
      shared: ["react", "react-dom", "@mui/material", "@emotion/react", "@emotion/styled"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
  },
  server: {
    port: 4002,
    host: true,
  },
  preview: {
    port: 4002,
    host: true,
  },
});