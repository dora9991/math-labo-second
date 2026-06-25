// ============================================================
// c6_kukan.js — 中1「空間図形」
// 小テスト準拠：立体の種類・特徴／体積／表面積／球
// 円を含む計算は π=3.14 として小数で答える。
// ============================================================
const p = (id, build) => ({ id, build });
const r2 = (n) => Math.round(n * 100) / 100;

export const chapter = {
  id: "c6",
  name: "空間図形",
  emoji: "🧊",
  color: "#a78bfa",
  grade: 1,
  units: [
    {
      id: "k1",
      name: "立体の種類・特徴",
      emoji: "🎲",
      desc: "面・辺・頂点の数",
      problems: {
        easy: [
          p("k1e1", () => ({ q: `立方体の面の数は？`, ans: 6, h1: "正六面体", h2: "6面" })),
          p("k1e2", () => ({ q: `三角錐（四面体）の頂点の数は？`, ans: 4, h1: "底面3+頂点1", h2: "4個" })),
          p("k1e3", (r) => { const n = r(3, 6); return { q: `${n}角柱の面の数は？`, ans: n + 2, h1: `上下2+側面${n}`, h2: `${n + 2}面` }; }),
          p("k1e4", (r) => { const n = r(3, 6); return { q: `${n}角錐の面の数は？`, ans: n + 1, h1: `底面1+側面${n}`, h2: `${n + 1}面` }; }),
        ],
        standard: [
          p("k1s1", (r) => { const n = r(3, 6); return { q: `${n}角柱の頂点の数は？`, ans: 2 * n, h1: `上下に各${n}`, h2: `${2 * n}個` }; }),
          p("k1s2", (r) => { const n = r(3, 6); return { q: `${n}角柱の辺の数は？`, ans: 3 * n, h1: `底面の辺×2+縦${n}`, h2: `${3 * n}本` }; }),
          p("k1s3", (r) => { const n = r(3, 6); return { q: `${n}角錐の辺の数は？`, ans: 2 * n, h1: `底面${n}+側面${n}`, h2: `${2 * n}本` }; }),
          p("k1s4", (r) => { const n = r(3, 6); return { q: `${n}角錐の頂点の数は？`, ans: n + 1, h1: `底面${n}+頂点1`, h2: `${n + 1}個` }; }),
        ],
        advanced: [
          p("k1a1", () => ({ q: `正八面体の頂点数は？（面8・辺12、オイラーの定理）`, ans: 6, h1: "V=E−F+2", h2: "12−8+2=6" })),
          p("k1a2", () => ({ q: `正十二面体の辺の数は？（面12・頂点20）`, ans: 30, h1: "E=F+V−2", h2: "12+20−2=30" })),
          p("k1a3", () => ({ q: `正四面体の辺の数は？（面4・頂点4）`, ans: 6, h1: "E=F+V−2", h2: "4+4−2=6" })),
          p("k1a4", () => ({ q: `正二十面体の頂点の数は？（面20・辺30）`, ans: 12, h1: "V=E−F+2", h2: "30−20+2=12" })),
        ],
      },
    },
    {
      id: "k2",
      name: "体積",
      emoji: "📦",
      desc: "柱・錐の体積",
      problems: {
        easy: [
          p("k2e1", (r) => { const l = r(2, 7); return { q: `1辺${l}cmの立方体の体積は？`, ans: l ** 3, h1: "辺³", h2: `${l}³=${l ** 3}cm³` }; }),
          p("k2e2", (r) => { const a = r(2, 7), b = r(2, 6), c = r(2, 5); return { q: `縦${a}・横${b}・高さ${c}cmの直方体の体積は？`, ans: a * b * c, h1: "縦×横×高さ", h2: `${a * b * c}cm³` }; }),
          p("k2e3", (r) => { const a = r(2, 6), h = r(2, 7); return { q: `1辺${a}cmの正方形を底面とする高さ${h}cmの四角柱の体積は？`, ans: a * a * h, h1: "底面積×高さ", h2: `${a * a}×${h}=${a * a * h}cm³` }; }),
          p("k2e4", (r) => { const base = r(6, 20), h = r(2, 8); return { q: `底面積${base}cm²・高さ${h}cmの角柱の体積は？`, ans: base * h, h1: "底面積×高さ", h2: `${base}×${h}=${base * h}cm³` }; }),
        ],
        standard: [
          p("k2s1", (r) => { const b = r(3, 7), h1 = r(2, 5), H = r(3, 8); return { q: `底面が底辺${b}・高さ${h1}cmの三角形、高さ${H}cmの三角柱の体積は？`, ans: b * h1 / 2 * H, h1: "底面積×高さ", h2: `${b}×${h1}÷2×${H}=${b * h1 / 2 * H}cm³`, skip: (b * h1) % 2 !== 0 }; }),
          p("k2s2", (r) => { const rad = r(2, 5), h = r(2, 7); return { q: `底面の半径${rad}cm・高さ${h}cmの円柱の体積は □π cm³。□は？`, ans: rad * rad * h, h1: "体積=π×r²×h なので□=r²h", h2: `${rad * rad}×${h}=${rad * rad * h}` }; }),
          p("k2s3", (r) => { const a = r(2, 6), b = r(2, 6), H = r(3, 8); return { q: `縦${a}cm・横${b}cmの長方形を底面とする高さ${H}cmの四角柱の体積は？`, ans: a * b * H, h1: "底面積×高さ", h2: `${a * b}×${H}=${a * b * H}cm³` }; }),
          p("k2s4", (r) => { const base = r(4, 9), H = r(3, 9); return { q: `底面積${base}cm²・高さ${H}cmの四角錐の体積は？`, ans: base * H / 3, h1: "底面積×高さ÷3", h2: `${base}×${H}÷3=${base * H / 3}cm³`, skip: (base * H) % 3 !== 0 }; }),
        ],
        advanced: [
          p("k2a1", (r) => { const rad = r(2, 6), h = r(3, 9); return { q: `底面の半径${rad}cm・高さ${h}cmの円錐の体積は □π cm³。□は？`, ans: rad * rad * h / 3, h1: "体積=π×r²×h÷3 なので□=r²h/3", h2: `${rad * rad}×${h}÷3=${rad * rad * h / 3}`, skip: (rad * rad * h) % 3 !== 0 }; }),
          p("k2a2", (r) => { const b = r(3, 6), h1 = r(2, 6), H = r(3, 9); return { q: `底面が底辺${b}・高さ${h1}cmの三角形、高さ${H}cmの三角錐の体積は？`, ans: b * h1 / 2 * H / 3, h1: "底面積×高さ÷3", h2: `=${b * h1 / 2 * H / 3}cm³`, skip: (b * h1) % 2 !== 0 || (b * h1 / 2 * H) % 3 !== 0 }; }),
          p("k2a3", (r) => { const a = r(3, 6), H = r(3, 9); return { q: `1辺${a}cmの正方形を底面とする高さ${H}cmの正四角錐の体積は？`, ans: a * a * H / 3, h1: "底面積×高さ÷3", h2: `${a * a}×${H}÷3=${a * a * H / 3}cm³`, skip: (a * a * H) % 3 !== 0 }; }),
          p("k2a4", (r) => { const l = r(2, 5); return { q: `1辺${l}cmの立方体と同じ体積で、底面積${l * l}cm²の角錐の高さは？`, ans: 3 * l, h1: "角錐の体積=底面積×高さ÷3", h2: `${l * l}×h÷3=${l ** 3} → h=${3 * l}cm` }; }),
        ],
      },
    },
    {
      id: "k3",
      name: "表面積",
      emoji: "🎁",
      desc: "展開図と表面積",
      problems: {
        easy: [
          p("k3e1", (r) => { const l = r(2, 6); return { q: `1辺${l}cmの立方体の表面積は？`, ans: 6 * l * l, h1: "1面×6", h2: `${l}²×6=${6 * l * l}cm²` }; }),
          p("k3e2", (r) => { const a = r(2, 7), b = r(2, 5), c = r(2, 5); return { q: `縦${a}・横${b}・高さ${c}cmの直方体の表面積は？`, ans: 2 * (a * b + b * c + c * a), h1: "2(縦横+横高+高縦)", h2: `=${2 * (a * b + b * c + c * a)}cm²` }; }),
          p("k3e3", (r) => { const l = r(2, 6); return { q: `1辺${l}cmの立方体の1つの面の面積は？`, ans: l * l, h1: "正方形の面積=1辺²", h2: `${l}²=${l * l}cm²` }; }),
          p("k3e4", (r) => { const a = r(2, 7), b = r(2, 7); return { q: `縦${a}cm・横${b}cmの長方形の面積は？`, ans: a * b, h1: "縦×横", h2: `${a}×${b}=${a * b}cm²` }; }),
        ],
        standard: [
          p("k3s1", (r) => { const rad = r(2, 5), h = r(2, 6); return { q: `底面半径${rad}cm・高さ${h}cmの円柱の側面積は □π cm²。□は？`, ans: 2 * rad * h, h1: "側面積=2πrh なので□=2rh", h2: `2×${rad}×${h}=${2 * rad * h}` }; }),
          p("k3s2", (r) => { const rad = r(2, 4), l = r(rad + 1, 7); return { q: `底面半径${rad}cm・母線${l}cmの円錐の側面積は □π cm²。□は？`, ans: rad * l, h1: "側面積=π×r×母線 なので□=r×母線", h2: `${rad}×${l}=${rad * l}` }; }),
          p("k3s3", (r) => { const rad = r(2, 6); return { q: `半径${rad}cmの円（円柱の底面）の面積は □π cm²。□は？`, ans: rad * rad, h1: "円の面積=π×r²", h2: `${rad}²=${rad * rad}` }; }),
          p("k3s4", (r) => { const n = r(3, 6), side = r(2, 5), H = r(3, 7); return { q: `1辺${side}cmの正${n}角形を底面とする高さ${H}cmの角柱の側面積は？`, ans: n * side * H, h1: "側面積=底面の周×高さ", h2: `${n * side}×${H}=${n * side * H}cm²` }; }),
        ],
        advanced: [
          p("k3a1", (r) => { const rad = r(2, 4), h = r(2, 6); return { q: `底面半径${rad}cm・高さ${h}cmの円柱の表面積は □π cm²。□は？`, ans: 2 * rad * rad + 2 * rad * h, h1: "表面積=2πr²+2πrh なので□=2r²+2rh", h2: `2×${rad}²+2×${rad}×${h}=${2 * rad * rad + 2 * rad * h}` }; }),
          p("k3a2", (r) => { const tri = [[2, 3, 240], [2, 4, 180], [2, 5, 144], [2, 6, 120], [2, 8, 90], [3, 4, 270], [3, 5, 216], [3, 6, 180], [4, 5, 288], [4, 6, 240], [4, 8, 180]]; const [rad, l, ang] = tri[r(0, tri.length - 1)]; return { q: `底面半径${rad}cm・母線${l}cmの円錐の展開図で側面の扇形の中心角は？`, ans: ang, h1: "360×(半径/母線)", h2: `360×${rad}/${l}=${ang}°` }; }),
          p("k3a3", (r) => { const rad = r(2, 4), l = r(rad + 1, 7); return { q: `底面半径${rad}cm・母線${l}cmの円錐の表面積（側面+底面）は □π cm²。□は？`, ans: rad * l + rad * rad, h1: "□=r×母線+r²", h2: `${rad}×${l}+${rad}²=${rad * l + rad * rad}` }; }),
          p("k3a4", (r) => { const tri = [[3, 4, 270], [3, 6, 180], [2, 3, 240], [4, 6, 240], [5, 6, 300], [2, 4, 180]]; const [rad, l, ang] = tri[r(0, tri.length - 1)]; return { q: `底面半径${rad}cm・母線${l}cmの円錐の展開図で、側面の扇形の中心角は？`, ans: ang, h1: "360×(半径/母線)", h2: `360×${rad}/${l}=${ang}°` }; }),
        ],
      },
    },
    {
      id: "k4",
      name: "球",
      emoji: "🔵",
      desc: "球の体積・表面積",
      problems: {
        easy: [
          p("k4e1", (r) => { const rad = r(2, 6); return { q: `半径${rad}cmの球の表面積は □π cm²。□は？`, ans: 4 * rad * rad, h1: "表面積=4πr² なので□=4r²", h2: `4×${rad}²=${4 * rad * rad}` }; }),
          p("k4e2", (r) => { const rad = r(1, 3) * 3; return { q: `半径${rad}cmの球の体積は □π cm³。□は？`, ans: 4 / 3 * rad ** 3, h1: "体積=(4/3)πr³ なので□=(4/3)r³", h2: `4÷3×${rad}³=${4 / 3 * rad ** 3}`, skip: (4 * rad ** 3) % 3 !== 0 }; }),
          p("k4e3", (r) => { const d = r(2, 5); return { q: `直径${2 * d}cmの球の表面積は □π cm²。□は？`, ans: 4 * d * d, h1: `半径=直径÷2=${d}cm、□=4r²`, h2: `4×${d}²=${4 * d * d}` }; }),
          p("k4e4", (r) => { const rad = r(2, 5); return { q: `半径${rad}cmの球を中心を通る平面で切った切り口（円）の面積は □π cm²。□は？`, ans: rad * rad, h1: "切り口は半径rの円→π×r²", h2: `${rad}²=${rad * rad}` }; }),
        ],
        standard: [
          p("k4s1", (r) => { const rad = r(1, 2) * 3; return { q: `半径${rad}cmの半球の体積は □π cm³。□は？`, ans: 2 / 3 * rad ** 3, h1: "半球=(2/3)r³×π なので□=(2/3)r³", h2: `2÷3×${rad}³=${2 / 3 * rad ** 3}`, skip: (2 * rad ** 3) % 3 !== 0 }; }),
          p("k4s2", () => ({ q: `同じ底面・高さの円柱と円錐。体積比は 円柱:円錐 = □:1 の □は？`, ans: 3, h1: "円柱は円錐の3倍", h2: "3" })),
          p("k4s3", (r) => { const rad = r(2, 5); return { q: `半径${rad}cmの半球の曲面部分の面積は □π cm²。□は？`, ans: 2 * rad * rad, h1: "球の表面積の半分=2πr²", h2: `2×${rad}²=${2 * rad * rad}` }; }),
          p("k4s4", (r) => { const rad = r(2, 5); return { q: `半径${rad}cmの球の大円（中心を通る切り口の円）の面積は □π cm²。□は？`, ans: rad * rad, h1: "大円は半径rの円→π×r²", h2: `${rad}²=${rad * rad}` }; }),
        ],
        advanced: [
          p("k4a1", (r) => { const rad = r(2, 4); return { q: `半径${rad}cmの球と同体積の円錐。底面半径が${rad}cmのとき高さは？`, ans: 4 * rad, h1: "4πr³/3=πr²h/3 → h=4r", h2: `${4 * rad}cm` }; }),
          p("k4a2", (r) => { const rad = r(2, 5); return { q: `半径${rad}cmの半球の表面積（曲面+底面）は □π cm²。□は？`, ans: 3 * rad * rad, h1: "曲面2πr²+底面πr²=3πr² なので□=3r²", h2: `3×${rad}²=${3 * rad * rad}` }; }),
          p("k4a3", (r) => { const rad = r(2, 5); return { q: `半径${rad}cmの球がちょうど入る円柱（底面半径${rad}cm・高さ${2 * rad}cm）の体積は □π cm³。□は？`, ans: 2 * rad ** 3, h1: "円柱=π×r²×h、h=2r", h2: `${rad}²×${2 * rad}=${2 * rad ** 3}` }; }),
          p("k4a4", (r) => { const rad = r(2, 5); return { q: `半径${rad}cmの球と、同じ半径の半球がある。半球の体積は球の体積の何分の1か（分母を答えよ）？`, ans: 2, h1: "半球は球を半分に切ったもの", h2: "分母は2" }; }),
        ],
      },
    },
  ],
};
