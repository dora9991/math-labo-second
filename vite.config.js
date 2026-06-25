import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite の設定。
// base は GitHub Pages のリポジトリ名と完全一致させる（公開URL github.io/ここ/）。
// リポジトリ名: math-labo10 → base: "./"
// ※ ここがズレると公開時に真っ白になる。リポジトリ名を変えたらここも直すこと。
export default defineConfig({
  base: "./",
  plugins: [react()],
});
