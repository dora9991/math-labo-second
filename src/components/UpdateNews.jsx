// ============================================================
// UpdateNews.jsx — メニュー上部の「アップデート情報」。
//  ・折りたたみ時：最新のお知らせのタイトルが1行だけ見える（一部だけ表示）。
//  ・タップで開くと全部の履歴が見られる。開いたら「NEW」バッジは消える（既読）。
//  ・既読管理は localStorage だけで完結（Homeにpropsを足さない・自己完結）。
// ============================================================
import { useState } from "react";
import { UPDATES } from "../data/updates.js";

const SEEN_KEY = "ml2_last_seen_update";

function fmtDate(iso) {
  const m = String(iso).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${Number(m[2])}/${Number(m[3])}` : iso;
}

export default function UpdateNews() {
  const latest = UPDATES[0];
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => { try { return localStorage.getItem(SEEN_KEY) || ""; } catch { return ""; } });
  if (!latest) return null;

  const isNew = latest.date > seen; // ISO日付は文字列比較で新旧判定できる

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next && isNew) {
      try { localStorage.setItem(SEEN_KEY, latest.date); } catch { /* noop */ }
      setSeen(latest.date);
    }
  }

  const A = "#fbbf24"; // アクセント（お知らせ色）

  return (
    <div style={{ margin: "0 0 12px", borderRadius: 12, overflow: "hidden",
      background: "rgba(251,191,36,.10)", border: `1px solid ${isNew ? "rgba(251,191,36,.6)" : "rgba(251,191,36,.28)"}` }}>
      {/* 折りたたみバー：最新タイトルが1行だけ見える */}
      <button data-sfx="none" onClick={toggle} style={{
        width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 13px",
        background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "#fff", textAlign: "left",
      }}>
        <span style={{ fontSize: 15, flexShrink: 0 }}>📢</span>
        <span style={{ fontSize: 10.5, fontWeight: 900, color: A, flexShrink: 0, letterSpacing: 0.5 }}>おしらせ</span>
        {isNew && (
          <span style={{ fontSize: 9, fontWeight: 900, color: "#3a2a00", background: A, borderRadius: 999, padding: "1px 6px", flexShrink: 0 }}>NEW</span>
        )}
        <span style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.82)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {latest.title}
        </span>
        <span style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,.5)", flexShrink: 0 }}>{open ? "▲ とじる" : "▼ もっと見る"}</span>
      </button>

      {/* 展開：全履歴 */}
      {open && (
        <div style={{ padding: "2px 13px 13px", maxHeight: 320, overflowY: "auto" }}>
          {UPDATES.map((u, i) => (
            <div key={i} style={{ padding: "9px 0", borderTop: i === 0 ? "1px solid rgba(251,191,36,.2)" : "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: A, background: "rgba(251,191,36,.15)", borderRadius: 6, padding: "1px 7px", flexShrink: 0 }}>{fmtDate(u.date)}</span>
                <span style={{ fontSize: 12.5, fontWeight: 900, color: "#fff" }}>{u.title}</span>
              </div>
              <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
                {u.body.map((line, j) => (
                  <li key={j} style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,.75)", lineHeight: 1.6, marginBottom: 2 }}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
