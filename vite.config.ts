import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/mario-todos/",
  plugins: [tailwindcss()],
});
