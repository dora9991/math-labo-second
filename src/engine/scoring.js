// ============================================================
// scoring.js — 採点・XP・レベル・星のルール
// 「ゲームのルール」をここに集約。バランス調整はこのファイルだけ触ればよい。
// ============================================================

// ── レベル（Lv1〜99）──────────────────────────────
// 「次のレベルに必要なXX（増分）」を、序盤は増えていき、後半は上限で頭打ちにする。
//  → 累計XPのグラフが √ のような形（後半はゆるやかに直線的）になる。
//  序盤は今まで通り上がりやすく、後半は1レベルぶんの必要XPが一定に。
//
//  次のレベルに必要なXP（増分）= min(INC_A + INC_B*(lv-1), INC_MAX)
//    Lv1→2:150, Lv2→3:170, Lv3→4:190, … と20ずつ増え、1000で頭打ち
export const MAX_LEVEL = 999;
const INC_A = 130;    // Lv1→2の増分が INC_A+INC_B=150 になるよう設定
const INC_B = 20;     // 1レベルごとに増える量
const INC_MAX = 1000; // 増分の上限（1000で頭打ち＝フラットに）

// 起動時に「各レベルに到達する累計XP」のテーブルを作っておく
const XP_TABLE = [0, 0]; // XP_TABLE[1]=0（Lv1は0XP）
for (let lv = 2; lv <= MAX_LEVEL; lv++) {
  XP_TABLE[lv] = XP_TABLE[lv - 1] + Math.min(INC_A + INC_B * (lv - 1), INC_MAX);
}

/** レベル lv に到達するのに必要な累計XP */
export function xpForLevel(lv) {
  return XP_TABLE[Math.max(1, Math.min(MAX_LEVEL, lv))];
}

/** 累計XPから現在レベルを求める（1〜99） */
export function levelFromXp(xp) {
  let lv = 1;
  while (lv < MAX_LEVEL && xp >= XP_TABLE[lv + 1]) lv++;
  return lv;
}

// ── ワールド（学年）別レベル ────────────────────────────────
//  完全ワールド分離: レベル(atk/HP)は学年ごとに独立。現在いるワールド
//  (player.world) の累計XP (player.worldXp[world]) からレベルを算出する。
//  旧データ（worldXp なし）は player.xp を中1ワールドの値として扱う。

/** 現在のワールド（学年）の累計XP */
export function playerXp(player) {
  if (!player) return 0;
  const w = player.world || 1;
  if (player.worldXp && player.worldXp[w] != null) return player.worldXp[w];
  return player.xp || 0; // 旧データ後方互換
}

/** 現在のワールドで「サイクルをクリアした単元の数」（レベルの素）。
 *  worldCleared[world] に App 側がクリア単元数を集計して持たせる。 */
export function clearedCyclesInWorld(player) {
  if (!player) return 0;
  const w = player.world || 1;
  return (player.worldCleared && player.worldCleared[w]) || 0;
}

/** 現在のワールドのレベル＝1＋クリアした単元サイクルの数（XPでは上がらない）。
 *  「学習の完了＝強さ」。上限は単元数で自然に頭打ち。 */
export function playerLevel(player) {
  return 1 + clearedCyclesInWorld(player);
}

/** 次のレベルまでの進捗（0〜100） */
export function levelProgress(xp) {
  const lv = levelFromXp(xp);
  if (lv >= MAX_LEVEL) return 100;
  const lo = xpForLevel(lv);
  const hi = xpForLevel(lv + 1);
  return ((xp - lo) / (hi - lo)) * 100;
}

// レベル帯ごとの称号と色（Lv999まで。高レベルほど豪華な称号）
const LEVEL_TIERS = [
  { min: 500, name: "全知全能", color: "#ffffff" },
  { min: 350, name: "創造主", color: "#fef9c3" },
  { min: 250, name: "超越神", color: "#fde68a" },
  { min: 180, name: "破壊神", color: "#fb923c" },
  { min: 130, name: "覇王", color: "#f43f5e" },
  { min: 100, name: "数学の化身", color: "#e879f9" },
  { min: 99, name: "数学神", color: "#fde047" },
  { min: 80, name: "神話", color: "#dc2626" },
  { min: 60, name: "伝説", color: "#ef4444" },
  { min: 45, name: "英雄", color: "#f97316" },
  { min: 30, name: "勇者", color: "#fbbf24" },
  { min: 20, name: "マスター", color: "#e879f9" },
  { min: 15, name: "エキスパート", color: "#f87171" },
  { min: 10, name: "数学好き", color: "#fb923c" },
  { min: 6, name: "がんばり屋", color: "#4ade80" },
  { min: 3, name: "まなび中", color: "#60a5fa" },
  { min: 1, name: "ビギナー", color: "#94a3b8" },
];

/** レベルから称号を返す */
export function levelTitle(lv) {
  return (LEVEL_TIERS.find((t) => lv >= t.min) || LEVEL_TIERS[LEVEL_TIERS.length - 1]).name;
}

/** レベルから色を返す */
export function levelColor(lv) {
  return (LEVEL_TIERS.find((t) => lv >= t.min) || LEVEL_TIERS[LEVEL_TIERS.length - 1]).color;
}

// 旧コード互換（配列で参照していた箇所が残っていても落ちないように）
export const LEVEL_NAMES = new Proxy({}, { get: (_, k) => levelTitle(Number(k) || 1) });

// ── タイムアタックの星 ────────────────────────────
export const STAR_TARGET = {
  // easy は「速さゲー」になり苦手な子が★0で詰む問題があったため緩和（6/9/12→4/7/10）。
  easy: { s1: 4, s2: 7, s3: 10 },
  standard: { s1: 4, s2: 6, s3: 8 },
  advanced: { s1: 2, s2: 3, s3: 5 },
  oni: { s1: 2, s2: 3, s3: 4 }, // 鬼（発展の上）。問題が重いので少ない正解数で星が付く
};

/** タイムアタックの正解数から星(0〜3)を計算 */
export function calcStars(correct, level) {
  const t = STAR_TARGET[level];
  if (correct >= t.s3) return 3;
  if (correct >= t.s2) return 2;
  if (correct >= t.s1) return 1;
  return 0;
}

// タイムアタックの1問あたり基礎XP
export const XP_PER_CORRECT = 5;
// 間違い1問あたりの減点。連打・あてずっぽうを軽く抑止する程度に。
export const XP_PENALTY_PER_WRONG = 3;

// ── 学び直しの報酬（学習のコア）─────────────────────
// 1問の正解XPは通常じっくり(10)の1.5倍＝15。さらに RELEARN_CRYSTAL_EVERY 問
// 解くごとにクリスタルを+1（コツコツ取り組むほどスキルガチャ資金がたまる）。
export const RELEARN_XP_PER_CORRECT = 15;
export const RELEARN_CRYSTAL_EVERY = 15;

// ── 背骨(StepUp/弱点克服)・学び直しを「報酬のある学習」にする（王道サイクルの要）──
// 設計メモ§8/§10 Step1：背骨と丁寧な学習が“割に合わない”状態を是正。正解ごとに少額コインを付与
//  （グラインドTA=3/正解と同等にして、速さで稼ぐより損しないように）。
export const STEPUP_COIN_PER_CORRECT = 3;   // ステップアップ／じっくり練習の正解コイン
export const RELEARN_COIN_PER_CORRECT = 3;  // 学び直しの正解コイン（XP/クリスタルは従来どおり）

// ── マスターサイクル（王道一周）報酬：設計メモ§8柱2/§10 Step3 ──
// 1単元を背骨(StepUp/じっくり)で解き重ねて“一周”したら一括の大報酬。
// 「速く回す」より「丁寧に一周」がコイン/クリスタル効率で上回るようにする（飲まれ対策）。
export const CYCLE_PRACTICE_TARGET = 15;  // ためすクリアに必要な演習の正解数（≒バトル1体ぶん／あんしん1.5ラウンド）
export const CYCLE_RELEARN_TARGET = 1;    // なおすクリアに必要な学び直しの正解数
export const MASTER_CYCLE_COIN = 120;     // 一周クリアのコイン束（TA1回=約30〜60より厚い）
export const MASTER_CYCLE_CRYSTAL = 1;    // 一周クリアのクリスタル（＝スキル1個ぶん。単元の数だけ集まる）

/**
 * その単元のサイクルが「クリア」か。
 *  講義(確認問題)・ためす・なおす の3ステップが揃ったらクリア。
 *  ・lectureOK … 講義の確認問題に合格（葉一レッスンが無い単元は自動でOK）
 *  ・tameOK    … ためす（れんしゅう/バトル）で目標数の正解
 *  ・naosuOK   … なおす（学び直し）で正解、または直すべき間違いがそもそも無い
 *  応用(appliedN)は別枠＝武器/防具の石の報酬で、クリア判定には含めない。
 */
export function isUnitCycleCleared({ lectureOK = false, practiceN = 0, naosuOK = false } = {}) {
  return !!lectureOK && practiceN >= CYCLE_PRACTICE_TARGET && !!naosuOK;
}

// ── 休憩（日次逓減）：やりすぎても旨くない＝自然に止まる（§8柱5/§10 Step3）──
// 本日の「完了サイクル数」が増えるほど、XP・サイクル報酬を逓減する（強制ロックはしない）。
export const REST_CYCLES_SOFT = 3;  // 本日サイクルこれ以上で報酬↓（×0.5）
export const REST_CYCLES_HARD = 5;  // さらに↓（×0.25）
/** 本日の完了サイクル数から、XP/報酬の倍率（1 → 0.5 → 0.25） */
export function restMultiplier(cyclesToday = 0) {
  if (cyclesToday >= REST_CYCLES_HARD) return 0.25;
  if (cyclesToday >= REST_CYCLES_SOFT) return 0.5;
  return 1;
}

/** タイムアタック1回で稼げるコイン（正解1問=3コイン＋星ボーナス）
 *  アイテム購入の元手。XPと違ってくり返しでも減らさない（コツコツ稼げる）。 */
export function timeAttackCoins({ correct = 0, stars = 0 }) {
  return correct * 3 + stars * 10;
}

// タイムアタックでクリスタルがもらえる最低正答率（連打・あてずっぽう除けの基準）。
export const TA_CRYSTAL_MIN_ACCURACY = 0.6;
// 救済ルートの最低正解数（★1に届かなくても、これだけ正解＋正答率を満たせば+1）。
export const TA_CRYSTAL_MIN_CORRECT = 3;
/** タイムアタック1回でもらえるクリスタル数（0 or 1）。
 *  条件：正答率が TA_CRYSTAL_MIN_ACCURACY 以上 かつ
 *        「★1以上」または「正解 TA_CRYSTAL_MIN_CORRECT 個以上」。
 *  → 苦手で★に届かない子も、ちゃんと正解できていればもらえる救済つき。
 *    連打（低正答率）や1問だけ正解は除外。 */
export function timeAttackCrystal({ correct = 0, wrong = 0, stars = 0 }) {
  const total = correct + wrong;
  const acc = total > 0 ? correct / total : 0;
  if (acc < TA_CRYSTAL_MIN_ACCURACY) return 0;
  return stars >= 1 || correct >= TA_CRYSTAL_MIN_CORRECT ? 1 : 0;
}

/** 連続正解ボーナス：5連続以上の正解は1問ごとに+1、10連続以上は+2 上乗せ。
 *  oks は解いた順の正誤（true/false）の配列。 */
export function timeAttackStreakBonus(oks = []) {
  let run = 0, bonus = 0;
  for (const ok of oks) {
    if (ok) { run++; bonus += run >= 10 ? 2 : run >= 5 ? 1 : 0; }
    else run = 0;
  }
  return bonus;
}

/** タイムアタック1回のXPを計算（間違いは2問分マイナス、0未満にはしない） */
export function timeAttackXp({ correct, wrong = 0, stars, newStars, streakBonus = 0 }) {
  const gained = correct * XP_PER_CORRECT + newStars * 25 + (stars === 3 ? 20 : 0) + streakBonus;
  const penalty = wrong * XP_PENALTY_PER_WRONG;
  return Math.max(0, gained - penalty);
}

// じっくりモードのクリア条件（連続正解数）
export const SLOW_TARGET = { easy: 5, standard: 3, advanced: 2 };

/** じっくりモードのXP（タイムアタックの約1/5。時間制限がないぶん控えめ）
 *  2回目以降の倍率（½など）は xpRepeatMultiplier 側で別途かける。 */
export function slowXp({ streak, correct }) {
  return Math.max(1, Math.round((streak * 12 + correct * 6) / 5));
}

/** 単元テストのXP（1問10XP、満点ボーナス30） */
export function unitTestXp({ correct, total }) {
  return correct * 10 + (total > 0 && correct === total ? 30 : 0);
}

/** 入力文字列を数値に変換（分数 "1/2" や マイナス "-5" に対応） */
export function parseAnswer(s) {
  if (typeof s === "number") return s;
  if (s == null) return NaN;
  let str = String(s).trim().replace(/\s/g, "");
  // 全角マイナス・全角スラッシュも一応許容
  str = str.replace(/ー|−|―/g, "-").replace(/／/g, "/");
  if (str.includes("/")) {
    const [a, b] = str.split("/");
    const n = parseFloat(a), d = parseFloat(b);
    if (d) return n / d;
  }
  return parseFloat(str);
}

/** 答え合わせ（小数誤差を許容。分数・マイナス入力もOK）
 *  正解側(ans)が "5/4" や "-3/2" のような分数文字列でも数値化して比較する。 */
export function isCorrect(userAnswer, ans) {
  const u = parseAnswer(userAnswer);
  const a = typeof ans === "number" ? ans : parseAnswer(ans);
  if (Number.isNaN(u) || Number.isNaN(a)) return false;
  return Math.abs(u - a) < 0.05;
}

// 同じ問題（単元×難易度ごと）をくり返したときのXP倍率
//  初クリアまで : ×1（満点）
//  同じ日にくり返す : ×0.6
//  クリア済みを別の日に再挑戦 : ×1/3
// ※ key は `${unitId}-${level}` なので、かんたん/ふつう/発展は別問題として扱う
// ※「上がりにくい」体感の正体は周回時のこの減衰。あてずっぽう抑止は残しつつ
//   「繰り返してもバーが少し進む」感が出るよう、⅕→⅓・½→0.6 にゆるめている。
export function xpRepeatMultiplier(playLog, key, today) {
  const e = playLog && playLog[key];
  if (!e || !e.cleared) return 1;
  return e.lastDate === today ? 0.6 : 1 / 3;
}
