// ============================================================
// data/toketa/help.js — とけた！のヒント足場（正負ぶん）。
//  ・SYM      … つまづきタグ → 「子どもの声」（メニューの選択肢文）
//  ・CONTRAST … 混同しやすいバグを “対比” で見せる（誤答タグで引く）
//  ・hintTags … その問題で選べるつまづきタグを distractors から抽出
//  出典: toketa/src/App.jsx (SYM) / toketa/src/content/help.js (CONTRAST)。
// ============================================================

// つまづきタグ → 子どもの声（「どこでまよってる？」の選択肢）
export const SYM = {
  "sign-flip": "答えが ＋か −か でまよう",
  "same-sub": "同じ符号どうしの たし算がむずかしい",
  "diff-add": "符号がちがう数の 計算がむずかしい",
  "sub-keep": "ひき算で 符号の変え方がわからない",
  "mul-sign": "かけ算・わり算の 符号がわからない",
  "pow-sign": "（−5）² と −5² のちがいがわからない",
  "abs-sign": "絶対値の意味が よくわからない",
  "order": "どこから計算するか わからない",
  "calc": "計算で ミスしてるかも",
};

// 対比カード（「くらべてみよう」）。誤答タグで引く。row = { e:例, v:値, n:説明 }
const ADDRULE = {
  ttl: "くらべてみよう", rows: [
    { e: "同符号 （−2）＋（−3）", v: "＝ −5", n: "絶対値を たす・符号そのまま" },
    { e: "異符号 （−2）＋（＋3）", v: "＝ ＋1", n: "絶対値を ひく・大きい方の符号" },
  ], tip: "同符号は たす、異符号は ひく",
};
export const CONTRAST = {
  "pow-sign": {
    ttl: "くらべてみよう", rows: [
      { e: "（−2）²", v: "＝ ＋4", n: "かっこの中ぜんぶを2乗" },
      { e: "−2²", v: "＝ −4", n: "2だけ2乗、−はあと" },
    ], tip: "（ ）があるかないかで 符号が変わる！",
  },
  "same-sub": ADDRULE,
  "diff-add": ADDRULE,
  "mul-sign": {
    ttl: "くらべてみよう", rows: [
      { e: "同符号 （−）×（−）", v: "＝ ＋", n: "" },
      { e: "異符号 （−）×（＋）", v: "＝ −", n: "" },
    ], tip: "同符号→＋、異符号→−（かけ算・わり算）",
  },
  "sub-keep": {
    ttl: "くらべてみよう", rows: [
      { e: "（−3）−（−4）", v: "＝（−3）＋（＋4）", n: "ひく数の符号を変えて たす" },
    ], tip: "ひき算は「符号を変えて たす」に直す",
  },
};

// この問題で選べる「つまづきの選択肢」（誤答のタグから・calc は最後）
export function hintTags(p) {
  const seen = [];
  if (!p || !Array.isArray(p.distractors)) return seen;
  for (const d of p.distractors) if (d.tag && d.tag !== "calc" && !seen.includes(d.tag)) seen.push(d.tag);
  if (p.distractors.some((d) => d.tag === "calc")) seen.push("calc");
  return seen;
}
