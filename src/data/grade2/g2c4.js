// ============================================================
// g2c4 — 中2「平行と合同」（★自動作問版・角度＝数値）
//  多角形の内角の和 180(n−2)、正n角形の1内角 180(n−2)/n、1外角 360/n。
// ============================================================
import { numChoices } from "../_algebra.js";

const p = (id, build, skill = null) => ({ id, build, skill });
const rpick = (r, arr) => arr[r(0, arr.length - 1)];

const H = {
  sum: { h1: "n角形は (n−2) 個の三角形に分けられる", h2: "内角の和 = 180°×(n−2)" },
  reg: { h1: "正多角形は角がすべて等しい。外角の和はいつも360°", h2: "1つの外角=360÷n、1つの内角=180−(外角)" },
};
// 360 を割り切る n（正多角形で内角・外角が整数になる）
const NICE_N = [3, 4, 5, 6, 8, 9, 10, 12];

function genSum(r, level) {
  if (level === "advanced") {
    const n = r(5, 12), S = 180 * (n - 2);
    return { q: `内角の和が ${S}° の多角形は何角形ですか。（角の数を答えなさい）`, ans: n, choices: numChoices(n, r, [n + 2, n - 2, S / 180]), h1: H.sum.h1, h2: "n−2 = 内角の和÷180、n = それ＋2" };
  }
  const n = level === "easy" ? r(3, 8) : r(8, 15);
  const S = 180 * (n - 2);
  return { q: `${n}角形の内角の和は何度ですか。`, ans: S, choices: numChoices(S, r, [180 * n, 180 * (n - 1), 360]), h1: H.sum.h1, h2: H.sum.h2 };
}

function genReg(r, level) {
  const n = rpick(r, NICE_N);
  const ext = 360 / n, intA = 180 * (n - 2) / n;
  if (level === "easy") {
    return { q: `正${n}角形の1つの外角は何度ですか。`, ans: ext, choices: numChoices(ext, r, [intA, 360, n]), h1: H.reg.h1, h2: "1つの外角 = 360 ÷ n" };
  }
  if (level === "standard") {
    return { q: `正${n}角形の1つの内角は何度ですか。`, ans: intA, choices: numChoices(intA, r, [ext, 180 - n, 180]), h1: H.reg.h1, h2: "1つの内角 = 180 − (1つの外角)" };
  }
  // 外角から n を求める
  return { q: `1つの外角が ${ext}° の正多角形は正何角形ですか。（角の数を答えなさい）`, ans: n, choices: numChoices(n, r, [ext, n + 1, 360 - ext]), h1: H.reg.h1, h2: "n = 360 ÷ (1つの外角)" };
}

const lv = (fn, idp, skill) => ({
  easy: [p(idp + "e", (r) => fn(r, "easy"), skill)],
  standard: [p(idp + "s", (r) => fn(r, "standard"), skill)],
  advanced: [p(idp + "a", (r) => fn(r, "advanced"), skill)],
});

export const chapter = {
  id: "g2c4",
  name: "平行と合同",
  emoji: "📐",
  color: "#a78bfa",
  grade: 2,
  units: [
    { id: "g2c4u1", name: "多角形の内角の和", emoji: "🔺", desc: "180×(n−2)", problems: lv(genSum, "g2c4u1", "S-GEO-ANGSUM") },
    { id: "g2c4u2", name: "正多角形の内角・外角", emoji: "⬡", desc: "1つの内角・外角", problems: lv(genReg, "g2c4u2", "S-GEO-REGPOLY") },
  ],
};
