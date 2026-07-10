// ============================================================
// Login.jsx — 子ども向けログイン画面（メール不要）。
//  ・初めての人：ID・ニックネーム・合言葉（パスワード）を自分で決めて登録。
//  ・2回目以降：IDは前回の記憶から自動で入っていて、合言葉を入れるだけ。
//  ・「自動ログイン」にチェックすると、次回はそれすら省略して直接入れる
//    （共有の端末では毎回チェックを外すことをすすめる）。
//  認証ON（Supabase設定済み）のときだけ AuthGate から表示される。
// ============================================================
import { useState } from "react";
import { signInKid } from "../auth/kidAuth.js";
import { getRememberedId, setRememberedId, getAutoLogin, setAutoLogin } from "../auth/loginPrefs.js";

export default function Login({ onDone }) {
  const remembered = getRememberedId();
  const [isNewMode, setIsNewMode] = useState(!remembered); // 記憶ID無し＝初めての人モード
  const [id, setId] = useState(remembered);
  const [nickname, setNickname] = useState("");
  const [pin, setPin] = useState("");
  const [autoLogin, setAutoLoginState] = useState(() => getAutoLogin());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const ready = id.trim() && /^\d{4}$/.test(pin) && (!isNewMode || nickname.trim());

  async function submit(e) {
    e?.preventDefault();
    if (!ready || busy) return;
    setBusy(true); setErr("");
    try {
      const { uid } = await signInKid(id, pin, nickname);
      setRememberedId(id);
      setAutoLogin(autoLogin);
      onDone?.(uid);
    } catch (e2) {
      setErr(e2.message || "ログインできませんでした。");
      setBusy(false);
    }
  }

  function switchToNew() {
    setIsNewMode(true);
    setId("");
    setNickname("");
    setPin("");
    setErr("");
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
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", marginBottom: 18 }}>
          {isNewMode ? "ログインして はじめよう" : "おかえりなさい！"}
        </div>

        <div style={{ textAlign: "left", marginBottom: 12 }}>
          <div style={lbl}>ID</div>
          <input style={inp} value={id} onChange={(e) => setId(e.target.value)} placeholder="IDを入れてください。（例：1204）" autoCapitalize="off" autoCorrect="off" />
        </div>

        {isNewMode && (
          <div style={{ textAlign: "left", marginBottom: 12 }}>
            <div style={lbl}>ニックネーム</div>
            <input style={inp} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="れい：さとうたろう" />
          </div>
        )}

        <div style={{ textAlign: "left", marginBottom: 10 }}>
          <div style={lbl}>合言葉（パスワード・すうじ4つ）</div>
          <input style={{ ...inp, letterSpacing: 6, textAlign: "center" }} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
            inputMode="numeric" placeholder="１２３４" />
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "left", fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,.75)", margin: "4px 0 2px", cursor: "pointer" }}>
          <input type="checkbox" checked={autoLogin} onChange={(e) => setAutoLoginState(e.target.checked)} style={{ width: 16, height: 16 }} />
          🔓 自動ログイン（次からパスワード入力なしで入れる）
        </label>
        {autoLogin && (
          <div style={{ fontSize: 10.5, color: "#fcd34d", marginTop: 3, textAlign: "left", lineHeight: 1.5 }}>
            ⚠️ みんなで使うパソコンでは チェックしないでね
          </div>
        )}

        {!isNewMode && (
          <button type="button" onClick={switchToNew} data-sfx="none"
            style={{ marginTop: 10, background: "none", border: "none", color: "#7dd3fc", fontSize: 11.5, fontWeight: 700, cursor: "pointer", padding: 4 }}>
            🔁 ちがうIDを つかう（はじめての人はこちら）
          </button>
        )}

        {err && <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fca5a5", margin: "10px 0 0", lineHeight: 1.5 }}>⚠️ {err}</div>}

        <button type="submit" disabled={!ready || busy} data-sfx="none" style={{
          width: "100%", marginTop: 16, padding: "14px", borderRadius: 13, border: "none",
          cursor: ready && !busy ? "pointer" : "not-allowed", fontSize: 16, fontWeight: 900, color: "#fff",
          background: ready && !busy ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,.12)",
        }}>{busy ? "…" : isNewMode ? "▶ はじめる" : "▶ ログイン"}</button>

        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.4)", marginTop: 14, lineHeight: 1.6 }}>
          {isNewMode
            ? <>IDと合言葉は自分で決めよう。わすれないようにメモしておいてね！<br />ニックネームはあとから いつでも変えられるよ。</>
            : <>ID・合言葉が ちがう人は「ちがうIDを つかう」を押してね。</>}
        </div>
      </form>
    </div>
  );
}
