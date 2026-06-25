// ============================================================
// g2c5 — 中2「三角形と四角形」（★自動作問版・角度/長さ/面積＝数値）
//  二等辺三角形の角、平行四辺形の角・周、特別な四角形と面積。すべて整数になるよう構成。
// ============================================================
import { numChoices } from "../_algebra.js";

const p = (id, build, skill = null) => ({ id, build, skill });

const H = {
  isos: { h1: "二等辺三角形は2つの底角が等しい。3つの角の和は180°", h2: "底角 = (180−頂角)÷2 ／ 頂角 = 180−底角×2" },
  para: { h1: "平行四辺形は、向かい合う角が等しく、となり合う角の和は180°", h2: "向かい合う辺も等しい。周 = (たて+よこ)×2" },
  area: { h1: "平行四辺形の面積 = 底辺×高さ", h2: "ひし形の面積 = 対角線×対角線÷2" },
};

// ── u1 二等辺三角形・正三角形 ──
function genIsos(r, level) {
  if (level === "easy") {
    const apex = 2 * r(10, 55);            // 偶数20〜110 → 底角は整数
    const base = (180 - apex) / 2;
    return { q: `頂角が ${apex}° の二等辺三角形の1つの底角は何度ですか。`, ans: base, choices: numChoices(base, r, [180 - apex, apex / 2, 90 - apex]), h1: H.isos.h1, h2: H.isos.h2 };
  }
  const base = r(30, 80);
  const apex = 180 - 2 * base;
  if (level === "standard") {
    return { q: `底角が ${base}° の二等辺三角形の頂角は何度ですか。`, ans: apex, choices: numChoices(apex, r, [180 - base, base, 90 - base]), h1: H.isos.h1, h2: H.isos.h2 };
  }
  // advanced: 底角がbase°のとき、頂角の外角は？（=180−頂角=2×底角）
  const ext = 2 * base;
  return { q: `底角が ${base}° の二等辺三角形で、頂角の外角は何度ですか。`, ans: ext, choices: numChoices(ext, r, [apex, base, 180 - base]), h1: "外角 = 180 − 頂角", h2: "頂角=180−底角×2 を使って 180−頂角 を計算" };
}

// ── u2 平行四辺形の性質 ──
function genPara(r, level) {
  const a = r(40, 140);
  if (level === "easy") {
    return { q: `平行四辺形ABCDで ∠A=${a}° のとき、向かい合う ∠C は何度ですか。`, ans: a, choices: numChoices(a, r, [180 - a, 90, 360 - a]), h1: H.para.h1, h2: "向かい合う角は等しい" };
  }
  if (level === "standard") {
    const nb = 180 - a;
    return { q: `平行四辺形ABCDで ∠A=${a}° のとき、となりの ∠B は何度ですか。`, ans: nb, choices: numChoices(nb, r, [a, 90, 360 - a]), h1: H.para.h1, h2: "となり合う角の和は180°" };
  }
  // advanced: 周の長さ
  const s1 = r(3, 12), s2 = r(3, 12), per = 2 * (s1 + s2);
  return { q: `平行四辺形で となり合う辺が ${s1}cm と ${s2}cm のとき、周の長さは何cmですか。`, ans: per, choices: numChoices(per, r, [s1 + s2, s1 * s2, 2 * s1 + s2]), h1: H.para.h1, h2: "周 = (たて+よこ)×2" };
}

// ── u3 特別な平行四辺形・面積 ──
function genArea(r, level) {
  if (level === "easy") {
    const b = r(3, 12), h = r(3, 12), s = b * h;
    return { q: `底辺 ${b}cm、高さ ${h}cm の平行四辺形の面積は何cm²ですか。`, ans: s, choices: numChoices(s, r, [b + h, 2 * (b + h), b * h / 2 | 0]), h1: H.area.h1, h2: "面積 = 底辺×高さ" };
  }
  if (level === "standard") {
    const d1 = 2 * r(2, 7), d2 = r(3, 12), s = d1 * d2 / 2;  // d1偶数 → 整数
    return { q: `対角線が ${d1}cm と ${d2}cm のひし形の面積は何cm²ですか。`, ans: s, choices: numChoices(s, r, [d1 * d2, d1 + d2, d1 * d2 / 2 + d1]), h1: H.area.h2, h2: "ひし形の面積 = 対角線×対角線÷2" };
  }
  // advanced: 面積と底辺から高さ
  const b = r(3, 10), h = r(3, 12), s = b * h;
  return { q: `面積が ${s}cm²、底辺が ${b}cm の平行四辺形の高さは何cmですか。`, ans: h, choices: numChoices(h, r, [s - b, b, s / b + 1 | 0]), h1: H.area.h1, h2: "高さ = 面積 ÷ 底辺" };
}

const lv = (fn, idp, skill) => ({
  easy: [p(idp + "e", (r) => fn(r, "easy"), skill)],
  standard: [p(idp + "s", (r) => fn(r, "standard"), skill)],
  advanced: [p(idp + "a", (r) => fn(r, "advanced"), skill)],
});

export const chapter = {
  id: "g2c5",
  name: "三角形と四角形",
  emoji: "🔻",
  color: "#fb7185",
  grade: 2,
  units: [
    { id: "g2c5u1", name: "二等辺三角形・正三角形", emoji: "🔺", desc: "底角・頂角", problems: lv(genIsos, "g2c5u1", "S-GEO-ISOS") },
    { id: "g2c5u2", name: "平行四辺形の性質", emoji: "▱", desc: "角・周", problems: lv(genPara, "g2c5u2", "S-GEO-PARA") },
    { id: "g2c5u3", name: "特別な平行四辺形・面積", emoji: "🟧", desc: "面積", problems: lv(genArea, "g2c5u3", "S-GEO-QAREA") },
  ],
};
