import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

const MFE_AUTH_URL =
  process.env.MFE_AUTH_URL || "http://localhost:4001/assets/remoteEntry.js";
const MFE_PRODUCT_URL =
  process.env.MFE_PRODUCT_URL || "http://localhost:4002/assets/remoteEntry.js";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        mfe_auth: MFE_AUTH_URL,
        mfe_product: MFE_PRODUCT_URL,
      },
      shared: ["react", "react-dom", "@mui/material", "@emotion/react", "@emotion/styled"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
});
