// ============================================================
// g3c5 — 中3「相似な図形」（★自動作問版）
//  比例式・面積比/体積比・影の測定。整数になるよう構成。
// ============================================================
import { exprChoices, numChoices } from "../_algebra.js";

const p = (id, build, skill = null) => ({ id, build, skill });
const rpick = (r, arr) => arr[r(0, arr.length - 1)];
const COP = [[1, 2], [2, 3], [1, 3], [3, 4], [2, 5], [3, 5], [1, 4], [4, 5], [3, 7]]; // 互いに素

const H = {
  prop: { h1: "a:b=c:x のとき、外側どうし・内側どうしの積が等しい（ax=bc）", h2: "x = b×c ÷ a" },
  ratio: { h1: "相似比 m:n のとき、面積比 m²:n²、体積比 m³:n³", h2: "辺の比を2乗すると面積比、3乗すると体積比" },
};

// u1 比例式とxの値： a:b = c:x
function genProp(r, level) {
  const [pp, qq] = rpick(r, COP);                  // 比 pp:qq（互いに素）
  const s = level === "easy" ? r(2, 4) : r(2, 5);  // 左側の倍率
  const u = level === "easy" ? r(2, 4) : level === "standard" ? r(3, 6) : r(5, 9); // 右側の倍率（発展ほど大きい）
  const A = pp * s, B = qq * s, C = pp * u, D = qq * u; // A:B = C:D（必ず成立）
  if (level === "easy") {
    return { q: `比例式 ${A}:${B} = ${C}:x が成り立つとき、x の値を求めなさい。`, ans: D, choices: numChoices(D, r, [C, B, C - A + B]), h1: H.prop.h1, h2: `x=${B}×${C}÷${A}=${D}` };
  }
  if (level === "standard") {
    return { q: `比例式 ${A}:${B} = x:${D} が成り立つとき、x の値を求めなさい。`, ans: C, choices: numChoices(C, r, [D, A, A + D - B]), h1: H.prop.h1, h2: `x=${A}×${D}÷${B}=${C}` };
  }
  // 発展：x が内項（大きめの数）
  return { q: `比例式 ${A}:x = ${C}:${D} が成り立つとき、x の値を求めなさい。`, ans: B, choices: numChoices(B, r, [C, D, A + D - C]), h1: "a:x=c:d のとき a×d = x×c", h2: `x=${A}×${D}÷${C}=${B}` };
}

// u2 面積比・体積比
function genRatio(r, level) {
  const [m, n] = rpick(r, COP);
  if (level === "advanced") {
    const ans = `${m * m * m}:${n * n * n}`;
    return { q: `相似比が ${m}:${n} の2つの立体の体積比を求めなさい。`, ans, choices: exprChoices(ans, [`${m}:${n}`, `${m * m}:${n * n}`, `${n * n * n}:${m * m * m}`], [`${m * m}:${n * n * n}`], r), h1: H.ratio.h1, h2: `${m}³:${n}³=${m * m * m}:${n * n * n}` };
  }
  const ans = `${m * m}:${n * n}`;
  return { q: `相似比が ${m}:${n} の2つの図形の面積比を求めなさい。`, ans, choices: exprChoices(ans, [`${m}:${n}`, `${m * m * m}:${n * n * n}`, `${n * n}:${m * m}`], [`${m}:${n * n}`], r), h1: H.ratio.h1, h2: `${m}²:${n}²=${m * m}:${n * n}` };
}

// u3 影と測定（相似の利用）
function genShadow(r) {
  const h = r(1, 3), s = r(1, 4), t = r(2, 5);
  const treeShadow = s * t, x = h * t;
  return { q: `高さ ${h}m の棒の影が ${s}m のとき、同じ時刻に影が ${treeShadow}m の木の高さは何mですか。`, ans: x, choices: numChoices(x, r, [treeShadow - s + h, h + treeShadow - s, treeShadow]), h1: "同じ時刻なら 高さ:影 の比は等しい", h2: `${h}:${s} = x:${treeShadow} → x=${x}` };
}

const single = (fn, idp, skill) => ({ easy: [p(idp + "e", (r) => fn(r, "easy"), skill)], standard: [p(idp + "s", (r) => fn(r, "standard"), skill)], advanced: [p(idp + "a", (r) => fn(r, "advanced"), skill)] });

export const chapter = {
  id: "g3c5",
  name: "相似な図形",
  emoji: "🔺",
  color: "#a78bfa",
  grade: 3,
  units: [
    { id: "g3c5u1", name: "比例式とxの値", emoji: "➗", desc: "a:b=c:x", problems: single(genProp, "g3c5u1", "S-SIM-PROP") },
    { id: "g3c5u2", name: "相似な図形の面積比・体積比", emoji: "📐", desc: "m²:n²・m³:n³", problems: single(genRatio, "g3c5u2", "S-SIM-RATIO") },
    { id: "g3c5u3", name: "相似の利用（影と測定）", emoji: "🌳", desc: "影で高さを測る", problems: single(genShadow, "g3c5u3", "S-SIM-USE") },
  ],
};
