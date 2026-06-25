// Header.jsx — 画面上部の共通ヘッダー（学年セレクタ・コイン・連続日数・レベル＝サイクルクリア数 or 戻るボタン）
import { levelColor, playerLevel, clearedCyclesInWorld } from "../engine/scoring.js";
import { chaptersForGrade } from "../data/index.js";

const GRADE_COLOR = { 1: "#818cf8", 2: "#f43f5e", 3: "#fbbf24" }; // 中1=藍 中2=赤 中3=黄

export default function Header({ player, back, onBack, grade, availGrades, onSetGrade }) {
  const lv = playerLevel(player);   // 現在ワールドのレベル＝1＋クリア単元数
  const col = levelColor(lv);
  // バーは「この学年で何単元のサイクルをクリアしたか」を表す
  const cleared = clearedCyclesInWorld(player);
  const total = chaptersForGrade(player?.world || 1).reduce((s, c) => s + (c.units?.length || 0), 0);
  const pct = total > 0 ? Math.min(100, (cleared / total) * 100) : 0;
  const showGrade = !back && typeof onSetGrade === "function" && Array.isArray(availGrades);
  return (
    <div className="hdr">
      <span className="logo">📐 数学ラボ2</span>
      <div className="hdr-r">
        {back ? (
          <button className="back-btn" onClick={onBack}>← {back}</button>
        ) : (
          <>
            {showGrade && (
              <div style={{ display: "flex", gap: 3, marginRight: 2 }}>
                {[1, 2, 3].map((g) => {
                  const ready = availGrades.includes(g);
                  const sel = (grade || 1) === g;
                  const c = GRADE_COLOR[g];
                  return (
                    <button key={g} data-sfx="none" disabled={!ready} onClick={() => ready && onSetGrade(g)} title={`中学${g}年`}
                      style={{
                        padding: "3px 6px", borderRadius: 7, fontSize: 10, fontWeight: 900, lineHeight: 1,
                        cursor: ready ? "pointer" : "not-allowed", fontFamily: "inherit",
                        border: sel ? `1.5px solid ${c}` : "1px solid rgba(255,255,255,.15)",
                        background: sel ? `${c}33` : "rgba(255,255,255,.05)",
                        color: ready ? (sel ? "#fff" : c) : "rgba(255,255,255,.3)",
                      }}>中{g}</button>
                  );
                })}
              </div>
            )}
            <div className="chip cc">💰{player.coins ?? 0}</div>
            <div className="chip cs">🔥{player.streaks}日</div>
            <div className="chip cl">
              <span style={{ fontSize: 11, fontWeight: 700, color: col }}>Lv.{lv}</span>
              <div className="xpm"><div className="xpf" style={{ width: pct + "%", background: col }} /></div>
              <span className="xpt">{cleared}/{total}単元</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
