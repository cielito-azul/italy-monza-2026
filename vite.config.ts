import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/italy-monza-2026/",
  plugins: [react()],
  build: {
    target: "es2022",
  },
});
