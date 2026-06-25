// Header.jsx — 画面上部の共通ヘッダー（レベル＝サイクルクリア数・連続日数 or 戻るボタン）
import { levelColor, playerLevel, clearedCyclesInWorld } from "../engine/scoring.js";
import { chaptersForGrade } from "../data/index.js";

export default function Header({ player, back, onBack }) {
  const lv = playerLevel(player);   // 現在ワールドのレベル＝1＋クリア単元数
  const col = levelColor(lv);
  // バーは「この学年で何単元のサイクルをクリアしたか」を表す（XPバーの置き換え）
  const cleared = clearedCyclesInWorld(player);
  const total = chaptersForGrade(player?.world || 1).reduce((s, c) => s + (c.units?.length || 0), 0);
  const pct = total > 0 ? Math.min(100, (cleared / total) * 100) : 0;
  return (
    <div className="hdr">
      <span className="logo">📐 数学ラボ2</span>
      <div className="hdr-r">
        {back ? (
          <button className="back-btn" onClick={onBack}>← {back}</button>
        ) : (
          <>
            <div className="chip cc">💰{player.coins ?? 0}</div>
            <div className="chip cx">💎{player.crystals ?? 0}</div>
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
