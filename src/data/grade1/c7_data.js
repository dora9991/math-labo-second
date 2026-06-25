// ============================================================
// c7_data.js — 中1「データの活用」
// 小テスト準拠：代表値（平均・中央値・最頻値）／度数分布・相対度数／確率（相対度数）
// ============================================================
const p = (id, build) => ({ id, build });
const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;

export const chapter = {
  id: "c7",
  name: "データの活用",
  emoji: "📊",
  color: "#34d399",
  grade: 1,
  units: [
    {
      id: "d1",
      name: "代表値",
      emoji: "📌",
      desc: "平均・中央値・最頻値",
      problems: {
        easy: [
          p("d1e1", (r) => { const v = [r(1, 9), r(1, 9), r(1, 9), r(1, 9), r(1, 9)]; const s = v.reduce((a, b) => a + b, 0); return { q: `データ [${v.join(",")}] の合計は？`, ans: s, h1: "全部足す", h2: `${s}` }; }),
          p("d1e2", (r) => { const v = [r(1, 4), r(2, 5), r(5, 7), r(6, 8), r(7, 9)].sort((a, b) => a - b); return { q: `5個のデータ [${v.join(",")}] の中央値は？`, ans: v[2], h1: "真ん中の3番目", h2: `${v[2]}` }; }),
          p("d1e3", (r) => { const mode = r(3, 7); const v = [mode, mode, r(1, mode - 1), r(mode + 1, 9), r(1, 9)].sort((a, b) => a - b); return { q: `データ [${v.join(",")}] の最頻値は？`, ans: mode, h1: "一番多い値", h2: `${mode}` }; }),
          p("d1e4", (r) => { const v = [r(1, 5), r(2, 7), r(3, 8), r(5, 9)]; const mx = Math.max(...v), mn = Math.min(...v); return { q: `データ [${v.join(",")}] の最大値は？`, ans: mx, h1: "いちばん大きい値", h2: `${mx}` }; }),
        ],
        standard: [
          p("d1s1", (r) => { const v = [r(1, 5), r(2, 6), r(3, 7), r(4, 8), r(5, 9)]; const s = v.reduce((a, b) => a + b, 0); return { q: `データ [${v.join(",")}] の平均値は？（小数1桁）`, ans: r1(s / v.length), h1: "合計÷個数", h2: `${s}÷${v.length}=${r1(s / v.length)}` }; }),
          p("d1s2", (r) => { const v = [r(1, 3), r(2, 4), r(4, 6), r(5, 7), r(6, 8), r(7, 9)].sort((a, b) => a - b); return { q: `6個のデータ [${v.join(",")}] の中央値は？`, ans: (v[2] + v[3]) / 2, h1: "3番目と4番目の平均", h2: `(${v[2]}+${v[3]})÷2=${(v[2] + v[3]) / 2}` }; }),
          p("d1s3", (r) => { const v = [r(1, 5), r(2, 6), r(3, 7), r(4, 8), r(5, 9)]; const max = Math.max(...v), min = Math.min(...v); return { q: `データ [${v.join(",")}] の範囲（最大−最小）は？`, ans: max - min, h1: "最大−最小", h2: `${max}-${min}=${max - min}` }; }),
          p("d1s4", (r) => { const v = [r(2, 4), r(3, 5), r(5, 7), r(6, 8)]; const s = v.reduce((a, b) => a + b, 0); return { q: `データ [${v.join(",")}] の平均値は？（小数1桁）`, ans: r1(s / v.length), h1: "合計÷個数", h2: `${s}÷${v.length}=${r1(s / v.length)}` }; }),
        ],
        advanced: [
          p("d1a1", (r) => { const n = r(4, 7), avg = r(5, 9); const known = Array.from({ length: n - 1 }, () => r(avg - 3, avg + 3)); const last = n * avg - known.reduce((a, b) => a + b, 0); return { q: `${n}個の平均が${avg}。${n - 1}個が[${known.join(",")}]のとき残り1つは？`, ans: last, h1: `合計=${n}×${avg}=${n * avg}`, h2: `残り=${n * avg}-${known.reduce((a, b) => a + b, 0)}=${last}` }; }),
          p("d1a2", (r) => { const n = r(4, 7), avg = r(5, 9), extra = r(avg + 1, avg + 5); return { q: `平均${avg}・${n}人のデータに${extra}が加わった。新しい平均は？（小数1桁）`, ans: r1((avg * n + extra) / (n + 1)), h1: `新合計=${avg * n}+${extra}`, h2: `÷${n + 1}=${r1((avg * n + extra) / (n + 1))}` }; }),
          p("d1a3", (r) => { const base = r(3, 6); const v = [base, base + 2, base + 4, base + 6, base + 8]; return { q: `データ [${v.join(",")}] の平均値は？`, ans: base + 4, h1: "等間隔のデータの平均はまん中の値", h2: `${base + 4}` }; }),
          p("d1a4", (r) => { const n = r(5, 8), avg = r(4, 8), out = avg + 2; return { q: `${n}人の平均が${avg}。${out}点の1人が抜けると、残り${n - 1}人の平均は？（小数1桁）`, ans: r1((avg * n - out) / (n - 1)), h1: `残り合計=${avg * n}-${out}`, h2: `÷${n - 1}=${r1((avg * n - out) / (n - 1))}` }; }),
        ],
      },
    },
    {
      id: "d2",
      name: "度数分布・相対度数",
      emoji: "📋",
      desc: "階級・相対度数・累積",
      problems: {
        easy: [
          p("d2e1", (r) => { const a = r(2, 6), b = r(a + 1, 9); return { q: `階級「${a}以上${b}未満」の階級の幅は？`, ans: b - a, h1: "上−下", h2: `${b}-${a}=${b - a}` }; }),
          p("d2e2", (r) => { const f = [r(2, 5), r(3, 7), r(2, 5), r(1, 4)]; const t = f.reduce((a, b) => a + b, 0); return { q: `度数が[${f.join(",")}]のとき総度数は？`, ans: t, h1: "全部足す", h2: `${t}` }; }),
          p("d2e3", (r) => { const a = r(0, 5) * 10; return { q: `階級「${a}以上${a + 10}未満」の階級値（まん中の値）は？`, ans: a + 5, h1: "階級値=(上端+下端)÷2", h2: `(${a}+${a + 10})÷2=${a + 5}` }; }),
          p("d2e4", (r) => { const f = [r(3, 6), r(4, 8), r(2, 5), r(1, 3)]; const t = f.reduce((a, b) => a + b, 0); return { q: `度数が[${f.join(",")}]のとき総度数は？`, ans: t, h1: "度数を全部足す", h2: `${t}` }; }),
        ],
        standard: [
          p("d2s1", (r) => { const total = 50, f = r(5, 20); return { q: `総度数${total}で、ある階級の度数が${f}。相対度数は？（小数2桁）`, ans: r2(f / total), h1: "度数÷総度数", h2: `${f}÷${total}=${r2(f / total)}` }; }),
          p("d2s2", (r) => { const total = r(20, 50), rel = r(1, 4) * 0.1; return { q: `総度数${total}で相対度数が${rel}の階級の度数は？`, ans: Math.round(rel * total), h1: "相対度数×総度数", h2: `${rel}×${total}=${Math.round(rel * total)}` }; }),
          p("d2s3", (r) => { const f1 = r(3, 8), f2 = r(4, 9), f3 = r(2, 6); return { q: `度数が下の階級から ${f1},${f2},${f3} のとき、2番目の階級までの累積度数は？`, ans: f1 + f2, h1: "下から順に足す", h2: `${f1}+${f2}=${f1 + f2}` }; }),
          p("d2s4", (r) => { const total = 50, f = r(10, 20); return { q: `総度数${total}人で度数${f}人の階級の割合は何％？`, ans: f * 2, h1: "度数÷総度数×100", h2: `${f}÷${total}×100=${f * 2}%` }; }),
        ],
        advanced: [
          p("d2a1", (r) => { const total = 50, f1 = r(8, 12), f2 = r(20, 28); return { q: `総度数${total}人。10分未満が${f1}人、30分未満の累積が${f1 + f2}人のとき、30分未満の割合は？（％）`, ans: Math.round((f1 + f2) / total * 100), h1: "累積度数÷総度数×100", h2: `${Math.round((f1 + f2) / total * 100)}%` }; }),
          p("d2a2", (r) => { const total = r(20, 40); const rels = [r(1, 3) * 0.1, r(1, 3) * 0.1]; const remain = r2(1 - rels[0] - rels[1]); return { q: `相対度数が${r2(rels[0])}と${r2(rels[1])}の2階級。残りの相対度数の合計は？`, ans: remain, h1: "全相対度数の和=1", h2: `1-${r2(rels[0])}-${r2(rels[1])}=${remain}` }; }),
          p("d2a3", (r) => { const total = 50, f1 = r(5, 10), f2 = r(10, 15); return { q: `総度数${total}人。度数が下から ${f1},${f2},… のとき、2番目の階級までの累積相対度数は？（小数2桁）`, ans: r2((f1 + f2) / total), h1: "累積度数÷総度数", h2: `(${f1}+${f2})÷${total}=${r2((f1 + f2) / total)}` }; }),
          p("d2a4", (r) => { const total = r(2, 4) * 10, rel = r(2, 5) * 0.1; return { q: `総度数${total}で相対度数${r2(rel)}の階級の度数は？`, ans: Math.round(rel * total), h1: "度数=相対度数×総度数", h2: `${r2(rel)}×${total}=${Math.round(rel * total)}` }; }),
        ],
      },
    },
    {
      id: "d3",
      name: "確率（相対度数）",
      emoji: "🎲",
      desc: "起こりやすさを相対度数で",
      problems: {
        easy: [
          p("d3e1", (r) => { const n = r(2, 5) * 100, k = Math.round(n * 0.4); return { q: `${n}回投げて表が${k}回出た。表の相対度数は？（小数2桁）`, ans: r2(k / n), h1: "回数÷全体", h2: `${k}÷${n}=${r2(k / n)}` }; }),
          p("d3e2", () => ({ q: `50年間で3月5日が晴れたのは22日。晴れの相対度数は？（小数2桁）`, ans: 0.44, h1: "22÷50", h2: "0.44" })),
          p("d3e3", (r) => { const n = r(2, 5) * 100, k = Math.round(n * 0.6); return { q: `${n}回投げて表が${k}回出た。表の相対度数は？（小数2桁）`, ans: r2(k / n), h1: "回数÷全体", h2: `${k}÷${n}=${r2(k / n)}` }; }),
          p("d3e4", (r) => { const n = r(2, 4) * 50, k = Math.round(n * 0.3); return { q: `${n}回中${k}回成功した。成功の相対度数は？（小数2桁）`, ans: r2(k / n), h1: "成功÷全体", h2: `${k}÷${n}=${r2(k / n)}` }; }),
        ],
        standard: [
          p("d3s1", () => ({ q: `さいころで偶数が出る相対度数（理論値）は？（小数2桁）`, ans: 0.5, h1: "3÷6", h2: "0.50" })),
          p("d3s2", (r) => { const n = r(3, 8) * 100, k = Math.round(n * 0.25); return { q: `${n}回中${k}回当たり。当たりの相対度数は？（小数2桁）`, ans: r2(k / n), h1: "k÷n", h2: `=${r2(k / n)}` }; }),
          p("d3s3", () => ({ q: `さいころで3以下の目が出る相対度数（理論値）は？（小数2桁）`, ans: 0.5, h1: "3÷6", h2: "0.50" })),
          p("d3s4", (r) => { const n = r(4, 8) * 100, k = Math.round(n * 0.2); return { q: `${n}回中${k}回当たり。当たりの相対度数は？（小数2桁）`, ans: r2(k / n), h1: "当たり÷全体", h2: `${k}÷${n}=${r2(k / n)}` }; }),
        ],
        advanced: [
          p("d3a1", (r) => { const n = r(5, 10) * 100, p1 = r(35, 45); const k = Math.round(n * p1 / 100); return { q: `${n}回投げて上向きが${k}回。相対度数は？（小数3桁）`, ans: Math.round(k / n * 1000) / 1000, h1: "k÷n（小数3桁）", h2: `=${Math.round(k / n * 1000) / 1000}` }; }),
          p("d3a2", () => ({ q: `相対度数が一定の0.38に近づいた。1000回投げたとき、上向きはおよそ何回と予想？`, ans: 380, h1: "1000×0.38", h2: "380回" })),
          p("d3a3", (r) => { const ks = [0.45, 0.52, 0.48, 0.55]; const k = ks[r(0, ks.length - 1)]; return { q: `ある画びょうの上向きの相対度数が${k}に近づいた。2000回投げると上向きはおよそ何回？`, ans: Math.round(k * 2000), h1: "2000×相対度数", h2: `2000×${k}=${Math.round(k * 2000)}回` }; }),
          p("d3a4", (r) => { const ks = [0.3, 0.4, 0.25, 0.6]; const k = ks[r(0, ks.length - 1)]; const n = r(3, 6) * 1000; return { q: `相対度数が${k}に近づいた。${n}回でおよそ何回起こると予想？`, ans: Math.round(k * n), h1: "回数×相対度数", h2: `${n}×${k}=${Math.round(k * n)}回` }; }),
        ],
      },
    },
  ],
};
