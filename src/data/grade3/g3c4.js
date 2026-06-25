// ============================================================
// g3c4 — 中3「関数 y=ax²」（★自動作問版）
//  式は y=ax²（monoStr）、変域・変化の割合・利用は数値。整数に保つ。
// ============================================================
import { monoStr, neg, exprChoices, numChoices } from "../_algebra.js";

const p = (id, build, skill = null) => ({ id, build, skill });
const rnz = (r, a, b) => { let v = 0; while (v === 0) v = r(a, b); return v; };
const q2 = (a) => `y=${monoStr(a, { x: 2 })}`;

const H = {
  eq: { h1: "y=ax² に通る点の x,y を代入して a を求める", h2: "a = y ÷ x²" },
  range: { h1: "a>0 のとき、|x|が大きいほど y も大きい", h2: "x の変域の端を代入して最大・最小を調べる" },
  rate: { h1: "y=ax² の変化の割合 = a×(p+q)（x が p→q）", h2: "(yの増加量)÷(xの増加量) を計算" },
};

// u1 式を求める
function genEq(r) {
  const a = rnz(r, -4, 4), x1 = rnz(r, 1, 4), y1 = a * x1 * x1;
  const ans = q2(a);
  return { q: `y は x² に比例し、x=${x1} のとき y=${neg(y1)} です。y を x の式で表しなさい。`, ans, choices: exprChoices(ans, [`y=${monoStr(a, { x: 1 })}`, q2(-a), q2(y1)], [q2(a + 1), q2(a - 1)], r), h1: H.eq.h1, h2: `a=${y1}÷${x1 * x1}=${a}` };
}

// u2 変域（a>0、x≧0 の範囲で最大値）
function genRange(r) {
  const a = r(1, 4), p0 = r(0, 3), q0 = p0 + r(1, 4);
  const mx = a * q0 * q0;
  return { q: `関数 y=${monoStr(a, { x: 2 })} で、x の変域が ${p0}≦x≦${q0} のとき、y の最大値を求めなさい。`, ans: mx, choices: numChoices(mx, r, [a * p0 * p0, a * q0, (a * q0) * (a * q0)]), h1: H.range.h1, h2: `x=${q0} のとき最大、${a}×${q0}²=${mx}` };
}

// u3 変化の割合 = a(p+q)
function genRate(r) {
  const a = rnz(r, -4, 4), p0 = rnz(r, -4, 3), q0 = p0 + r(1, 4);
  const rate = a * (p0 + q0);
  return { q: `関数 y=${monoStr(a, { x: 2 })} で、x が ${neg(p0)} から ${neg(q0)} まで増えるときの変化の割合を求めなさい。`, ans: rate, choices: numChoices(rate, r, [a, p0 + q0, a * (q0 - p0)]), h1: H.rate.h1, h2: `${a}×(${p0}+${q0})=${rate}` };
}

// u4 利用（文章題：y=ax² にあてはめる）
function genUse(r) {
  const a = r(2, 6), t = r(2, 6), y = a * t * t;
  if (r(0, 1) === 1) {
    return { q: `ある斜面で、ボールは ${a}x² (x は秒) の式で進みます。${t} 秒間に進む距離は何mですか。`, ans: y, choices: numChoices(y, r, [a * t, a + t * t, (a * t) * (a * t)]), h1: "x に時間を代入する", h2: `${a}×${t}²=${y}` };
  }
  return { q: `ある斜面で、ボールは ${a}x² (x は秒) の式で進みます。${y}m 進むのは何秒後ですか。`, ans: t, choices: numChoices(t, r, [y, y / a, a]), h1: "y に距離を入れて x を求める", h2: `x²=${y}÷${a}=${t * t}、x=${t}` };
}

const single = (fn, idp, skill) => ({ easy: [p(idp + "e", fn, skill)], standard: [p(idp + "s", fn, skill)], advanced: [p(idp + "a", fn, skill)] });

export const chapter = {
  id: "g3c4",
  name: "関数 y=ax²",
  emoji: "📉",
  color: "#fbbf24",
  grade: 3,
  units: [
    { id: "g3c4u1", name: "y=ax²の式を求める", emoji: "✏️", desc: "a を求める", problems: single(genEq, "g3c4u1", "S-FUNQ-EQ") },
    { id: "g3c4u2", name: "y=ax²の変域", emoji: "📊", desc: "最大・最小", problems: single(genRange, "g3c4u2", "S-FUNQ-RANGE") },
    { id: "g3c4u3", name: "変化の割合", emoji: "📈", desc: "a(p+q)", problems: single(genRate, "g3c4u3", "S-FUNQ-RATE") },
    { id: "g3c4u4", name: "y=ax²の利用（文章題）", emoji: "💡", desc: "あてはめ", problems: single(genUse, "g3c4u4", "S-FUNQ-USE") },
  ],
};
