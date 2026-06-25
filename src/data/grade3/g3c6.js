// ============================================================
// g3c6 — 中3「円」（★自動作問版・角度＝数値）
//  円周角と中心角、内接四角形、接弦角。
// ============================================================
import { numChoices } from "../_algebra.js";

const p = (id, build, skill = null) => ({ id, build, skill });

const H = {
  inscribed: { h1: "同じ弧に対する円周角は中心角の半分", h2: "中心角 = 円周角 × 2、円周角 = 中心角 ÷ 2" },
  cyclic: { h1: "円に内接する四角形は、向かい合う角の和が180°", h2: "∠A+∠C=180°、∠B+∠D=180°" },
  tangent: { h1: "接線と弦のつくる角は、その弦に対する円周角に等しい（接弦角）", h2: "接線と半径（接点）は垂直＝90°" },
};

// u1 円周角と中心角
function genInscribed(r, level) {
  if (level === "easy") {
    const ic = r(20, 80), ce = 2 * ic;
    return { q: `ある弧に対する円周角が ${ic}° のとき、その弧に対する中心角は何度ですか。`, ans: ce, choices: numChoices(ce, r, [ic, ic / 2, 180 - ic]), h1: H.inscribed.h1, h2: `中心角 = ${ic}×2 = ${ce}` };
  }
  if (level === "standard") {
    const ic = r(15, 80), ce = 2 * ic;
    return { q: `ある弧に対する中心角が ${ce}° のとき、その弧に対する円周角は何度ですか。`, ans: ic, choices: numChoices(ic, r, [ce, ce * 2, 180 - ce]), h1: H.inscribed.h1, h2: `円周角 = ${ce}÷2 = ${ic}` };
  }
  // 直径に対する円周角は90°（半円）
  const ic = 90, given = r(20, 60);
  return { q: `半円の弧（直径）に対する円周角は何度ですか。`, ans: ic, choices: numChoices(ic, r, [180, 45, given]), h1: "直径に対する円周角は必ず90°", h2: "中心角180°の半分で90°" };
}

// u2 円に内接する四角形
function genCyclic(r) {
  const a = r(60, 130), opp = 180 - a;
  return { q: `円に内接する四角形ABCDで ∠A=${a}° のとき、向かい合う ∠C は何度ですか。`, ans: opp, choices: numChoices(opp, r, [a, 360 - a, 90]), h1: H.cyclic.h1, h2: `∠C = 180 − ${a} = ${opp}` };
}

// u3 接線と円周角（接弦角）
function genTangent(r, level) {
  if (level === "advanced") {
    return { q: `円の接線と、接点を通る半径とのつくる角は何度ですか。`, ans: 90, choices: numChoices(90, r, [180, 45, 60]), h1: H.tangent.h2, h2: "接線⊥半径（接点）で90°" };
  }
  const a = r(25, 75);
  return { q: `円の接線と弦のつくる角が ${a}° のとき、その弦に対する円周角は何度ですか。`, ans: a, choices: numChoices(a, r, [180 - a, 2 * a, 90 - a]), h1: H.tangent.h1, h2: `接弦角の定理より ${a}°` };
}

const lv = (fn, idp, skill) => ({ easy: [p(idp + "e", (r) => fn(r, "easy"), skill)], standard: [p(idp + "s", (r) => fn(r, "standard"), skill)], advanced: [p(idp + "a", (r) => fn(r, "advanced"), skill)] });

export const chapter = {
  id: "g3c6",
  name: "円",
  emoji: "⭕",
  color: "#22d3ee",
  grade: 3,
  units: [
    { id: "g3c6u1", name: "円周角と中心角", emoji: "🎯", desc: "中心角=円周角×2", problems: lv(genInscribed, "g3c6u1", "S-CIRC-INSC") },
    { id: "g3c6u2", name: "円に内接する四角形", emoji: "⬜", desc: "対角の和180°", problems: lv(genCyclic, "g3c6u2", "S-CIRC-CYC") },
    { id: "g3c6u3", name: "接線と円周角", emoji: "📏", desc: "接弦角・接線⊥半径", problems: lv(genTangent, "g3c6u3", "S-CIRC-TAN") },
  ],
};
