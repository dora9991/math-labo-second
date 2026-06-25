// ============================================================
// g2c6 — 中2「確率と統計」（★自動作問版）
//  場合の数は数値(numChoices)、確率は約分した分数(frac)で4択。
// ============================================================
import { frac, exprChoices, numChoices } from "../_algebra.js";

const p = (id, build, skill = null) => ({ id, build, skill });

const H = {
  count: { h1: "並べる(順列)は順番を区別、選ぶ(組合せ)は順番を区別しない", h2: "nから r個を並べる=n×(n−1)×…、選ぶ=それ÷(r×…×1)" },
  prob: { h1: "確率 =（あてはまる場合の数）÷（全部の場合の数）", h2: "最後にかならず約分する。さいころ2個は全部で36通り" },
};
const fact = (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
const nPr = (n, r) => { let v = 1; for (let i = 0; i < r; i++) v *= (n - i); return v; };
const nCr = (n, r) => nPr(n, r) / fact(r);

// 分数の4択（ありがちな誤答：余事象・分子±1・約分まわり）
function fchoices(num, den, r) {
  const correct = frac(num, den);
  const cand = [frac(den - num, den), frac(num + 1, den), frac(num - 1, den), frac(num + 2, den), frac(num, den + 1), String(num)];
  return exprChoices(correct, cand, [frac(num + 3, den), frac(Math.max(0, num - 2), den)], r);
}

// ── u1 場合の数 ──
function genCount(r, level) {
  if (level === "easy") {
    const n = r(3, 5), a = fact(n);
    return { q: `${n}人が1列に並ぶ並び方は何通りですか。`, ans: a, choices: numChoices(a, r, [n * n, n * (n - 1), n]), h1: H.count.h1, h2: "1列の並び方 = n×(n−1)×…×1" };
  }
  if (level === "standard") {
    const n = r(4, 6), rr = r(2, 3), a = nPr(n, rr);
    return { q: `${n}人から${rr}人を選んで1列に並べる並べ方は何通りですか。`, ans: a, choices: numChoices(a, r, [nCr(n, rr), Math.pow(n, rr), n * rr]), h1: H.count.h1, h2: "並べる=n×(n−1)×…（r個ぶん）" };
  }
  const n = r(4, 7), rr = r(2, 3), a = nCr(n, rr);
  return { q: `${n}人から${rr}人を選ぶ選び方は何通りですか。`, ans: a, choices: numChoices(a, r, [nPr(n, rr), n * rr, n]), h1: H.count.h1, h2: "選ぶ=並べる ÷ (r×…×1)" };
}

// ── u2 確率の基本（さいころ・硬貨） ──
function genProbBasic(r, level) {
  if (level === "easy") {
    const a = r(2, 6), fav = 7 - a;            // a以上の目
    return { q: `1個のさいころを投げるとき、${a} 以上の目が出る確率を求めなさい。`, ans: frac(fav, 6), choices: fchoices(fav, 6, r), h1: H.prob.h1, h2: `${a}以上は ${fav} 通り。${fav}/6 を約分` };
  }
  if (level === "standard") {
    // 2枚の硬貨で表がちょうどk枚（全4通り）
    const k = r(0, 2), fav = [1, 2, 1][k];
    return { q: `2枚の硬貨を同時に投げるとき、表がちょうど ${k} 枚出る確率を求めなさい。`, ans: frac(fav, 4), choices: fchoices(fav, 4, r), h1: H.prob.h1, h2: "表裏の出方は全部で 2×2=4 通り" };
  }
  // 発展：3枚の硬貨で表がちょうどk枚（全8通り。1/3/3/1）
  const k = r(0, 3), fav = [1, 3, 3, 1][k];
  return { q: `3枚の硬貨を同時に投げるとき、表がちょうど ${k} 枚出る確率を求めなさい。`, ans: frac(fav, 8), choices: fchoices(fav, 8, r), h1: H.prob.h1, h2: "出方は全部で 2×2×2=8 通り" };
}

// ── u3 確率の応用（玉・2つのさいころ） ──
const sumCount = (k) => 6 - Math.abs(k - 7);     // 2つのさいころで和がkになる通り数
function genProbAdv(r, level) {
  if (level === "easy") {
    const red = r(2, 5), white = r(2, 5), tot = red + white;
    return { q: `赤玉 ${red} 個と白玉 ${white} 個が入った袋から1個取り出すとき、赤玉が出る確率を求めなさい。`, ans: frac(red, tot), choices: fchoices(red, tot, r), h1: H.prob.h1, h2: `全部で${tot}個、赤は${red}個。${red}/${tot} を約分` };
  }
  if (level === "standard") {
    const k = r(3, 11), fav = sumCount(k);
    return { q: `2つのさいころを同時に投げるとき、出た目の和が ${k} になる確率を求めなさい。`, ans: frac(fav, 36), choices: fchoices(fav, 36, r), h1: H.prob.h1, h2: `和が${k}は ${fav} 通り。${fav}/36 を約分` };
  }
  // 和が k 以上
  const k = r(8, 11);
  let fav = 0; for (let s = k; s <= 12; s++) fav += sumCount(s);
  return { q: `2つのさいころを同時に投げるとき、出た目の和が ${k} 以上になる確率を求めなさい。`, ans: frac(fav, 36), choices: fchoices(fav, 36, r), h1: H.prob.h1, h2: `和が${k}以上の通り数を数えて 36 で割る` };
}

const lv = (fn, idp, skill) => ({
  easy: [p(idp + "e", (r) => fn(r, "easy"), skill)],
  standard: [p(idp + "s", (r) => fn(r, "standard"), skill)],
  advanced: [p(idp + "a", (r) => fn(r, "advanced"), skill)],
});

export const chapter = {
  id: "g2c6",
  name: "確率と統計",
  emoji: "🎲",
  color: "#22d3ee",
  grade: 2,
  units: [
    { id: "g2c6u1", name: "場合の数（順列・組み合わせ）", emoji: "🔢", desc: "並べる・選ぶ", problems: lv(genCount, "g2c6u1", "S-PRB-COUNT") },
    { id: "g2c6u2", name: "確率の基本（さいころ・硬貨）", emoji: "🎲", desc: "場合÷全部", problems: lv(genProbBasic, "g2c6u2", "S-PRB-BASIC") },
    { id: "g2c6u3", name: "確率の応用（玉・2つのさいころ）", emoji: "🔴", desc: "玉・2個のさいころ", problems: lv(genProbAdv, "g2c6u3", "S-PRB-ADV") },
  ],
};
