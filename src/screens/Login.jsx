// ============================================================
// Login.jsx — 子ども向けログイン画面（メール不要）。
//  クラスコード＋なまえ＋あいことば(4桁) を入れるだけ。初回は自動でアカウント作成。
//  認証ON（Supabase設定済み）のときだけ AuthGate から表示される。
// ============================================================
import { useState } from "react";
import { signInKid } from "../auth/kidAuth.js";

export default function Login({ onDone }) {
  const [classCode, setClassCode] = useState("");
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const ready = classCode.trim() && name.trim() && /^\d{4}$/.test(pin);

  async function submit(e) {
    e?.preventDefault();
    if (!ready || busy) return;
    setBusy(true); setErr("");
    try {
      const { uid } = await signInKid(classCode, name, pin);
      onDone?.(uid);
    } catch (e2) {
      setErr(e2.message || "ログインできませんでした。");
      setBusy(false);
    }
  }

  const inp = {
    width: "100%", padding: "13px 14px", borderRadius: 12, fontSize: 16, fontWeight: 700,
    border: "1.5px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "#fff",
    fontFamily: "inherit", boxSizing: "border-box",
  };
  const lbl = { fontSize: 12, fontWeight: 800, color: "#c7d2fe", margin: "0 0 5px 2px" };

  return (
    <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100dvh", padding: 20 }}>
      <form onSubmit={submit} className="glass" style={{ width: "100%", maxWidth: 360, padding: "26px 22px", textAlign: "center" }}>
        <div style={{ fontSize: 30 }}>📐</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "2px 0 2px" }}>数学ラボ2</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginBottom: 18 }}>ログインして はじめよう</div>

        <div style={{ textAlign: "left", marginBottom: 12 }}>
          <div style={lbl}>クラスコード</div>
          <input style={inp} value={classCode} onChange={(e) => setClassCode(e.target.value)} placeholder="IDを入れてください。（例：1204）" autoCapitalize="off" autoCorrect="off" />
        </div>
        <div style={{ textAlign: "left", marginBottom: 12 }}>
          <div style={lbl}>なまえ</div>
          <input style={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="れい：さとうたろう" />
        </div>
        <div style={{ textAlign: "left", marginBottom: 6 }}>
          <div style={lbl}>あいことば（すうじ4つ）</div>
          <input style={{ ...inp, letterSpacing: 6, textAlign: "center" }} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric" placeholder="１２３４" />
        </div>

        {err && <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fca5a5", margin: "10px 0 0", lineHeight: 1.5 }}>⚠️ {err}</div>}

        <button type="submit" disabled={!ready || busy} data-sfx="none" style={{
          width: "100%", marginTop: 16, padding: "14px", borderRadius: 13, border: "none",
          cursor: ready && !busy ? "pointer" : "not-allowed", fontSize: 16, fontWeight: 900, color: "#fff",
          background: ready && !busy ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,.12)",
        }}>{busy ? "…" : "▶ はじめる"}</button>

        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.4)", marginTop: 14, lineHeight: 1.6 }}>
          はじめての人は、そのまま入るとアカウントが作られます。<br />クラスコードとあいことばは先生にきいてね。
        </div>
      </form>
    </div>
  );
}
