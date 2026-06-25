// ============================================================
// UnitCycle.jsx — 単元ごとの学習サイクル（§5の単元別サイクル）
//  「学習サイクル」バーを押すと開く。章をえらぶ → 小単元ごとに
//   [📺講義][✏️ためす][📖なおす][🧮応用] の行が出る。
//   ・ためす を押すと「れんしゅう / バトル」を選べる（その小単元で）。
//   ・講義/れんしゅう はその小単元を直接ひらく。なおす/応用は共通へ。
// ============================================================
import { useState } from "react";
import { chaptersForGrade } from "../data/index.js";
import { findHaichiLessonForUnit } from "../data/haichiCourse.js";

// 講義（確認問題）をクリアしたか：その単元に対応する葉一レッスンの key を引いて
//  haichiPassed（確認問題に合格した動画）に入っているかで判定する。
function lectureCleared(unitId, haichiPassed) {
  const found = findHaichiLessonForUnit(unitId);
  if (!found) return false;
  return !!haichiPassed[`g${found.grade}m${found.lesson.n}`];
}

export default function UnitCycle({ grade = 1, cycleMap = {}, haichiPassed = {}, onHaichi, onPractice, onBattle, onRelearn, onChallenge }) {
  const chapters = chaptersForGrade(grade);
  const [ci, setCi] = useState(0);
  const [tame, setTame] = useState(null); // ためす選択中の unitId
  const ch = chapters[Math.min(ci, Math.max(0, chapters.length - 1))];
  if (!ch) return null;
  const units = ch.units || [];

  // cleared=true の時：黄色線で囲み、ボタン下に「✓クリア！」を出す（どこまで進んだか一目で）。
  const stepBtn = (onClick, label, bg, cleared = false) => (
    <button data-sfx="none" onClick={onClick} style={{
      flex: 1, minWidth: 0, padding: "8px 4px", borderRadius: 9, cursor: "pointer", fontSize: 11, fontWeight: 800,
      color: "#fff", lineHeight: 1.2, background: bg,
      border: cleared ? "2px solid #fde047" : "1px solid rgba(255,255,255,.18)",
      boxShadow: cleared ? "0 0 0 2px rgba(253,224,71,.35)" : undefined,
    }}>
      <span style={{ display: "block" }}>{label}</span>
      {cleared && <span style={{ display: "block", fontSize: 9, fontWeight: 900, color: "#fde047", marginTop: 2 }}>✓クリア！</span>}
    </button>
  );

  return (
    <div style={{ margin: "0 0 14px", padding: "10px 10px 8px", borderRadius: 14, background: "rgba(99,102,241,.08)", border: "1px solid rgba(99,102,241,.28)" }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: "#c7d2fe", marginBottom: 8 }}>単元をえらんで、小単元ごとに 講義→ためす→なおす→応用</div>

      {/* 章えらび */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
        {chapters.map((c, i) => (
          <button key={c.id} data-sfx="none" onClick={() => { setCi(i); setTame(null); }} style={{
            padding: "5px 9px", borderRadius: 9, cursor: "pointer", fontSize: 11, fontWeight: 800,
            border: i === ci ? `2px solid ${c.color}` : "1px solid rgba(255,255,255,.14)",
            background: i === ci ? `${c.color}33` : "rgba(255,255,255,.05)", color: i === ci ? "#fff" : "rgba(255,255,255,.6)",
          }}>{c.emoji} {c.name}</button>
        ))}
      </div>

      {/* 小単元ごとの行 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {units.map((u) => {
          const cyc = cycleMap[u.id] || {};
          const lectureC = lectureCleared(u.id, haichiPassed);     // 講義＝確認問題に合格
          const tameC = (cyc.practiceN || 0) >= 1;                 // ためす＝れんしゅう/バトルで正解
          const naosuC = (cyc.relearnN || 0) >= 1;                 // なおす＝学び直しで正解
          const ouyouC = (cyc.appliedN || 0) >= 1;                 // 応用＝応用問題で正解
          const cleared = !!cyc.cleared;                          // 講義+ためす+なおす＝サイクルクリア（レベル+1済み）
          return (
          <div key={u.id} style={{
            background: cleared ? "rgba(253,224,71,.07)" : "rgba(255,255,255,.04)", borderRadius: 11, padding: "8px 9px",
            border: cleared ? "1px solid rgba(253,224,71,.45)" : "1px solid rgba(255,255,255,.1)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: "#fff", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>
                {u.emoji ? u.emoji + " " : ""}{u.name}
              </span>
              {cleared && <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 900, color: "#1f2937", background: "#fde047", borderRadius: 999, padding: "2px 8px" }}>🎉 サイクルクリア</span>}
            </div>
            {tame === u.id ? (
              <div style={{ display: "flex", gap: 6 }}>
                {stepBtn(() => onPractice?.(ch, u), "✏️ れんしゅう", "linear-gradient(135deg,#22c55e,#10b981)", tameC)}
                {stepBtn(() => onBattle?.(u), "⚔️ バトル", "linear-gradient(135deg,#ef4444,#b91c1c)")}
                {stepBtn(() => setTame(null), "← もどる", "rgba(255,255,255,.12)")}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                {stepBtn(() => onHaichi?.(u), "📺 講義", "rgba(239,68,68,.5)", lectureC)}
                {stepBtn(() => setTame(u.id), "✏️ ためす", "rgba(34,197,94,.5)", tameC)}
                {stepBtn(() => onRelearn?.(), "📖 なおす", "rgba(99,102,241,.5)", naosuC)}
                {stepBtn(() => onChallenge?.(), "🧮 応用", "rgba(139,92,246,.5)", ouyouC)}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
