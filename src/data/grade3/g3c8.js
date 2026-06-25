// ============================================================
// g3c8 — 中3「標本調査」（★自動作問版）
//  用語・判断は語句の4択（毎回シャッフル）、推定は数値で自動生成。
// ============================================================
import { exprChoices, numChoices } from "../_algebra.js";

const p = (id, build, skill = null) => ({ id, build, skill });
const rpick = (r, arr) => arr[r(0, arr.length - 1)];
const shuffle = (r, arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = r(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ── u1 用語（語句4択） ──
const TERMS = [
  { q: "調査の対象となる集団全体を何といいますか。", ans: "母集団", ds: ["標本", "標本の大きさ", "度数分布"] },
  { q: "母集団の一部を取り出して調べ、全体の傾向を推測する調査を何といいますか。", ans: "標本調査", ds: ["全数調査", "国勢調査", "度数調査"] },
  { q: "母集団から取り出した一部分を何といいますか。", ans: "標本", ds: ["母集団", "全数調査", "階級"] },
  { q: "取り出した標本にふくまれるデータの個数を何といいますか。", ans: "標本の大きさ", ds: ["母集団の大きさ", "相対度数", "中央値"] },
  { q: "対象全部をもれなく調べる調査を何といいますか。", ans: "全数調査", ds: ["標本調査", "母集団", "標本"] },
];
const termTemplates = (skill) => TERMS.map((t, i) => p("g3c8u1t" + i, (r) => ({ q: t.q, ans: t.ans, choices: exprChoices(t.ans, t.ds, [], r), h1: "標本調査の用語を覚えよう", h2: `答えは「${t.ans}」` }), skill));

// ── u2 全数調査と標本調査の判断 ──
const ZENSU = ["学校でのクラス全員の身長測定", "国勢調査", "中学校の入学試験", "学級の出席調査"];
const HYOHON = ["電球の寿命を調べる検査", "テレビ番組の視聴率調査", "缶詰の品質検査", "湖にいる魚の数の推定"];
function genJudge(r) {
  const wantHyohon = r(0, 1) === 1;
  const pool = wantHyohon ? HYOHON : ZENSU, other = wantHyohon ? ZENSU : HYOHON;
  const correct = rpick(r, pool);
  const ds = shuffle(r, other).slice(0, 3);
  const label = wantHyohon ? "標本調査" : "全数調査";
  return { q: `次のうち、${label}が適切なものはどれですか。`, ans: correct, choices: exprChoices(correct, ds, [], r), h1: "全部を調べるのが現実的か、こわす・手間がかかるかで判断", h2: wantHyohon ? "全部調べると大変／製品をこわす → 標本調査" : "全員を確実に調べる必要がある → 全数調査" };
}

// ── u3 標本調査による推定（数値） ──
function genEstimate(r, level) {
  if (level === "easy") {
    // 不良品の推定： N個中、標本n個でk個不良 → N·k/n
    const n = rpick(r, [50, 100, 200]), k = r(1, 6), mult = rpick(r, [10, 20, 50]);
    const N = n * mult, est = k * mult;
    return { q: `製品 ${N} 個から ${n} 個を取り出して調べたら、不良品が ${k} 個ありました。${N} 個の中の不良品はおよそ何個と推定できますか。`, ans: est, choices: numChoices(est, r, [k, k * n, N - est]), h1: "標本での割合が母集団でも同じとみなす", h2: `${N}×(${k}/${n})=${est}` };
  }
  // 標識再捕法： m匹に印 → 後日s匹中t匹が印つき → 全体 ≈ m·s/t = m·k（s=t·k）
  const m = r(2, 8) * 5, k = r(2, 5), t = r(2, 6), s = t * k, N = m * k;
  return { q: `池の魚に印をつけて放した魚は ${m} 匹。後日 ${s} 匹つかまえると、印つきは ${t} 匹でした。池の魚はおよそ何匹と推定できますか。`, ans: N, choices: numChoices(N, r, [m + s, s * t, m * s]), h1: "印の割合（印つき/つかまえた数）が全体と同じとみなす", h2: `${m}×(${s}/${t})=${N}` };
}

export const chapter = {
  id: "g3c8",
  name: "標本調査",
  emoji: "📊",
  color: "#94a3b8",
  grade: 3,
  units: [
    { id: "g3c8u1", name: "標本調査の用語", emoji: "📖", desc: "母集団・標本など", problems: { easy: termTemplates("S-SAMP-TERM"), standard: termTemplates("S-SAMP-TERM"), advanced: termTemplates("S-SAMP-TERM") } },
    { id: "g3c8u2", name: "全数調査と標本調査の判断", emoji: "🔍", desc: "どちらが適切か", problems: { easy: [p("g3c8u2e", genJudge, "S-SAMP-JUDGE")], standard: [p("g3c8u2s", genJudge, "S-SAMP-JUDGE")], advanced: [p("g3c8u2a", genJudge, "S-SAMP-JUDGE")] } },
    { id: "g3c8u3", name: "標本調査による推定", emoji: "🧮", desc: "割合で推定", problems: { easy: [p("g3c8u3e", (r) => genEstimate(r, "easy"), "S-SAMP-EST")], standard: [p("g3c8u3s", (r) => genEstimate(r, "standard"), "S-SAMP-EST")], advanced: [p("g3c8u3a", (r) => genEstimate(r, "advanced"), "S-SAMP-EST")] } },
  ],
};
