// ============================================================
// ultimates.js — 必殺技ガチャ（2026-07-19設計）
//  お金（💰コイン）を払ってガチャを回し、必殺技を集める。
//  1発のダメージ倍率はどんなに強くても最大5倍まで（ULT_MULT_CAP）。
//  設計: Obsidian「設計_単元別戦闘力とHP1000化_2026-07-18」
// ============================================================

export const ULT_MULT_CAP = 5;             // 1発ダメージの最大倍率（絶対上限）
export const ULTIMATE_GACHA_COST = 150;    // 1回のガチャ費用（💰コイン）
export const DEFAULT_ULTIMATE_ID = "fire"; // 最初から持っている必殺技（recordSchema.jsの初期値と一致させる）

export const ULTIMATES = [
  { id: "fire",     name: "ファイアバースト",   icon: "🔥", mult: 3, weight: 0.28, color: "#f87171", desc: "紅蓮の一撃（最初から使える）" },
  { id: "aqua",     name: "アクアブラスト",     icon: "💧", mult: 3, weight: 0.28, color: "#60a5fa", desc: "奔流の一撃" },
  { id: "thunder",  name: "サンダーストライク", icon: "⚡", mult: 4, weight: 0.16, color: "#facc15", desc: "雷光の一撃" },
  { id: "meteor",   name: "メテオ",             icon: "☄️", mult: 4, weight: 0.16, color: "#fb923c", desc: "隕石の一撃" },
  { id: "drain",    name: "ドレインタッチ",     icon: "🦇", mult: 3, lifesteal: 0.3, weight: 0.08, color: "#c084fc", desc: "与えたダメージの30%を吸収して自分のHPを回復" },
  { id: "judgment", name: "しんぱん",           icon: "⚖️", mult: 5, weight: 0.02, color: "#f472b6", desc: "最大倍率！ 裁きの一撃" },
  { id: "ultima",   name: "アルティマ",         icon: "🌟", mult: 5, weight: 0.02, color: "#fde047", desc: "最大倍率！ 光り輝く一撃" },
];

export function findUltimate(id) {
  return ULTIMATES.find((u) => u.id === id) || ULTIMATES[0];
}

/** 必殺技ガチャを1回引く → ultimateId（重み付き抽選。poolを渡すとその中だけで抽選＝ダブり無し用） */
export function rollUltimateGacha(pool = ULTIMATES, rand = Math.random) {
  const total = pool.reduce((s, u) => s + u.weight, 0);
  if (total <= 0) return null;
  let t = rand() * total, acc = 0;
  for (const u of pool) { acc += u.weight; if (t < acc) return u.id; }
  return pool[pool.length - 1].id;
}

/** 実際に使う倍率（データ側の値が万一CAPを超えていても安全側にクランプ） */
export function ultimateMult(ult) {
  return Math.min(ULT_MULT_CAP, ult?.mult || 3);
}
