// ============================================================
// g3c7 — 中3「三平方の定理」（★自動作問版）
//  三平方数(ピタゴラス数)で整数、それ以外は √ を簡約して答える。
// ============================================================
import { sqrtStr, neg, exprChoices, numChoices } from "../_algebra.js";

const p = (id, build, skill = null) => ({ id, build, skill });
const rpick = (r, arr) => arr[r(0, arr.length - 1)];
const TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
const NONTRI = [[2, 3], [2, 2], [3, 5], [1, 3], [2, 5], [3, 7], [4, 5], [1, 4], [5, 6]];

const H = {
  basic: { h1: "直角三角形では a²+b²=c²（c は斜辺）", h2: "斜辺 c=√(a²+b²)、他の辺 b=√(c²−a²)" },
  special: { h1: "直角二等辺(45°)は 1:1:√2、30°60°90°は 1:2:√3", h2: "辺の比にあてはめて求める" },
  plane: { h1: "対角線や高さは直角三角形をつくって三平方の定理", h2: "正方形の対角線=1辺×√2、長方形=√(縦²+横²)" },
  space: { h1: "2点間の距離=√((xの差)²+(yの差)²)", h2: "直方体の対角線=√(縦²+横²+高さ²)" },
};

// u1 辺の長さ
function genBasic(r, level) {
  if (level === "easy") {
    const [a, b, c] = rpick(r, TRI);
    return { q: `直角をはさむ2辺が ${a}cm と ${b}cm の直角三角形の斜辺の長さは何cmですか。`, ans: c, choices: numChoices(c, r, [a + b, c - 1, b]), h1: H.basic.h1, h2: `√(${a}²+${b}²)=√${a * a + b * b}=${c}` };
  }
  if (level === "standard") {
    const [a, b, c] = rpick(r, TRI);
    return { q: `斜辺が ${c}cm、他の1辺が ${a}cm の直角三角形の残りの辺の長さは何cmですか。`, ans: b, choices: numChoices(b, r, [c - a, c + a, a]), h1: H.basic.h1, h2: `√(${c}²−${a}²)=√${c * c - a * a}=${b}` };
  }
  const [a, b] = rpick(r, NONTRI), n = a * a + b * b, ans = sqrtStr(1, n);
  return { q: `直角をはさむ2辺が ${a}cm と ${b}cm の直角三角形の斜辺の長さを求めなさい。`, ans, choices: exprChoices(ans, [`${a + b}`, `√${n + 1}`, `${a * b}`], [sqrtStr(1, n + 1), `√${n}`], r), h1: H.basic.h1, h2: `√(${a}²+${b}²)=√${n}` };
}

// u2 特別な直角三角形
function genSpecial(r, level) {
  if (level === "easy") {
    const L = r(2, 8), ans = sqrtStr(L, 2);
    return { q: `直角二等辺三角形で、直角をはさむ辺が ${L}cm のとき、斜辺の長さを求めなさい。`, ans, choices: exprChoices(ans, [`${L}`, `${2 * L}`, sqrtStr(L, 3)], [sqrtStr(L + 1, 2)], r), h1: H.special.h1, h2: `${L}×√2＝${L}√2` };
  }
  if (level === "standard") {
    const s = r(2, 8), ans = sqrtStr(s, 3);
    return { q: `30°,60°,90° の直角三角形で、最も短い辺が ${s}cm のとき、残りの直角をはさむ辺（60°の対辺）の長さを求めなさい。`, ans, choices: exprChoices(ans, [`${2 * s}`, sqrtStr(s, 2), `${s}`], [sqrtStr(s + 1, 3)], r), h1: H.special.h1, h2: `短い辺×√3＝${s}√3` };
  }
  const Heven = 2 * r(2, 6), ans = sqrtStr(Heven / 2, 2);   // 斜辺H → 1辺 = H/√2 = (H/2)√2
  return { q: `直角二等辺三角形で、斜辺が ${Heven}cm のとき、直角をはさむ1辺の長さを求めなさい。`, ans, choices: exprChoices(ans, [`${Heven / 2}`, sqrtStr(Heven, 2), `${Heven}`], [sqrtStr(Heven / 2 + 1, 2)], r), h1: H.special.h1, h2: `斜辺÷√2＝${Heven}/√2＝${Heven / 2}√2` };
}

// u3 平面図形への利用
function genPlane(r, level) {
  if (level === "easy") {
    const s = r(2, 9), ans = sqrtStr(s, 2);
    return { q: `1辺 ${s}cm の正方形の対角線の長さを求めなさい。`, ans, choices: exprChoices(ans, [`${s}`, `${2 * s}`, sqrtStr(s, 3)], [sqrtStr(s, 2 * 1) === ans ? sqrtStr(s + 1, 2) : sqrtStr(s + 1, 2)], r), h1: H.plane.h2, h2: `${s}×√2＝${s}√2` };
  }
  if (level === "standard") {
    const [a, b] = rpick(r, NONTRI), n = a * a + b * b, ans = sqrtStr(1, n);
    return { q: `縦 ${a}cm、横 ${b}cm の長方形の対角線の長さを求めなさい。`, ans, choices: exprChoices(ans, [`${a + b}`, `√${n + 2}`, `${a * b}`], [sqrtStr(1, n + 1)], r), h1: H.plane.h2, h2: `√(${a}²+${b}²)=√${n}` };
  }
  const sEven = 2 * r(2, 6), ans = sqrtStr(sEven / 2, 3);    // 正三角形の高さ = (s/2)√3
  return { q: `1辺 ${sEven}cm の正三角形の高さを求めなさい。`, ans, choices: exprChoices(ans, [sqrtStr(sEven, 3), `${sEven / 2}`, sqrtStr(sEven / 2, 2)], [sqrtStr(sEven / 2 + 1, 3)], r), h1: "高さは1辺の半分を底辺とする直角三角形で求める", h2: `(${sEven}/2)×√3＝${sEven / 2}√3` };
}

// u4 座標・空間図形
function genSpace(r, level) {
  if (level === "easy") {
    const [a, b, c] = rpick(r, TRI), x1 = r(-3, 3), y1 = r(-3, 3);
    return { q: `2点 A(${neg(x1)}, ${neg(y1)})、B(${neg(x1 + a)}, ${neg(y1 + b)}) の間の距離を求めなさい。`, ans: c, choices: numChoices(c, r, [a + b, c - 1, a]), h1: H.space.h1, h2: `√(${a}²+${b}²)=${c}` };
  }
  if (level === "standard") {
    const [a, b] = rpick(r, NONTRI), x1 = r(-2, 2), y1 = r(-2, 2), n = a * a + b * b, ans = sqrtStr(1, n);
    return { q: `2点 A(${neg(x1)}, ${neg(y1)})、B(${neg(x1 + a)}, ${neg(y1 + b)}) の間の距離を求めなさい。`, ans, choices: exprChoices(ans, [`${a + b}`, `√${n + 1}`, `${a * b}`], [sqrtStr(1, n + 2)], r), h1: H.space.h1, h2: `√(${a}²+${b}²)=√${n}` };
  }
  const a = r(2, 6), b = r(2, 6), c = r(2, 6), n = a * a + b * b + c * c, ans = sqrtStr(1, n);
  return { q: `縦 ${a}cm、横 ${b}cm、高さ ${c}cm の直方体の対角線の長さを求めなさい。`, ans, choices: exprChoices(ans, [`${a + b + c}`, `√${n + 1}`, sqrtStr(1, a * a + b * b)], [sqrtStr(1, n + 2)], r), h1: H.space.h2, h2: `√(${a}²+${b}²+${c}²)=√${n}` };
}

const lv = (fn, idp, skill) => ({ easy: [p(idp + "e", (r) => fn(r, "easy"), skill)], standard: [p(idp + "s", (r) => fn(r, "standard"), skill)], advanced: [p(idp + "a", (r) => fn(r, "advanced"), skill)] });

export const chapter = {
  id: "g3c7",
  name: "三平方の定理",
  emoji: "📐",
  color: "#fb7185",
  grade: 3,
  units: [
    { id: "g3c7u1", name: "三平方の定理（辺の長さを求める）", emoji: "📏", desc: "a²+b²=c²", problems: lv(genBasic, "g3c7u1", "S-PYT-BASIC") },
    { id: "g3c7u2", name: "三平方の定理（特別な直角三角形）", emoji: "🔺", desc: "1:1:√2 / 1:2:√3", problems: lv(genSpecial, "g3c7u2", "S-PYT-SPECIAL") },
    { id: "g3c7u3", name: "三平方の定理（平面図形への利用）", emoji: "⬛", desc: "対角線・高さ", problems: lv(genPlane, "g3c7u3", "S-PYT-PLANE") },
    { id: "g3c7u4", name: "三平方の定理（座標・空間図形）", emoji: "🧊", desc: "距離・対角線", problems: lv(genSpace, "g3c7u4", "S-PYT-SPACE") },
  ],
};
