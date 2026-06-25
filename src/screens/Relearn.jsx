// ============================================================
// Relearn.jsx — 学び直しモード（間違いノート＋学び直しの一本化）
//
//  押すと「自分が間違えた問題の一覧」が単元ごとに出る。
//  各単元で：
//    ✏️ 学び直し … その単元を時間制限なしで練習（1問15XP＝1.5倍・15問ごとに💎+1・学習のコア）
//    📺 解説     … 葉一さん（19ch）の解説動画ページへ
//  各問題で：✓ できた … その問題をノートから消す
//
//  ※ タイムアタック・バトル・単元テストなど、全モードの誤答が貯まる。
// ============================================================
import { useState } from "react";
import Header from "../components/Header.jsx";
import MathText from "../components/MathText.jsx";
import { findUnitById, findChapterByUnitId } from "../data/index.js";
import { videoUrlFor } from "../data/videoLinks.js";
import { hasHaichiLessonForUnit } from "../data/haichiCourse.js";

const GRADE_LABEL = { 1: "中1", 2: "中2", 3: "中3" };

export default function Relearn({ player, mistakes = [], onRelearn, onHaichi, onRemove, onBack }) {
  // ★4 間違い＝宝：直して「できた！」にしたら、たからもの演出（ごほうび＝コイン）
  const [treasure, setTreasure] = useState(null); // { reward }
  function fixMistake(id) {
    const reward = onRemove(id); // App.removeNote が報酬コインを返す
    setTreasure({ reward: reward || 0 });
    setTimeout(() => setTreasure(null), 1400);
  }
  // 間違いを単元ごとにまとめる（単元が分からないものは「その他」へ）
  const groups = {};
  for (const m of mistakes) {
    const key = m.unitId || "_other";
    (groups[key] ||= []).push(m);
  }
  const keys = Object.keys(groups);

  return (
    <div className="app">
      {/* ★4 たからもの演出（ミスを直したら出る） */}
      {treasure && (
        <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 80, pointerEvents: "none" }}>
          <div className="glass" style={{ padding: "20px 26px", textAlign: "center", animation: "pop .3s ease" }}>
            <div style={{ fontSize: 52 }}>🎁</div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#fde047" }}>たからもの GET！</div>
            <div style={{ fontSize: 13, color: "#fff", marginTop: 4 }}>まちがいを直せたね！ 💰+{treasure.reward}</div>
          </div>
        </div>
      )}
      <Header player={player} back="ホーム" onBack={onBack} />
      <div className="content">
        <div className="pg-ttl">📖 学び直しモード</div>
        <div className="pg-sub">まちがいは<b style={{ color: "#fde047" }}>たからもの</b>。直すと一番えらい！（1問 +15XP・15問ごとに💎+1・直すと💰+5）</div>

        {mistakes.length === 0 ? (
          <div className="glass">
            <div className="empty">
              <div className="empty-icon">🎉</div>
              <p>いまは学び直す問題がありません！<br />タイムアタックやバトルでつまずくと、ここに集まります。</p>
            </div>
          </div>
        ) : (
          keys.map((key) => {
            const unit = key === "_other" ? null : findUnitById(key);
            const chap = key === "_other" ? null : findChapterByUnitId(key);
            const vurl = unit ? videoUrlFor(key) : null;
            const color = chap?.color || "#94a3b8";
            const list = groups[key];
            return (
              <div key={key} className="glass" style={{ padding: "12px 13px", marginBottom: 12, borderLeft: `4px solid ${color}` }}>
                {/* 単元ヘッダー */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 15 }}>{unit?.emoji || "📝"}</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color }}>
                    {unit ? unit.name : "その他の問題"}
                  </span>
                  {chap && (
                    <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,.5)" }}>
                      {GRADE_LABEL[chap.grade] || ""} ・ {chap.name}
                    </span>
                  )}
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,.5)" }}>{list.length}問</span>
                </div>

                {/* アクション：学び直し ＋ 解説動画 */}
                <div style={{ display: "flex", gap: 7, margin: "9px 0 4px" }}>
                  {unit && onRelearn && (
                    <button data-sfx="none" onClick={() => onRelearn(unit)}
                      style={{ flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer",
                        fontSize: 13, fontWeight: 900, color: "#fff", background: "linear-gradient(135deg,#0ea5e9,#6366f1)" }}>
                      ✏️ この単元を学び直す
                    </button>
                  )}
                  {unit && onHaichi && hasHaichiLessonForUnit(key) ? (
                    <button data-sfx="none" onClick={() => onHaichi(unit)} title="葉一さんの動画＋プリントに書き込み"
                      style={{ flexShrink: 0, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                        fontSize: 12.5, fontWeight: 800, color: "#fca5a5",
                        border: "1px solid rgba(239,68,68,.4)", background: "rgba(239,68,68,.12)" }}>
                      📺 動画＋プリント
                    </button>
                  ) : vurl ? (
                    <button data-sfx="none" onClick={() => window.open(vurl, "_blank", "noopener")} title="19chの解説動画"
                      style={{ flexShrink: 0, padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                        fontSize: 13, fontWeight: 800, color: "#fca5a5",
                        border: "1px solid rgba(239,68,68,.4)", background: "rgba(239,68,68,.12)" }}>
                      📺 解説
                    </button>
                  ) : null}
                </div>

                {/* 間違えた問題たち */}
                {list.map((m) => (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderTop: "1px solid rgba(255,255,255,.08)" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", wordBreak: "break-word" }}><MathText>{m.q}</MathText></div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,.55)" }}>正解: <strong style={{ color: "#4ade80" }}><MathText>{m.ans}</MathText></strong></div>
                    </div>
                    <button data-sfx="none" onClick={() => fixMistake(m.id)} title="直せた！この問題を一覧から消す"
                      style={{ flexShrink: 0, width: 76, padding: "6px 6px", borderRadius: 8, cursor: "pointer", fontSize: 11, fontWeight: 800, lineHeight: 1.3,
                        color: "#86efac", border: "1px solid rgba(74,222,128,.4)", background: "rgba(74,222,128,.12)" }}>
                      ✓ できる<br />ようになった
                    </button>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
