// ============================================================
// g2c3 — 中2「一次関数」（★自動作問版）
//  数値で答える問題は numChoices、式 y=ax+b・交点(x,y) は専用ダミー。
//  係数・座標を整数に保ち、答えが必ず整数になるよう構成する。
// ============================================================
import { polyStr, neg, exprChoices, numChoices } from "../_algebra.js";

const p = (id, build, skill = null) => ({ id, build, skill });
const rnz = (r, a, b) => { let v = 0; while (v === 0) v = r(a, b); return v; };

const H = {
  rate: { h1: "一次関数 y=ax+b の変化の割合は、いつも a（xの係数）", h2: "yの増加量 = 変化の割合 × xの増加量" },
  eq: { h1: "傾き=変化の割合=a、切片=x が0のときの y=b", h2: "通る点を y=ax+b に代入して b を求める" },
  graph: { h1: "交点は2式の y を等しいとおいて x を求める", h2: "求めた x をどちらかの式に代入して y を出す" },
};
const linStr = (a, b) => "y=" + polyStr([{ c: a, v: { x: 1 } }, { c: b, v: {} }]);
const pointStr = (x, y) => `(${neg(x)}, ${neg(y)})`;

// ── u1 変化の割合・増加量 ──
function genRate(r, level) {
  const a = rnz(r, -5, 5), b = rnz(r, -6, 6);
  if (level === "easy") {
    return { q: `一次関数 ${linStr(a, b)} の変化の割合を求めなさい。`, ans: a, choices: numChoices(a, r, [b, -a, a + b]), h1: H.rate.h1, h2: H.rate.h2 };
  }
  // xが p→q に増えるときの y の増加量 = a(q−p)
  const pq0 = r(-4, 2), d = r(2, 5), q0 = pq0 + d;
  const inc = a * d;
  return { q: `一次関数 ${linStr(a, b)} で、x が ${neg(pq0)} から ${neg(q0)} まで増えるとき、y の増加量を求めなさい。`, ans: inc, choices: numChoices(inc, r, [a, d, a + d, -inc]), h1: H.rate.h1, h2: H.rate.h2 };
}

// ── u2 傾き・切片・式の決定 ──
function genEq(r, level) {
  if (level === "easy") {
    const a = rnz(r, -5, 5), b = rnz(r, -7, 7);
    const ans = linStr(a, b);
    const variants = [linStr(b, a), linStr(-a, b), linStr(a, -b)];
    return { q: `傾きが ${neg(a)}、切片が ${neg(b)} の一次関数の式を求めなさい。`, ans, choices: exprChoices(ans, variants, [linStr(a, b + 1), linStr(a + 1, b)], r), h1: H.eq.h1, h2: H.eq.h2 };
  }
  if (level === "standard") {
    // 傾き a で点(x1,y1)を通る → b = y1 − a x1
    const a = rnz(r, -4, 4), x1 = rnz(r, -4, 4), y1 = rnz(r, -6, 6);
    const b = y1 - a * x1;
    const ans = linStr(a, b);
    const variants = [linStr(a, y1), linStr(-a, b), linStr(a, -b)];
    return { q: `傾きが ${neg(a)} で、点(${neg(x1)}, ${neg(y1)}) を通る直線の式を求めなさい。`, ans, choices: exprChoices(ans, variants, [linStr(a, b + 1), linStr(a, b - 1)], r), h1: H.eq.h1, h2: H.eq.h2 };
  }
  // 2点を通る式（傾きが整数になるよう構成）
  const x1 = rnz(r, -4, 2), a = rnz(r, -3, 3), x2 = x1 + rnz(r, 1, 3);
  const b = rnz(r, -6, 6);
  const y1 = a * x1 + b, y2 = a * x2 + b;
  const ans = linStr(a, b);
  const variants = [linStr(a, y1), linStr(-a, b), linStr(a, -b)];
  return { q: `2点(${neg(x1)}, ${neg(y1)})、(${neg(x2)}, ${neg(y2)}) を通る直線の式を求めなさい。`, ans, choices: exprChoices(ans, variants, [linStr(a + 1, b), linStr(a, b + 1)], r), h1: H.eq.h1, h2: H.eq.h2 };
}

// ── u3 変域・交点 ──
function genGraph(r, level) {
  if (level === "easy") {
    // a>0：x の変域 p≤x≤q のときの y の最大値 = a q + b
    const a = r(1, 5), b = rnz(r, -6, 6), p0 = rnz(r, -4, 1), q0 = p0 + r(2, 5);
    const mx = a * q0 + b;
    return { q: `一次関数 ${linStr(a, b)} で、x の変域が ${neg(p0)}≦x≦${neg(q0)} のとき、y の最大値を求めなさい。`, ans: mx, choices: numChoices(mx, r, [a * p0 + b, a * q0, q0 + b]), h1: "a>0 のとき、xが大きいほど y も大きい", h2: "x の最大値を式に代入する" };
  }
  // 交点（x0,y0 を整数で決め、2直線を逆算）
  const x0 = rnz(r, -4, 4), y0 = rnz(r, -5, 5);
  const a1 = rnz(r, -4, 4); let a2 = rnz(r, -4, 4); if (a2 === a1) a2 = a1 + 1;
  const b1 = y0 - a1 * x0, b2 = y0 - a2 * x0;
  if (level === "standard") {
    return { q: `2直線 ${linStr(a1, b1)} と ${linStr(a2, b2)} の交点の x 座標を求めなさい。`, ans: x0, choices: numChoices(x0, r, [y0, -x0, b1, b2]), h1: H.graph.h1, h2: H.graph.h2 };
  }
  const ans = pointStr(x0, y0);
  const variants = [pointStr(y0, x0), pointStr(-x0, y0), pointStr(x0, -y0)];
  return { q: `2直線 ${linStr(a1, b1)} と ${linStr(a2, b2)} の交点の座標を求めなさい。`, ans, choices: exprChoices(ans, variants, [pointStr(x0 + 1, y0), pointStr(x0, y0 + 1)], r), h1: H.graph.h1, h2: H.graph.h2 };
}

const lv = (fn, idp, skill) => ({
  easy: [p(idp + "e", (r) => fn(r, "easy"), skill)],
  standard: [p(idp + "s", (r) => fn(r, "standard"), skill)],
  advanced: [p(idp + "a", (r) => fn(r, "advanced"), skill)],
});

export const chapter = {
  id: "g2c3",
  name: "一次関数",
  emoji: "📈",
  color: "#f59e0b",
  grade: 2,
  units: [
    { id: "g2c3u1", name: "変化の割合・増加量", emoji: "📊", desc: "変化の割合=a", problems: lv(genRate, "g2c3u1", "S-FUN-RATE") },
    { id: "g2c3u2", name: "傾き・切片・式の決定", emoji: "✏️", desc: "y=ax+b を求める", problems: lv(genEq, "g2c3u2", "S-FUN-EQ") },
    { id: "g2c3u3", name: "一次関数のグラフと変域・交点", emoji: "🪡", desc: "変域・交点", problems: lv(genGraph, "g2c3u3", "S-FUN-GRAPH") },
  ],
};
