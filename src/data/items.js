// ============================================================
// items.js — 新アイテムシステム（2026-07-19復活・ガチャ方式）
//  旧 engine/items.js（ショップで購入・1個だけ所持）とは別物・共存させる。
//  ガチャで手に入れ、最大10個までストック（合計）、バトルには最大2種類まで持ち込める。
//  設計: Obsidian「設計_単元別戦闘力とHP1000化_2026-07-18」
// ============================================================

export const ITEM_STOCK_MAX = 10;    // ストック上限（全種類合計の個数）
export const ITEM_BRING_MAX = 2;     // バトルに持ち込める種類数
export const ITEM_GACHA_COST = 30;   // 1回のガチャ費用（💰コイン）

export const ITEMS = [
  { id: "heal_s",      name: "回復薬",         icon: "🧪", kind: "heal",       power: 300, weight: 0.22, color: "#4ade80", desc: "HPを300回復する" },
  { id: "heal_l",      name: "上級回復薬",     icon: "💊", kind: "heal",       power: 600, weight: 0.12, color: "#22c55e", desc: "HPを600回復する" },
  { id: "sp_s",        name: "気付けの粉",     icon: "✨", kind: "sp",         power: 3,   weight: 0.20, color: "#60a5fa", desc: "SPを3回復する" },
  { id: "sp_l",        name: "魔力の結晶",     icon: "🔮", kind: "sp",         power: 6,   weight: 0.10, color: "#818cf8", desc: "SPを6回復する" },
  { id: "cure_poison", name: "毒消し草",       icon: "🌿", kind: "curePoison",             weight: 0.18, color: "#a3e635", desc: "毒を治す" },
  { id: "cure_status", name: "万能薬",         icon: "💠", kind: "cureStatus",             weight: 0.02, color: "#67e8f9", desc: "眠り・毒・時間妨害・麻痺をすべて治す" },
  { id: "atk_up",      name: "闘志の実",       icon: "🔥", kind: "atkUp",      mult: 1.5, turns: 3, weight: 0.08, color: "#fca5a5", desc: "3ターン 与えるダメージ+50%" },
  { id: "dmg_reduce",  name: "守りのお守り",   icon: "🛡️", kind: "dmgReduce", reduce: 0.4, turns: 3, weight: 0.08, color: "#93c5fd", desc: "3ターン 受けるダメージ-40%" },
];

export function findItem(id) {
  return ITEMS.find((i) => i.id === id) || null;
}

/** アイテムガチャを1回引く → itemId（重み付き抽選） */
export function rollItemGacha(rand = Math.random) {
  const t = rand();
  let acc = 0;
  for (const it of ITEMS) { acc += it.weight; if (t < acc) return it.id; }
  return ITEMS[ITEMS.length - 1].id;
}

/** アイテムの効果を短い一言に（アイテム画面・バトル画面で共通表示） */
export function itemSummary(item) {
  if (!item) return "";
  if (item.kind === "heal") return `HP+${item.power}`;
  if (item.kind === "sp") return `SP+${item.power}`;
  if (item.kind === "curePoison") return "どく治療";
  if (item.kind === "cureStatus") return "状態異常ぜんぶ治療";
  if (item.kind === "atkUp") return `${item.turns}T 与ダメ+${Math.round((item.mult - 1) * 100)}%`;
  if (item.kind === "dmgReduce") return `${item.turns}T 被ダメ-${Math.round(item.reduce * 100)}%`;
  return item.desc || "";
}
