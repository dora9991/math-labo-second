// ============================================================
// Home.jsx — ホーム。学習サイクルだけを主役にしたスッキリ構成。
//   ・最上部に「遊び方」、その下に学年えらび（中1/中2/中3の大きな3列ボタン）。
//   ・「学習サイクル」CTA → 単元ごとのサイクル（講義→ためす→なおす→応用）。
//   ・他モード/ごほうび/タブは動線オフ（画面は残すが、すべて学習サイクルから入る）。
// ============================================================
import { useState } from "react";
import Header from "../components/Header.jsx";
import CharBubble, { voice } from "../components/CharBubble.jsx";
import { MathBackdrop } from "../components/Decorations.jsx";
import UnitCycle from "../components/UnitCycle.jsx";
import { gradesWithChapters } from "../data/index.js";

const GRADE_COLOR = { 1: "#818cf8", 2: "#f43f5e", 3: "#fbbf24" }; // 中1=藍 中2=赤 中3=黄

export default function Home({
  player, records, mistakeUnitIds = [], grade = 1, onSetGrade, restActive = false,
  onChallenge, onRelearn, onUnitHaichi, onUnitPractice, onUnitBattle, onDiagnose,
  onDetail, onCharacter, onTeacherMode,
}) {
  const availGrades = gradesWithChapters();
  const [msg] = useState(() => voice("open"));
  const greeting = player.name ? `${player.name}、${msg}` : msg;
  const [cycleOpen, setCycleOpen] = useState(true);

  return (
    <div className="app">
      <MathBackdrop />
      <Header player={player} />
      <div className="content" style={{ position: "relative", zIndex: 1 }}>
        {/* 学年えらび（中1・中2・中3を3列・大きく・携帯でも押しやすく） */}
        <div style={{ display: "flex", gap: 8, margin: "0 0 12px" }}>
          {[1, 2, 3].map((g) => {
            const ready = availGrades.includes(g);
            const sel = (grade || 1) === g;
            const c = GRADE_COLOR[g];
            return (
              <button key={g} data-sfx="none" disabled={!ready} onClick={() => ready && onSetGrade(g)} style={{
                flex: 1, padding: "12px 4px", borderRadius: 13, cursor: ready ? "pointer" : "not-allowed", fontFamily: "inherit",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                border: sel ? `2.5px solid ${c}` : "1.5px solid rgba(255,255,255,.14)",
                background: sel ? `${c}26` : "rgba(255,255,255,.05)",
                color: ready ? (sel ? "#fff" : "rgba(255,255,255,.7)") : "rgba(255,255,255,.3)",
              }}>
                <span style={{ fontSize: 18, fontWeight: 900 }}>中{g}</span>
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.85 }}>{ready ? `中学${g}年` : "準備中"}</span>
              </button>
            );
          })}
        </div>

        {/* 遊び方（いちばん上に常設） */}
        <div style={{ margin: "0 0 12px", padding: "11px 13px", borderRadius: 12, background: "rgba(56,189,248,.10)", border: "1px solid rgba(56,189,248,.32)" }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#7dd3fc", marginBottom: 4 }}>📖 遊び方</div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,.82)", lineHeight: 1.6 }}>
            下の<b style={{ color: "#c4b5fd" }}>「学習サイクル」</b>から単元をえらんで、<b>①講義</b>（動画＋確認問題）→ <b>②ためす</b>（れんしゅう/バトル）→ <b>③なおす</b>（まちがい直し）→ <b>④応用</b> の順に進もう。サイクルをクリアすると<b style={{ color: "#fde047" }}>レベルアップ</b>！
          </div>
        </div>

        {/* あいさつ吹き出し（アバターを押すとキャラ設定へ） */}
        <CharBubble text={greeting} avatar={player.avatar} onAvatar={onCharacter} />

        {/* 休憩（日次逓減）バナー */}
        {restActive && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 11px", padding: "10px 13px", borderRadius: 12,
            background: "rgba(34,197,94,.12)", border: "1.5px solid rgba(34,197,94,.5)" }}>
            <span style={{ fontSize: 24 }}>🌙</span>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#86efac", lineHeight: 1.45 }}>
              今日はよく伸びたね！<span style={{ fontWeight: 700, color: "rgba(255,255,255,.7)" }}>脳は休むと覚えるよ。続けてもOKだけど、また明日やると定着しやすい。</span>
            </div>
          </div>
        )}

        {/* ===== 学習サイクル（唯一の主役・目玉CTA） ===== */}
        <button data-sfx="none" onClick={() => setCycleOpen((v) => !v)} style={{
          position: "relative", overflow: "hidden",
          width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
          margin: cycleOpen ? "2px 0 12px" : "4px 0 16px", padding: "16px 14px", borderRadius: 18, cursor: "pointer",
          background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)",
          border: "2px solid rgba(255,255,255,.32)", color: "#fff",
          boxShadow: "0 10px 30px rgba(99,102,241,.5)",
          animation: cycleOpen ? "none" : "ctaPulse 2.2s ease-in-out infinite",
        }}>
          {!cycleOpen && <span style={{ position: "absolute", top: 0, bottom: 0, width: "45%", background: "linear-gradient(100deg,transparent,rgba(255,255,255,.28),transparent)", animation: "ctaShine 3.2s ease-in-out infinite", pointerEvents: "none" }} />}
          <span style={{ display: "flex", alignItems: "center", gap: 9, position: "relative", zIndex: 1 }}>
            <span style={{ fontSize: 27, lineHeight: 1 }}>📚</span>
            <span style={{ fontSize: 19, fontWeight: 900, letterSpacing: 1 }}>学習サイクル</span>
            <span style={{ fontSize: 10, fontWeight: 900, background: "#fde047", color: "#3a2a00", borderRadius: 999, padding: "2px 8px" }}>まずはここ！</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", justifyContent: "center", fontSize: 12.5, fontWeight: 800, opacity: .96, position: "relative", zIndex: 1 }}>
            <span>講義</span><span style={{ opacity: .6 }}>→</span>
            <span>ためす</span><span style={{ opacity: .6 }}>→</span>
            <span>なおす</span><span style={{ opacity: .6 }}>→</span>
            <span style={{ opacity: .85 }}>（応用）</span>
            <span style={{ marginLeft: 4, fontWeight: 900 }}>{cycleOpen ? "▲ とじる" : "▼ ひらく"}</span>
          </span>
        </button>
        {cycleOpen && (
          <UnitCycle grade={grade} cycleMap={player.cycle || {}} haichiPassed={player.haichiPassed || {}} calcKing={player.calcKing || {}} mistakeUnitIds={mistakeUnitIds} onHaichi={onUnitHaichi} onPractice={onUnitPractice} onBattle={onUnitBattle} onRelearn={onRelearn} onChallenge={onChallenge} onDiagnose={onDiagnose} />
        )}

        {/* 教師モード（黒板で先生の説明を聞く。学習サイクルとは独立の入口） */}
        {onTeacherMode && (
          <button data-sfx="none" onClick={onTeacherMode} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            margin: "0 0 8px", padding: "12px 14px", borderRadius: 13, cursor: "pointer", fontFamily: "inherit",
            border: "1.5px solid rgba(167,139,250,.4)", background: "rgba(167,139,250,.10)", color: "#fff",
          }}>
            <span style={{ fontSize: 22 }}>🧑‍🏫</span>
            <span style={{ flex: 1, textAlign: "left" }}>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 900 }}>先生の説明を聞く</span>
              <span style={{ display: "block", fontSize: 10.5, fontWeight: 700, opacity: .65 }}>黒板とお話で1問ずつ、ゆっくり教えてもらおう</span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
