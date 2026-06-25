// ============================================================
// Home.jsx — ホーム。王道サイクルを主役にした4タブ構成（§10 Step2）。
//   tab: "adventure"=ぼうけん(本線：つづき＝StepUp＋サイクルマップ＋講義/演習/応用の道具)
//        "reward"=ごほうび(バトル/アイテム/スキル/図鑑/なかま/周回)
//        "record"=きろく(学び直し＋学習の記録)
//        "settings"=せってい(遊び方/キャラ設定/学年)
//   ・入口の「ゲーム vs 学習」二択フォークは廃止（飲まれの主犯）。毎回「ぼうけん」から始まる。
// ============================================================
import { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import { goldenActive, goldenRemainMs, goldenEndedToday, todayEvent } from "../engine/daily.js";
import CharBubble, { voice } from "../components/CharBubble.jsx";
import { MathBackdrop } from "../components/Decorations.jsx";
import Dashboard from "../components/Dashboard.jsx";
import UnderstandingMap from "../components/UnderstandingMap.jsx";
import UnitCycle from "../components/UnitCycle.jsx";
import { findItem } from "../engine/items.js";
import { gradesWithChapters } from "../data/index.js";

const itemName = (id) => findItem(id)?.name ?? "";
const GRADE_LABEL = { 1: "中1", 2: "中2", 3: "中3" };
const GRADE_COLOR = { 1: "#818cf8", 2: "#f43f5e", 3: "#fbbf24" }; // 中1=藍 中2=赤 中3=黄
const MAIN_COLOR = "#6366f1"; // 本線（ぼうけん）のテーマ色
const TABS = [
  { key: "adventure", icon: "🧭", label: "ぼうけん" },
  { key: "reward", icon: "🎁", label: "ごほうび" },
  { key: "record", icon: "📊", label: "きろく" },
  { key: "settings", icon: "🎨", label: "せってい" },
];

// 王道サイクルの進捗マップ（①講義→②演習→③学び直し→④応用→⑤クリア）
function CycleMap({ cycle }) {
  const c = cycle || {};
  const target = c.target || 6;
  const steps = [
    { label: "講義", icon: "📺", done: !!c.lecture },
    { label: "演習", icon: "✏️", done: (c.practiceN || 0) >= target, sub: `${Math.min(c.practiceN || 0, target)}/${target}` },
    { label: "学び直し", icon: "📖", done: (c.relearnN || 0) > 0 },
    { label: "応用", icon: "🧮", done: (c.appliedN || 0) > 0 },
    { label: "クリア", icon: "🏆", done: !!c.done },
  ];
  const curIdx = c.done ? 4 : steps.findIndex((s) => !s.done);
  return (
    <div style={{ background: "rgba(99,102,241,.10)", border: "1px solid rgba(99,102,241,.35)", borderRadius: 14, padding: "11px 8px 9px", marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, fontWeight: 800, color: "#a5b4fc", marginBottom: 9, textAlign: "center" }}>
        いまの単元：{c.unitName || "今の単元"}（一周クリアで大ごほうび🎁）
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        {steps.map((s, i) => {
          const cur = i === curIdx;
          return (
            <div key={s.label} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                width: 30, height: 30, margin: "0 auto", borderRadius: "50%",
                background: s.done ? MAIN_COLOR : "rgba(255,255,255,.05)",
                border: s.done ? `2px solid ${MAIN_COLOR}` : cur ? "2px solid #818cf8" : "1px solid rgba(255,255,255,.13)",
                color: s.done ? "#fff" : cur ? "#c7d2fe" : "rgba(255,255,255,.4)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
              }}>{s.done ? "✓" : s.icon}</div>
              <div style={{ fontSize: 10, fontWeight: cur ? 900 : 700, color: s.done ? "#c7d2fe" : cur ? "#c7d2fe" : "rgba(255,255,255,.4)", marginTop: 3, lineHeight: 1.2 }}>{s.label}</div>
              {s.sub && <div style={{ fontSize: 9.5, color: "rgba(255,255,255,.45)" }}>{s.sub}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home({
  player, records, mistakeCount, grade = 1, onSetGrade,
  mode = "adventure", onSetMode, cycle = {}, restActive = false,
  canPrestige = false, prestige = 0, onPrestige,
  onAnshin, onTimeAttack, onChallenge, onBattle, onRelearn, onDialogue, onHaichi, onUnitHaichi, onUnitPractice, onUnitBattle,
  onClinic, onUnitTest, onStepUp, onStartGolden, onShop, onSkill, onCollection, onPartners,
  onDetail, onHowTo, onCharacter,
}) {
  const availGrades = gradesWithChapters();
  const [msg] = useState(() => voice("open"));
  const greeting = player.name ? `${player.name}、${msg}` : msg;
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [cycleOpen, setCycleOpen] = useState(false);
  useEffect(() => { const id = setInterval(() => setNowMs(Date.now()), 20000); return () => clearInterval(id); }, []);
  const today = new Date().toLocaleDateString("ja-JP");
  const gActive = goldenActive(player, nowMs, today);
  const gMin = Math.max(1, Math.min(15, Math.ceil(goldenRemainMs(player, nowMs, today) / 60000)));
  const gEnded = goldenEndedToday(player, nowMs, today);
  const gStartedToday = player.golden?.date === today;
  const ev = todayEvent();

  // 旧データ（"hub"/"game"/"learn"）が来ても本線(ぼうけん)に寄せる
  const tab = TABS.some((t) => t.key === mode) ? mode : "adventure";

  // サイクルの道具カード（はいち/あんしん等で共通利用）
  const tool = (onClick, icon, title, sub, bg) => (
    <button className="mode-card" style={bg ? { background: bg } : undefined} onClick={onClick}>
      <span style={{ fontSize: 34 }}>{icon}</span>
      <span style={{ fontSize: 14.5, fontWeight: 900 }}>{title}</span>
      {sub && <span style={{ fontSize: 10.5, opacity: 0.82, lineHeight: 1.45 }}>{sub}</span>}
    </button>
  );
  const sectionLabel = (text) => (
    <div style={{ fontSize: 11.5, fontWeight: 800, color: "rgba(255,255,255,.55)", margin: "6px 2px 8px" }}>{text}</div>
  );

  return (
    <div className="app">
      <MathBackdrop />
      <Header player={player} />
      <div className="content" style={{ position: "relative", zIndex: 1 }}>
        {/* あいさつ吹き出し（ゴールデンタイム・曜日イベントは削除） */}
        <CharBubble text={greeting} avatar={player.avatar} onAvatar={onCharacter} />

        {/* 休憩（日次逓減）バナー：やりすぎても旨くない＝そっと止める（§10 Step3） */}
        {restActive && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 11px", padding: "10px 13px", borderRadius: 12,
            background: "rgba(34,197,94,.12)", border: "1.5px solid rgba(34,197,94,.5)" }}>
            <span style={{ fontSize: 24 }}>🌙</span>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#86efac", lineHeight: 1.45 }}>
              今日はよく伸びたね！<span style={{ fontWeight: 700, color: "rgba(255,255,255,.7)" }}>脳は休むと覚えるよ。続けてもOKだけど、また明日やると定着しやすい。</span>
            </div>
          </div>
        )}

        {/* ===== タブバー（二択フォークの代わり） ===== */}
        <div style={{ display: "flex", gap: 6, margin: "2px 0 14px" }}>
          {TABS.map((t) => {
            const on = tab === t.key;
            return (
              <button key={t.key} data-sfx="none" onClick={() => onSetMode?.(t.key)} style={{
                flex: 1, padding: "9px 4px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                border: on ? "2px solid #818cf8" : "1px solid rgba(255,255,255,.14)",
                background: on ? "rgba(99,102,241,.22)" : "rgba(255,255,255,.05)",
                color: on ? "#fff" : "rgba(255,255,255,.6)", position: "relative",
              }}>
                <span style={{ fontSize: 20, display: "block", lineHeight: 1.1 }}>{t.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 900 }}>{t.label}</span>
                {t.key === "record" && mistakeCount > 0 && (
                  <span className="nb-badge" style={{ position: "absolute", top: 2, right: 6 }}>{mistakeCount}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* ===== ① ぼうけん（本線サイクル） ===== */}
        {tab === "adventure" && (
          <>
            {/* 学習サイクル（今回の目玉）＝押すと単元ごとのサイクルが開く。大きく光らせて最も目立たせる */}
            <button data-sfx="none" onClick={() => setCycleOpen((v) => !v)} style={{
              position: "relative", overflow: "hidden",
              width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
              margin: cycleOpen ? "2px 0 12px" : "4px 0 16px", padding: "16px 14px", borderRadius: 18, cursor: "pointer",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)",
              border: "2px solid rgba(255,255,255,.32)", color: "#fff",
              boxShadow: "0 10px 30px rgba(99,102,241,.5)",
              animation: cycleOpen ? "none" : "ctaPulse 2.2s ease-in-out infinite",
            }}>
              {/* 光のスイープ（閉じている時だけ流す） */}
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
              <UnitCycle grade={grade} cycleMap={player.cycle || {}} haichiPassed={player.haichiPassed || {}} calcKing={player.calcKing || {}} onHaichi={onUnitHaichi} onPractice={onUnitPractice} onBattle={onUnitBattle} onRelearn={onRelearn} onChallenge={onChallenge} />
            )}

            {/* 王道サイクルの順に並べる：①講義 →②演習(れんしゅう/バトル) →③学び直し →④応用 */}
            {/* ① 講義 */}
            {sectionLabel("① まなぶ（講義）")}
            <button data-sfx="none" onClick={onHaichi} style={{
              width: "100%", marginBottom: 14, padding: "14px 16px", borderRadius: 16, cursor: "pointer", textAlign: "left",
              border: "2px solid rgba(255,255,255,.22)", color: "#fff", background: "linear-gradient(135deg,#ef4444,#f59e0b)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 34, lineHeight: 1 }}>📺</span>
              <span>
                <span style={{ fontSize: 16, fontWeight: 900, display: "block" }}>はいちモード</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, opacity: .9 }}>葉一さんの授業 → 確認問題(5問)でOK</span>
              </span>
            </button>

            {/* ② 演習：れんしゅう / バトル（えらべる・2列） */}
            {sectionLabel("② ためす（えらべる）")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <button data-sfx="none" onClick={onAnshin} style={{
                padding: "14px 12px", borderRadius: 16, cursor: "pointer", textAlign: "left",
                border: "2px solid rgba(255,255,255,.22)", color: "#fff", background: "linear-gradient(135deg,#22c55e,#10b981)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 34, lineHeight: 1 }}>✏️</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 900, display: "block" }}>れんしゅう</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, opacity: .9, display: "block", lineHeight: 1.35 }}>時間きにせず・安心</span>
                </span>
              </button>
              <button data-sfx="none" onClick={onBattle} style={{
                padding: "14px 12px", borderRadius: 16, cursor: "pointer", textAlign: "left",
                border: "2px solid rgba(255,255,255,.22)", color: "#fff", background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 34, lineHeight: 1 }}>⚔️</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 900, display: "block" }}>バトル</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, opacity: .9, display: "block", lineHeight: 1.35 }}>時間制限で集中！</span>
                </span>
              </button>
            </div>

            {/* ③ 学び直し（間違いがある時。100%なら応用へ促す） */}
            {sectionLabel("③ なおす（学び直し）")}
            <button data-sfx="none" onClick={onRelearn} style={{
              width: "100%", marginBottom: 14, padding: "14px 16px", borderRadius: 16, cursor: "pointer", textAlign: "left", position: "relative",
              border: "2px solid rgba(255,255,255,.22)", color: "#fff", background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex", alignItems: "center", gap: 12, opacity: mistakeCount > 0 ? 1 : 0.6,
            }}>
              {mistakeCount > 0 && <span className="nb-badge" style={{ position: "absolute", top: 8, right: 10 }}>{mistakeCount}</span>}
              <span style={{ fontSize: 34, lineHeight: 1 }}>📖</span>
              <span>
                <span style={{ fontSize: 16, fontWeight: 900, display: "block" }}>学び直し</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, opacity: .9 }}>{mistakeCount > 0 ? "間違いを直して🟩に戻そう" : "間違いゼロ！直す所なし → 応用へ"}</span>
              </span>
            </button>

            {/* ④ 応用 */}
            {sectionLabel("④ ためす・上（応用）")}
            <button data-sfx="none" onClick={onChallenge} style={{
              width: "100%", padding: "14px 16px", borderRadius: 16, cursor: "pointer", textAlign: "left",
              border: mistakeCount === 0 ? "2px solid rgba(251,191,36,.7)" : "2px solid rgba(255,255,255,.22)", color: "#fff",
              background: "linear-gradient(135deg,#8b5cf6,#6366f1)", display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 34, lineHeight: 1 }}>🧮</span>
              <span>
                <span style={{ fontSize: 16, fontWeight: 900, display: "block" }}>応用問題にチャレンジ</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, opacity: .9 }}>{mistakeCount === 0 ? "全部できた！上をめざそう✨" : "もっと上へ。挑戦してみる？"}</span>
              </span>
            </button>
          </>
        )}

        {/* ===== ② ごほうび（収集・育成・バトル＝寄り道） ===== */}
        {tab === "reward" && (
          <>
            {canPrestige && onPrestige && (
              <button onClick={onPrestige} data-sfx="none" style={{
                width: "100%", margin: "0 0 11px", padding: "12px 14px", borderRadius: 14, cursor: "pointer", textAlign: "left",
                background: "linear-gradient(135deg,#f59e0b,#fbbf24)", color: "#3a2a00", border: "2px solid rgba(255,255,255,.35)",
                display: "flex", alignItems: "center", gap: 12, boxShadow: "0 5px 16px rgba(245,158,11,.4)",
              }}>
                <span style={{ fontSize: 32, lineHeight: 1 }}>👑</span>
                <span>
                  <span style={{ fontSize: 15.5, fontWeight: 900, display: "block" }}>中{[1, 2, 3].includes(grade) ? grade : 1}の魔王を撃破！もう一周する{prestige > 0 ? `（${prestige}周クリア）` : ""}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 800, opacity: .85 }}>強さ・装備・仲間はそのまま／お金とクリスタルがまた稼げる！</span>
                </span>
              </button>
            )}
            <div className="mode-grid">
              {tool(onBattle, "⚔️", "バトルモード", "モンスターと対戦！", "linear-gradient(135deg,#ef4444,#b91c1c)")}
              {tool(onShop, "🎒", "アイテム", `どうぐ・そうび 💰${player.coins ?? 0}${player.item ? ` ／🎒${itemName(player.item)}` : ""}`)}
              {tool(onSkill, "✨", "スキル", "バトルで使うスキル")}
              {onCollection && tool(onCollection, "📖", "モンスター図鑑", "倒したモンスターを集める", "linear-gradient(135deg,#0ea5e9,#22d3ee)")}
              {onPartners && tool(onPartners, "🐾", "なかま", "仲間を編成・育成", "linear-gradient(135deg,#f59e0b,#f472b6)")}
            </div>
          </>
        )}

        {/* ===== ③ きろく（学び直し＋学習の記録） ===== */}
        {tab === "record" && (
          <>
            <UnderstandingMap player={player} grade={grade} onRelearn={onRelearn} />
            <button className="nb-btn" onClick={onRelearn} style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", position: "relative", marginBottom: 10 }}>
              📖 学び直し（間違えた問題を動画と練習で克服）
              {mistakeCount > 0 && <span className="nb-badge" style={{ position: "absolute", top: 8, right: 10 }}>{mistakeCount}</span>}
            </button>
            <Dashboard player={player} records={records || []} onDetail={onDetail} grade={grade} />
          </>
        )}

        {/* ===== ④ せってい（遊び方・キャラ・学年） ===== */}
        {tab === "settings" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button className="title-link" style={{ flex: 1 }} onClick={onHowTo}>📖 遊び方</button>
              <button className="title-link" style={{ flex: 1 }} onClick={onCharacter}>🎨 キャラ設定</button>
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "rgba(255,255,255,.55)", margin: "6px 2px 8px" }}>学年をえらぶ</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {[1, 2, 3].map((g) => {
                const ready = availGrades.includes(g);
                const sel = grade === g;
                const c = GRADE_COLOR[g];
                return (
                  <button key={g} onClick={() => ready && onSetGrade?.(g)} disabled={!ready}
                    style={{
                      flex: 1, padding: "12px 4px", borderRadius: 10, cursor: ready ? "pointer" : "not-allowed", fontSize: 15, fontWeight: 900,
                      border: sel ? `2px solid ${c}` : `1px solid ${c}66`, background: sel ? `${c}3a` : `${c}14`,
                      color: ready ? (sel ? "#fff" : c) : "rgba(255,255,255,.35)", boxShadow: sel ? `0 0 12px ${c}66` : "none",
                    }}>
                    {GRADE_LABEL[g]}{!ready && <span style={{ fontSize: 8, display: "block", fontWeight: 700 }}>準備中</span>}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
