// ============================================================
// SlowMode.jsx — じっくりモード／あんしんモード（時間制限なし）
//  - 4択。正解で光る◯、不正解で横揺れ（タイムアタックと同じ演出）
//  - ヒント（h1→h2）＋「2択にする」(50:50) で3段階の手助け（★6）
//  - 一問ごとにキャラが言葉をかける（CharBubble）
//
//  ★ anshin（あんしんモード）= true のとき：
//    ・失敗なし：まちがえても「できた！の階段」は減らない（★1）
//    ・最初の1問は必ず「かんたん」から（★2）
//    ・正解の累計で階段が進む（連続でなくてOK）→ 必ず達成できる
//    ・やさしい言葉かけ（「おしい！」）
// ============================================================
import { useState, useRef } from "react";
import Header from "../components/Header.jsx";
import CharBubble, { voice } from "../components/CharBubble.jsx";
import { BigWord } from "../components/Decorations.jsx";
import MathText from "../components/MathText.jsx";
import QuestionText from "../components/QuestionText.jsx";
import DrawPad from "../components/DrawPad.jsx";
import * as sfx from "../audio/sfx.js";
import { genProblem, makeChoices } from "../engine/generator.js";
import { isCorrect, SLOW_TARGET, slowXp, xpRepeatMultiplier, CYCLE_PRACTICE_TARGET } from "../engine/scoring.js";
import { initDifficulty, nextDifficulty, PRACTICE_LEVELS } from "../engine/progress.js";

const todayStr = () => new Date().toLocaleDateString("ja-JP");
// れんしゅう（あんしん）の目標＝サイクルの「ためす」達成数に揃える（1ラウンド完走＝ためす完了で混乱を無くす）
const ANSHIN_TARGET = CYCLE_PRACTICE_TARGET;
const LEVEL_LABEL = { easy: "かんたん", standard: "ふつう", advanced: "発展" };

// 4択ヘルパー（タイムアタックと同じ。式の4択＝文字列厳密一致／数値＝makeChoices＋数値照合）
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
const hasChoices = (q) => Array.isArray(q.choices) && q.choices.length > 0;
const choicesFor = (q) => (hasChoices(q) ? shuffle([...q.choices]) : makeChoices(q.ans));
const ansEq = (val, q) => (hasChoices(q) ? String(val).replace(/\s/g, "") === String(q.ans).replace(/\s/g, "") : isCorrect(val, q.ans));

export default function SlowMode({ player, chapter, unit, level, anshin = false, navDifficulty = false, onComplete, onBackToMap, onHome, onRelearn, onBattle, onHaichi }) {
  const target = anshin ? ANSHIN_TARGET : SLOW_TARGET[level];
  // ④ 難易度ナビ：navDifficulty のときは「ふつう」から始め、2ミスで↓／5連正解で↑（progress.js のルール）
  const diffRef = useRef(initDifficulty("standard"));
  const [navLevel, setNavLevel] = useState("standard"); // 表示用の現在レベル
  const [diffToast, setDiffToast] = useState(null);      // 難易度が変わった時のひとこと { up, label }
  // 出題する難易度：nav時は「ふつう」開始／あんしんは「かんたん」開始／じっくりは選んだ level
  const firstLevel = navDifficulty ? "standard" : anshin ? "easy" : level;
  const [q, setQ] = useState(() => genProblem(unit, firstLevel));
  const [choices, setChoices] = useState(() => (q ? choicesFor(q) : []));
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [hintLevel, setHintLevel] = useState(0); // 0:なし 1:h1 2:h2
  const [fifty, setFifty] = useState([]); // 50:50 で消した選択肢のindex
  const [msg, setMsg] = useState(() => voice("open"));
  const [showRing, setShowRing] = useState(false);
  const [shakeAns, setShakeAns] = useState(false);
  const [phase, setPhase] = useState("intro"); // intro | playing | clear
  const [clearInfo, setClearInfo] = useState(null); // {xp, baseXp, mult}
  const [showPad, setShowPad] = useState(false); // ✏️ 手書き計算スペースの開閉
  const wrongsRef = useRef([]); // この回の誤答 {q,ans,unitId,level,ok:false}（学び直しへ送る）

  // あんしんモードでは「できた！の階段」＝正解の累計。それ以外は連続正解。
  const progress = anshin ? correct : streak;

  function nextQuestion() {
    const lv = navDifficulty ? diffRef.current.level : level; // nav時は自動調整された難易度
    const nq = genProblem(unit, lv, q?.id); // 2問目以降は選んだ難易度
    if (nq) { setQ(nq); setChoices(choicesFor(nq)); }
    setSelected(null); setLocked(false); setHintLevel(0); setFifty([]);
  }

  // ④ 1問の正誤から難易度を更新（nav時のみ）。段が変わったら短いひとことを出す。
  function updateNavDifficulty(ok) {
    if (!navDifficulty) return;
    const prev = diffRef.current;
    const nd = nextDifficulty(prev, ok);
    if (nd.changed) {
      const up = PRACTICE_LEVELS.indexOf(nd.level) > PRACTICE_LEVELS.indexOf(prev.level);
      setDiffToast({ up, label: LEVEL_LABEL[nd.level] });
      setTimeout(() => setDiffToast(null), 2200);
    }
    diffRef.current = nd;
    setNavLevel(nd.level);
  }

  // 50:50：まちがいの選択肢を2つ消して2択にする（★6）
  function useFifty() {
    if (!q || locked || fifty.length) return;
    const wrongIdx = choices.map((c, i) => (ansEq(c, q) ? -1 : i)).filter((i) => i >= 0);
    setFifty(shuffle(wrongIdx).slice(0, 2));
  }

  function answer(val, idx) {
    if (!q || locked || phase !== "playing") return;
    setLocked(true); setSelected(idx);
    const ok = ansEq(val, q);
    setTotal((t) => t + 1);
    updateNavDifficulty(ok); // ④ 次の問題の難易度を調整（nav時のみ）

    if (ok) {
      const ns = streak + 1;
      const nc = correct + 1;
      setStreak(ns); setCorrect(nc);
      sfx.correct();
      setShowRing(true); setTimeout(() => setShowRing(false), 700);
      setMsg(ns >= 3 ? voice("streak") : voice("correct"));
      const reached = (anshin ? nc : ns) >= target;
      if (reached) {
        // クリア
        const baseXp = slowXp({ streak: ns, correct: nc });
        const mult = xpRepeatMultiplier(player.playLog, `${unit.id}-${level}`, todayStr());
        const xp = Math.round(baseXp * mult);
        setClearInfo({ xp, baseXp, mult });
        setMsg(voice("clear"));
        setTimeout(() => {
          setPhase("clear");
          // anshin と誤答リストを渡す（学び直しへの登録／あんしんの進行貢献＝easy★1付与に使う）
          onComplete({ chapter, unit, level, streak: ns, total: total + 1, correct: nc, xp, anshin, results: wrongsRef.current });
        }, 700);
      } else {
        setTimeout(nextQuestion, 800);
      }
    } else {
      // 間違えた問題を学び直しへ送るため記録（あんしん／じっくり両方）
      wrongsRef.current.push({ q: q.q, ans: q.ans, unitId: q.unitId, level: q.level, ok: false });
      // ★1 あんしんモードは失敗で階段が減らない（やさしい言葉かけ）
      if (!anshin) setStreak(0);
      sfx.wrong();
      setShakeAns(true); setTimeout(() => setShakeAns(false), 460);
      setMsg(anshin ? "おしい！ 正しい答えは光っているところだよ。次もいってみよう✨" : voice("wrong"));
      setTimeout(nextQuestion, anshin ? 1150 : 950);
    }
  }

  // ---- クリア画面 ----
  if (phase === "clear") {
    return (
      <div className="app">
        <Header player={player} />
        <div className="content">
          <CharBubble text={msg} />
          <div className="res-card">
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 60 }}>{anshin ? "🎉" : "🌟"}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#1e1b4b" }}>
                {anshin ? `クリア！ ${correct}問できたね！` : `クリア！${streak}問連続正解！`}
              </div>
              <div style={{ marginTop: 9 }}>
                <span className="xp-pill">✨ +{clearInfo ? clearInfo.xp : 0} XP</span>
                {clearInfo && clearInfo.mult < 1 && (
                  <div style={{ fontSize: 11, color: "#92400e", fontWeight: 700, marginTop: 5 }}>
                    {clearInfo.mult === 0.5 ? "今日2回目以降のためXP½" : "クリア済みの再挑戦のためXP⅕"}（通常なら{clearInfo.baseXp}XP）
                  </div>
                )}
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-box"><div className="stat-n" style={{ color: "#16a34a" }}>{correct}</div><div className="stat-l">できた数</div></div>
              <div className="stat-box"><div className="stat-n" style={{ color: "#d97706" }}>{streak}</div><div className="stat-l">最高連続</div></div>
              <div className="stat-box"><div className="stat-n" style={{ color: "#94a3b8" }}>{total}</div><div className="stat-l">挑戦</div></div>
            </div>
            {/* つぎのステップ（あんしん→学び直し→バトルの流れを案内） */}
            {(onRelearn || onBattle) && (
              <div style={{ marginTop: 2, marginBottom: 9, textAlign: "center", fontSize: 12.5, fontWeight: 800, color: "#475569", lineHeight: 1.6 }}>
                つぎは…　{onRelearn ? "📖 学び直しで確認" : ""}{onRelearn && onBattle ? " → " : ""}{onBattle ? "⚔️ バトルで実践！" : ""}
              </div>
            )}
            <div className="res-acts">
              {onRelearn && <button className="rbtn s" onClick={onRelearn}>📖 学び直し</button>}
              {onBattle && <button className="rbtn p" onClick={onBattle}>⚔️ バトルで実践！</button>}
              <button className="rbtn s" onClick={onBackToMap}>🗺️ 単元へ</button>
              <button className="rbtn s" onClick={onHome}>🏠 ホーム</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="app">
        <Header player={player} back="戻る" onBack={onBackToMap} />
        <div className="content"><div className="glass">この単元の問題が見つかりませんでした。</div></div>
      </div>
    );
  }

  // ---- プレイ中 ----
  return (
    <div className="app">
      {phase === "intro" && <BigWord text={anshin ? "スタート！" : "START!"} color="#4ade80" onDone={() => setPhase("playing")} />}
      {showRing && <div className="correct-flash show" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 55 }} />}
      <Header player={player} back="やめる" onBack={onBackToMap} />
      <div className="content">
        {/* 進み具合メーター（あんしん＝できた！の階段／じっくり＝連続正解） */}
        <div className="glass" style={{ padding: "11px 13px", marginBottom: 11 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.5)" }}>
              {anshin ? "🪜 できた！の かいだん" : "🌱 連続正解チャレンジ"}
            </span>
            <span style={{ fontFamily: "'M PLUS Rounded 1c',sans-serif", fontSize: 18, fontWeight: 900, color: anshin ? "#4ade80" : "#fbbf24" }}>
              {anshin ? "✨" : "🔥"} {progress}/{target}
            </span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            {Array.from({ length: target }, (_, i) => (
              <div key={i} style={{
                flex: 1, height: 8, borderRadius: 4,
                background: i < progress ? (anshin ? "#4ade80" : "#fbbf24") : "rgba(255,255,255,.12)",
              }} />
            ))}
          </div>
        </div>

        {/* 一問ごとのひとこと */}
        <CharBubble text={msg} />

        {/* ④ 難易度が変わったときのお知らせ（普通⇄かんたん／発展） */}
        {diffToast && (
          <div style={{
            margin: "0 0 10px", padding: "9px 13px", borderRadius: 11, textAlign: "center",
            fontSize: 13, fontWeight: 900, lineHeight: 1.4,
            color: diffToast.up ? "#065f46" : "#7c2d12",
            background: diffToast.up ? "rgba(74,222,128,.9)" : "rgba(251,191,36,.9)",
            border: diffToast.up ? "1.5px solid #16a34a" : "1.5px solid #d97706",
          }}>
            {diffToast.up ? `🔥 いい調子！「${diffToast.label}」に レベルアップ！` : `🌱 むずかしさを「${diffToast.label}」にしたよ`}
          </div>
        )}

        <div className="qcard">
          <span className="q-pill">{unit.name} ・ {navDifficulty ? LEVEL_LABEL[navLevel] : anshin ? "あんしん" : "じっくり"}</span>
          <div className="q-text"><QuestionText text={q.q} furigana={!!player.furigana} readAloud={!!player.readAloud} /></div>

          {/* ヒント（問題に h1 がある＝主に中1の生成問題） */}
          {q.h1 && hintLevel > 0 && (
            <div style={{ background: "#fef9c3", border: "1px solid #fde047", borderRadius: 11, padding: "9px 12px", marginBottom: 11 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#854d0e", lineHeight: 1.6 }}>
                💡 {q.h1}
                {hintLevel >= 2 && q.h2 ? <><br />💡 {q.h2}</> : null}
              </div>
            </div>
          )}

          {/* 3段階の手助け：①ヒント ②もっとヒント ③2択にする(50:50) */}
          {!locked && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 11 }}>
              {q.h1 && hintLevel < 2 && (
                <button
                  className="rbtn s" style={{ fontSize: 12, padding: "7px 13px" }}
                  onClick={() => setHintLevel((h) => h + 1)}
                >💡 {hintLevel === 0 ? "ヒント①" : "もっとヒント②"}</button>
              )}
              {choices.length > 2 && fifty.length === 0 && (
                <button
                  className="rbtn s" style={{ fontSize: 12, padding: "7px 13px" }}
                  onClick={useFifty}
                >🪄 2択にする</button>
              )}
            </div>
          )}

          {/* 選択肢の中央に◯が出るよう relative で包む */}
          <div style={{ position: "relative" }}>
            {showRing && <div className="correct-ring show" />}
            <div className={"choices-grid" + (shakeAns ? " answer-shake" : "")}>
              {choices.map((c, i) => {
                const isAns = ansEq(c, q);
                const hidden = fifty.includes(i); // 50:50 で消した選択肢
                let cls = "choice-btn";
                if (locked) {
                  if (i === selected && !isAns) cls += " wrong";
                  else if (isAns) cls += i === selected ? " correct" : " reveal";
                }
                return (
                  <button
                    key={i} className={cls} data-sfx="none"
                    disabled={locked || hidden}
                    style={hidden ? { opacity: 0.2, filter: "grayscale(1)", pointerEvents: "none" } : undefined}
                    onClick={() => answer(c, i)}
                  ><MathText>{hidden ? "—" : c}</MathText></button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ✏️ 手書き計算スペース（れんしゅう中もメモ書きできる） */}
        <button onClick={() => setShowPad((v) => !v)} data-sfx="none" style={{ width: "100%", marginTop: 12, padding: "11px", borderRadius: 12, border: "1px solid rgba(255,255,255,.18)", cursor: "pointer", fontSize: 14, fontWeight: 800, color: "#fff", background: showPad ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.06)" }}>
          ✏️ 計算スペース{showPad ? "を閉じる" : "を開く"}
        </button>
        {showPad && <DrawPad key={total} height={360} />}
      </div>
    </div>
  );
}
