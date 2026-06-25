// ============================================================
// c4_hirei.js — 中1「比例と反比例」
// 小テスト準拠：比例の式／反比例の式／座標・グラフ／変域／利用
// ============================================================
const p = (id, build) => ({ id, build });

export const chapter = {
  id: "c4",
  name: "比例と反比例",
  emoji: "📈",
  color: "#38bdf8",
  grade: 1,
  units: [
    {
      id: "h1",
      name: "比例",
      emoji: "📏",
      desc: "y=ax の式と値",
      problems: {
        easy: [
          p("h1e1", (r) => { const a = r(2, 8), x = r(1, 6); return { q: `y=${a}x で x=${x} のとき y=？`, ans: a * x, h1: "代入", h2: `${a}×${x}=${a * x}` }; }),
          p("h1e2", (r) => { const a = r(2, 8), y = r(2, 8); return { q: `y=${a}x で y=${a * y} のとき x=？`, ans: y, h1: `${a}x=${a * y}`, h2: `x=${y}` }; }),
          p("h1e3", (r) => { const a = r(2, 6), x = r(1, 5); return { q: `y=axでx=${x}のときy=${a * x}。aは？`, ans: a, h1: "a=y÷x", h2: `${a * x}÷${x}=${a}` }; }),
          p("h1e4", (r) => { const a = r(2, 8), x = r(1, 6); return { q: `y=${a}x で x=-${x} のとき y=？`, ans: -a * x, h1: "負の数を代入", h2: `${a}×(-${x})=${-a * x}` }; }),
        ],
        standard: [
          p("h1s1", (r) => { const a = r(2, 6), x1 = r(1, 3), x2 = r(4, 7); return { q: `y=${a}x で x が${x1}→${x2}に増えたときの y の増加量は？`, ans: a * (x2 - x1), h1: "a×xの増加量", h2: `${a}×${x2 - x1}=${a * (x2 - x1)}` }; }),
          p("h1s2", (r) => { const a = r(2, 7); return { q: `y は x に比例し x=1 で y=${a}。x=-3 のとき y=？`, ans: -3 * a, h1: `y=${a}x`, h2: `${a}×(-3)=${-3 * a}` }; }),
          p("h1s3", (r) => { const a = r(2, 6); return { q: `y は x に比例し x=2 のとき y=${2 * a}。比例定数 a は？`, ans: a, h1: "a=y÷x", h2: `${2 * a}÷2=${a}` }; }),
          p("h1s4", (r) => { const a = r(2, 6); return { q: `y=${a}x で y=-${a * 3} のとき x=？`, ans: -3, h1: `${a}x=-${a * 3}`, h2: `x=-3` }; }),
        ],
        advanced: [
          p("h1a1", (r) => { const a = r(2, 5); return { q: `y=${a}x で x が2倍になると y は何倍？`, ans: 2, h1: "比例はxが2倍→yも2倍", h2: "2倍" }; }),
          p("h1a2", (r) => { const a = r(2, 5), x = r(2, 4), d = r(1, 3); return { q: `y=${a}x で x が${x}→${x + d} のときの y の変化量は？`, ans: a * d, h1: "a×変化量", h2: `${a}×${d}=${a * d}` }; }),
          p("h1a3", (r) => { const a = r(2, 5); return { q: `y=${a}x で x が3倍になると y は何倍？`, ans: 3, h1: "比例はxが3倍→yも3倍", h2: "3倍" }; }),
          p("h1a4", (r) => { const a = r(2, 5), x = r(2, 4); return { q: `y=${a}x のグラフは原点と点(${x}, □)を通る。□は？`, ans: a * x, h1: `y=${a}×${x}`, h2: `□=${a * x}` }; }),
        ],
      },
    },
    {
      id: "h2",
      name: "反比例",
      emoji: "📉",
      desc: "y=a/x の式と値",
      problems: {
        easy: [
          p("h2e1", (r) => { const a = r(2, 5) * r(2, 4), x = r(2, 5); return { q: `y=${a}/x で x=${x} のとき y=？`, ans: a / x, h1: "代入", h2: `${a}÷${x}=${a / x}`, skip: a % x !== 0 }; }),
          p("h2e2", (r) => { const x = r(2, 5), y = r(2, 5); return { q: `x×y=${x * y} のとき x=${x} なら y=？`, ans: y, h1: `y=${x * y}÷x`, h2: `=${y}` }; }),
          p("h2e3", (r) => { const a = r(2, 4) * r(2, 4), x = r(2, 6); return { q: `y=${a}/x で x=${x} のとき y=？`, ans: a / x, h1: "代入", h2: `${a}÷${x}=${a / x}`, skip: a % x !== 0 }; }),
          p("h2e4", (r) => { const x = r(2, 6), y = r(2, 5); return { q: `x×y=${x * y} のとき y=${y} なら x=？`, ans: x, h1: `x=${x * y}÷y`, h2: `=${x}` }; }),
        ],
        standard: [
          p("h2s1", (r) => { const a = r(2, 4) * r(3, 5); return { q: `y は x に反比例し x=2 で y=${a / 2}。比例定数は？`, ans: a, h1: "a=x×y", h2: `2×${a / 2}=${a}`, skip: a % 2 !== 0 }; }),
          p("h2s2", (r) => { const x = r(2, 4), y = r(2, 4); return { q: `点(${x},-${y})を通る反比例 y=a/x の a は？`, ans: -x * y, h1: "a=x×y", h2: `${x}×(-${y})=-${x * y}` }; }),
          p("h2s3", (r) => { const x = r(2, 5), y = r(2, 6); return { q: `y は x に反比例し x=${x} のとき y=${y}。比例定数は？`, ans: x * y, h1: "a=x×y", h2: `${x}×${y}=${x * y}` }; }),
          p("h2s4", (r) => { const x = r(2, 5), y = r(2, 5); return { q: `反比例 y=a/x が点(${x},${y})を通るとき a は？`, ans: x * y, h1: "a=x×y", h2: `${x}×${y}=${x * y}` }; }),
        ],
        advanced: [
          p("h2a1", (r) => { const a = r(2, 4) * r(2, 5); return { q: `y=${a}/x で 1≦x≦${a} のとき y の最大値は？`, ans: a, h1: "xが小さいほどyが大きい", h2: `x=1 で y=${a}` }; }),
          p("h2a2", (r) => { const a = r(2, 5) * r(2, 4), x = r(2, 5); return { q: `y=${a}/x のグラフで x=${x} と x=-${x} の y 座標の和は？`, ans: 0, h1: "原点対称", h2: "打ち消し合って0", skip: a % x !== 0 }; }),
          p("h2a3", (r) => { const a = r(2, 5) * r(2, 4); return { q: `y=${a}/x で x が2倍になると y は何分の1になる？（分母を答えよ）`, ans: 2, h1: "反比例はxが2倍→yは1/2", h2: "分母は2" }; }),
          p("h2a4", (r) => { const a = r(2, 4) * r(2, 5), x = r(2, 4); return { q: `y=${a}/x で x=${x} のときと x=${2 * x} のときの y の差は？`, ans: a / x - a / (2 * x), h1: `${a / x}と${a / (2 * x)}`, h2: `差=${a / x - a / (2 * x)}`, skip: a % (2 * x) !== 0 }; }),
        ],
      },
    },
    {
      id: "h3",
      name: "座標とグラフ",
      emoji: "📊",
      desc: "象限・グラフの読み取り",
      problems: {
        easy: [
          p("h3e1", (r) => { const x = r(1, 5), y = r(1, 5); return { q: `点(${x},${y})は第何象限？（数字で）`, ans: 1, h1: "x>0,y>0", h2: "第1象限" }; }),
          p("h3e2", (r) => { const x = r(1, 5), y = r(1, 5); return { q: `点(-${x},-${y})は第何象限？（数字で）`, ans: 3, h1: "x<0,y<0", h2: "第3象限" }; }),
          p("h3e3", (r) => { const x = r(1, 5), y = r(1, 5); return { q: `点(-${x},${y})は第何象限？（数字で）`, ans: 2, h1: "x<0,y>0", h2: "第2象限" }; }),
          p("h3e4", (r) => { const x = r(1, 5), y = r(1, 5); return { q: `点(${x},-${y})は第何象限？（数字で）`, ans: 4, h1: "x>0,y<0", h2: "第4象限" }; }),
        ],
        standard: [
          p("h3s1", (r) => { const a = r(2, 6); return { q: `y=${a}x のグラフ上で y=${2 * a} となる x は？`, ans: 2, h1: `${a}x=${2 * a}`, h2: "x=2" }; }),
          p("h3s2", (r) => { const a = r(2, 5) * r(2, 4), x = r(2, 4); return { q: `y=${a}/x のグラフ上で x=${x} の点の y 座標は？`, ans: a / x, h1: `y=${a}÷${x}`, h2: `=${a / x}`, skip: a % x !== 0 }; }),
          p("h3s3", (r) => { const a = r(2, 6); return { q: `y=-${a}x のグラフ上で x=2 のとき y=？`, ans: -2 * a, h1: `-${a}×2`, h2: `=${-2 * a}` }; }),
          p("h3s4", (r) => { const a = r(2, 6); return { q: `y=${a}x のグラフ上で y=-${3 * a} となる x は？`, ans: -3, h1: `${a}x=-${3 * a}`, h2: "x=-3" }; }),
        ],
        advanced: [
          p("h3a1", (r) => { const a = r(2, 5), b = r(2, 5); return { q: `y=${a}x と y=${b}x で x=4 のときの y の差は？`, ans: Math.abs(a - b) * 4, h1: `${a * 4}と${b * 4}`, h2: `差=${Math.abs(a - b) * 4}` }; }),
          p("h3a2", (r) => { const a = r(2, 4) * r(2, 4); return { q: `y=${a}/x で x=2 の点と x=4 の点の y 座標の差は？`, ans: Math.abs(a / 2 - a / 4), h1: `${a / 2}と${a / 4}`, h2: `差=${Math.abs(a / 2 - a / 4)}`, skip: a % 4 !== 0 }; }),
          p("h3a3", (r) => { const a = r(2, 5); return { q: `原点と点(2, ${2 * a})を通る比例のグラフ y=□x の □は？`, ans: a, h1: "a=y÷x", h2: `${2 * a}÷2=${a}` }; }),
          p("h3a4", (r) => { const a = r(2, 5); return { q: `y=${a}x のグラフと直線 x=5 の交点の y 座標は？`, ans: 5 * a, h1: `y=${a}×5`, h2: `=${5 * a}` }; }),
        ],
      },
    },
    {
      id: "h4",
      name: "変域",
      emoji: "🔍",
      desc: "x の変域と y の変域",
      problems: {
        easy: [
          p("h4e1", (r) => { const a = r(2, 5), x1 = r(1, 3), x2 = r(4, 6); return { q: `y=${a}x で ${x1}≦x≦${x2} のとき y の最大値は？`, ans: a * x2, h1: "xが大きいほどy大", h2: `${a}×${x2}=${a * x2}` }; }),
          p("h4e2", (r) => { const a = r(2, 5), x1 = r(1, 3), x2 = r(4, 6); return { q: `y=${a}x で ${x1}≦x≦${x2} のとき y の最小値は？`, ans: a * x1, h1: "xが小さいほどy小", h2: `${a}×${x1}=${a * x1}` }; }),
          p("h4e3", (r) => { const a = r(2, 5), x1 = r(1, 3), x2 = r(4, 6); return { q: `y=${a}x で ${x1}≦x≦${x2} のとき y の変域は ${a * x1}≦y≦□。□は？`, ans: a * x2, h1: "最大はx最大のとき", h2: `${a}×${x2}=${a * x2}` }; }),
          p("h4e4", (r) => { const a = r(2, 5), x2 = r(2, 5); return { q: `y=${a}x で 0≦x≦${x2} のとき y の最大値は？`, ans: a * x2, h1: "xが大きいほどy大", h2: `${a}×${x2}=${a * x2}` }; }),
        ],
        standard: [
          p("h4s1", (r) => { const a = r(2, 5), x1 = r(1, 3), x2 = r(4, 6); return { q: `y=-${a}x で ${x1}≦x≦${x2} のとき y の最大値は？`, ans: -a * x1, h1: "傾き負→xが小さいほどy大", h2: `-${a}×${x1}=${-a * x1}` }; }),
          p("h4s2", (r) => { const a = r(2, 5) * r(2, 4), x1 = r(2, 4), x2 = r(5, 6); return { q: `y=${a}/x で ${x1}≦x≦${x2} のとき y の最大値は？`, ans: a / x1, h1: "反比例はx小でy大", h2: `x=${x1} で y=${a / x1}`, skip: a % x1 !== 0 }; }),
          p("h4s3", (r) => { const a = r(2, 5), x1 = r(1, 3), x2 = r(4, 6); return { q: `y=-${a}x で ${x1}≦x≦${x2} のとき y の最小値は？`, ans: -a * x2, h1: "傾き負→xが大きいほどy小", h2: `-${a}×${x2}=${-a * x2}` }; }),
          p("h4s4", (r) => { const a = r(2, 5) * r(2, 4), x1 = r(2, 4), x2 = r(5, 6); return { q: `y=${a}/x で ${x1}≦x≦${x2} のとき y の最小値は？`, ans: a / x2, h1: "反比例はx大でy小", h2: `x=${x2} で y=${a / x2}`, skip: a % x2 !== 0 }; }),
        ],
        advanced: [
          p("h4a1", (r) => { const a = r(2, 4), x1 = -r(1, 3), x2 = r(1, 3); return { q: `y=${a}x で ${x1}≦x≦${x2} のとき y の最小値は？`, ans: a * x1, h1: "最小はx最小のとき", h2: `${a}×(${x1})=${a * x1}` }; }),
          p("h4a2", (r) => { const a = r(2, 5), x1 = r(1, 3), x2 = r(4, 6); return { q: `y=${a}x で ${x1}≦x≦${x2} のとき y の変域の幅（最大−最小）は？`, ans: a * (x2 - x1), h1: `${a * x2}-${a * x1}`, h2: `${a * (x2 - x1)}` }; }),
          p("h4a3", (r) => { const a = r(2, 4), x1 = -r(1, 3), x2 = r(1, 3); return { q: `y=${a}x で ${x1}≦x≦${x2} のとき y の最大値は？`, ans: a * x2, h1: "最大はx最大のとき", h2: `${a}×${x2}=${a * x2}` }; }),
          p("h4a4", (r) => { const a = r(2, 4), x1 = -r(2, 4), x2 = r(2, 4); return { q: `y=-${a}x で ${x1}≦x≦${x2} のとき y の最大値は？`, ans: -a * x1, h1: "傾き負→x最小のときy最大", h2: `-${a}×(${x1})=${-a * x1}` }; }),
        ],
      },
    },
    {
      id: "h5",
      name: "比例・反比例の利用",
      emoji: "🧮",
      desc: "文章題・実生活",
      problems: {
        easy: [
          p("h5e1", (r) => { const v = r(2, 6) * 10, t = r(2, 5); return { q: `時速${v}kmで${t}時間進むと何km？`, ans: v * t, h1: "距離=速さ×時間", h2: `${v}×${t}=${v * t}km` }; }),
          p("h5e2", (r) => { const w = r(2, 6) * 10, n = r(2, 6); return { q: `水${w}Lを${n}人で等分すると1人何L？`, ans: w / n, h1: `${w}÷${n}`, h2: `=${w / n}L`, skip: w % n !== 0 }; }),
          p("h5e3", (r) => { const v = r(2, 6) * 10, t = r(2, 5); return { q: `${v * t}kmを${t}時間で進むときの時速は？`, ans: v, h1: "速さ=距離÷時間", h2: `${v * t}÷${t}=${v}km/h` }; }),
          p("h5e4", (r) => { const w = r(2, 8), n = r(2, 8); return { q: `1個${w}円のあめを${n}個買うと代金は？`, ans: w * n, h1: "代金=単価×個数", h2: `${w}×${n}=${w * n}円` }; }),
        ],
        standard: [
          p("h5s1", (r) => { const total = r(4, 8) * r(3, 5), x = r(2, 4); return { q: `${total}Lの水を毎分${x}Lずつ使うと何分でなくなる？`, ans: total / x, h1: "y=総量/x（反比例）", h2: `${total}÷${x}=${total / x}分`, skip: total % x !== 0 }; }),
          p("h5s2", (r) => { const a = r(3, 6); return { q: `くぎ${a}本の重さが${9 * a}g。180g では何本？`, ans: 20, h1: "1本9g", h2: `180÷9=20本` }; }),
          p("h5s3", (r) => { const w = r(2, 6); return { q: `針金5mの重さが${5 * w}g。同じ針金8mの重さは？`, ans: 8 * w, h1: `1mで${w}g`, h2: `${w}×8=${8 * w}g` }; }),
          p("h5s4", (r) => { const x = r(2, 5), n = r(4, 8); return { q: `${x * n}個のあめを1人${x}個ずつ配ると何人に配れる？`, ans: n, h1: "人数=総数÷1人分", h2: `${x * n}÷${x}=${n}人` }; }),
        ],
        advanced: [
          p("h5a1", (r) => { const v = r(3, 5) * 10, d = r(2, 4) * v; return { q: `${d}kmを時速${v}kmで進むと何時間？さらに半分の地点まで何時間？`, ans: d / v / 2, h1: "全体の半分の時間", h2: `${d / v / 2}時間`, skip: d % v !== 0 || (d / v) % 2 !== 0 }; }),
          p("h5a2", (r) => { const a = r(2, 4), b = r(2, 4); return { q: `y=${a}x と y=${b}/x が交わる点の x×y の値は？`, ans: b, h1: "交点で x×y=x×(a x)=a x²=b", h2: `=${b}` }; }),
          p("h5a3", (r) => { const a = r(2, 5); return { q: `歯数12の歯車Aと歯数${4 * a}の歯車Bがかみ合う。Aが${a}回転するときBは何回転？`, ans: 3, h1: "かみ合う歯車は 歯数×回転数 が一定", h2: `12×${a}÷${4 * a}=3回転` }; }),
          p("h5a4", (r) => { const a = r(2, 4), b = r(2, 4); return { q: `y=${a}x と y=${a * b * b}/x が交わる点の x 座標(正)は？`, ans: b, h1: `${a}x=${a * b * b}/x → x²=${b * b}`, h2: `x=${b}` }; }),
        ],
      },
    },
  ],
};
