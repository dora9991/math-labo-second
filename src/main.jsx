// ============================================================
// main.jsx — アプリの入口。React を起動して App を画面に描く。
// 基本的にここは触らない。
// ============================================================
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/theme.css";
import "./styles/battle.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
