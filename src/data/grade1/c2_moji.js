// ============================================================
// c2_moji.js — 中1「文字の式」
// 小テスト準拠：表し方／式の値（代入）／加減／乗除（分配）／四則混合
// 文字式は答えが式になるため、「係数」「定数項」「式の値」など数値で答える形にしている。
// ============================================================
const p = (id, build) => ({ id, build });

export const chapter = {
  id: "c2",
  name: "文字の式",
  emoji: "🔤",
  color: "#34d399",
  grade: 1,
  units: [
    {
      id: "v1",
      name: "文字式の表し方",
      emoji: "📝",
      desc: "積・商の表し方・係数",
      problems: {
        easy: [
          p("v1e1", (r) => { const a = r(2, 9); return { q: `a×${a} を文字式で表すと ${a}a。係数は？`, ans: a, h1: "数を文字の前に書く", h2: `係数は${a}` }; }),
          p("v1e2", (r) => { const a = r(2, 9); return { q: `x×(-${a}) を文字式にすると -${a}x。係数は？`, ans: -a, h1: "符号も含めて前に出す", h2: `係数は-${a}` }; }),
          p("v1e3", (r) => { const a = r(2, 8); return { q: `x÷${a} を分数で表すと x/□。□は？`, ans: a, h1: "a÷b=a/b", h2: `x÷${a}=x/${a}` }; }),
          p("v1e4", () => ({ q: `(-1)×x を文字式にすると -x。係数は？`, ans: -1, h1: "1は省略する", h2: "係数は-1" })),
          p("v1e5", (r) => { const a = r(2, 9); return { q: `a×a×${a} を文字式で表すと ${a}a²。係数は？`, ans: a, h1: "同じ文字の積は累乗", h2: `係数は${a}` }; }),
        ],
        standard: [
          p("v1s1", (r) => { const a = r(2, 6), b = r(2, 6); return { q: `${a}a+${b}a を整理すると □a。□は？`, ans: a + b, h1: "同類項は係数を足す", h2: `${a}+${b}=${a + b}` }; }),
          p("v1s2", (r) => { const a = r(3, 9), b = r(1, a - 1); return { q: `${a}x-${b}x を整理すると □x。□は？`, ans: a - b, h1: "係数を引く", h2: `${a}-${b}=${a - b}` }; }),
          p("v1s3", (r) => { const a = r(2, 5), b = r(1, 6); return { q: `${a}(x+${b}) を展開したときの定数項は？`, ans: a * b, h1: "分配法則", h2: `${a}×${b}=${a * b}` }; }),
          p("v1s4", (r) => { const a = r(2, 8); return { q: `${a}x+x を整理すると □x。□は？`, ans: a + 1, h1: "xは1xと考える", h2: `${a}+1=${a + 1}` }; }),
          p("v1s5", (r) => { const a = r(2, 6), b = r(2, 6); return { q: `${a}a+${b}b-a を整理したときの a の係数は？`, ans: a - 1, h1: "aの項だけ集める", h2: `${a}-1=${a - 1}` }; }),
        ],
        advanced: [
          p("v1a1", (r) => { const a = r(2, 4), b = r(1, 5), c = r(2, 4), d = r(1, 5); return { q: `${a}(x+${b})-${c}(x-${d}) の x の係数は？`, ans: a - c, h1: `展開: ${a}x+${a * b}-${c}x+${c * d}`, h2: `${a}-${c}=${a - c}` }; }),
          p("v1a2", (r) => { const a = r(2, 4), b = r(2, 4); return { q: `${a}x²+${b}x-${a}x²+${b} の x の係数は？`, ans: b, h1: "x²の項は打ち消し合う", h2: `残るのは${b}x` }; }),
          p("v1a3", (r) => { const a = r(2, 5), b = r(2, 4); return { q: `(${a}x+${b})÷${b}×${b} の x の係数は？`, ans: a, h1: "÷bと×bが打ち消す", h2: `係数は${a}` }; }),
          p("v1a4", (r) => { const a = r(2, 4), b = r(1, 5), c = r(2, 4); return { q: `${a}(x+${b})+${c}x の x の係数は？`, ans: a + c, h1: `${a}x+${a * b}+${c}x`, h2: `${a}+${c}=${a + c}` }; }),
          p("v1a5", (r) => { const a = r(2, 5), b = r(2, 5); return { q: `${a}x²+${b}x²-x² の x² の係数は？`, ans: a + b - 1, h1: "x²の項をまとめる", h2: `${a}+${b}-1=${a + b - 1}` }; }),
        ],
      },
    },
    {
      id: "v2",
      name: "式の値（代入）",
      emoji: "🔁",
      desc: "文字に数を代入して計算",
      problems: {
        easy: [
          p("v2e1", (r) => { const a = r(2, 6), x = r(1, 8); return { q: `${a}x の x=${x} のときの値は？`, ans: a * x, h1: `xに${x}を代入`, h2: `${a}×${x}=${a * x}` }; }),
          p("v2e2", (r) => { const a = r(2, 5), b = r(1, 8), x = r(1, 8); return { q: `${a}x+${b} の x=${x} のときの値は？`, ans: a * x + b, h1: `代入`, h2: `${a}×${x}+${b}=${a * x + b}` }; }),
          p("v2e3", (r) => { const a = r(2, 5), x = r(1, 5); return { q: `${a}x² の x=${x} のときの値は？`, ans: a * x * x, h1: `x²=${x * x}`, h2: `${a}×${x * x}=${a * x * x}` }; }),
          p("v2e4", (r) => { const a = r(2, 5), b = r(1, 6), x = r(2, 8); return { q: `${a}x-${b} の x=${x} のときの値は？`, ans: a * x - b, h1: `代入`, h2: `${a}×${x}-${b}=${a * x - b}` }; }),
          p("v2e5", (r) => { const b = r(2, 9), x = r(1, 8); return { q: `${b}-x の x=${x} のときの値は？`, ans: b - x, h1: `xに${x}を代入`, h2: `${b}-${x}=${b - x}` }; }),
        ],
        standard: [
          p("v2s1", (r) => { const a = r(2, 5), b = r(1, 6), x = -r(1, 4); return { q: `${a}x+${b} の x=${x} のときの値は？`, ans: a * x + b, h1: "負の数を代入", h2: `${a}×(${x})+${b}=${a * x + b}` }; }),
          p("v2s2", (r) => { const a = r(2, 5), b = r(2, 8), x = -r(2, 6); return { q: `${b}÷x… ではなく ${b}/x の x=${x} のとき（割り切れる）`, ans: b / x, h1: `${b}÷(${x})`, h2: `=${b / x}`, skip: b % x !== 0 }; }),
          p("v2s3", (r) => { const a = r(2, 4), b = r(2, 4), x = r(1, 5), y = r(1, 5); return { q: `${a}x+${b}y の x=${x}、y=${y} のとき？`, ans: a * x + b * y, h1: "両方代入", h2: `${a * x}+${b * y}=${a * x + b * y}` }; }),
          p("v2s4", (r) => { const a = r(2, 4), x = -r(1, 4); return { q: `${a}x² の x=${x} のときの値は？`, ans: a * x * x, h1: `x²は正: x²=${x * x}`, h2: `${a}×${x * x}=${a * x * x}` }; }),
          p("v2s5", (r) => { const a = r(2, 5), b = r(1, 6), x = -r(1, 5); return { q: `${a}x-${b} の x=${x} のときの値は？`, ans: a * x - b, h1: "負の数を代入", h2: `${a}×(${x})-${b}=${a * x - b}` }; }),
        ],
        advanced: [
          p("v2a1", (r) => { const a = r(1, 5), b = r(1, 5), x = -r(1, 4); return { q: `x²+${a}x+${b} の x=${x} のとき？`, ans: x * x + a * x + b, h1: `x²=${x * x}、${a}x=${a * x}`, h2: `${x * x}+(${a * x})+${b}=${x * x + a * x + b}` }; }),
          p("v2a2", (r) => { const a = r(2, 4); return { q: `${a}a+${a}b の a=3、b=-3 のとき？`, ans: 0, h1: `${a}(a+b)=${a}×0`, h2: "0" }; }),
          p("v2a3", (r) => { const a = r(2, 4), b = r(2, 4), x = r(1, 4), y = -r(1, 4); return { q: `${a}x+${b}y の x=${x}、y=${y} のとき？`, ans: a * x + b * y, h1: "yは負の数", h2: `${a * x}+(${b * y})=${a * x + b * y}` }; }),
          p("v2a4", (r) => { const a = r(1, 5), x = -r(1, 4); return { q: `x²-${a}x の x=${x} のとき？`, ans: x * x - a * x, h1: `x²=${x * x}、-${a}x=${-a * x}`, h2: `${x * x}-(${a * x})=${x * x - a * x}` }; }),
          p("v2a5", (r) => { const a = r(2, 5); return { q: `${a}a-${a}b の a=4、b=4 のとき？`, ans: 0, h1: `${a}(a-b)=${a}×0`, h2: "0" }; }),
        ],
      },
    },
    {
      id: "v3",
      name: "加法・減法",
      emoji: "🔣",
      desc: "同類項をまとめる",
      problems: {
        easy: [
          p("v3e1", (r) => { const a = r(2, 6), b = r(2, 6); return { q: `(${a}x+1)+(${b}x+2) の x の係数は？`, ans: a + b, h1: "xの項を集める", h2: `${a}+${b}=${a + b}` }; }),
          p("v3e2", (r) => { const a = r(3, 8), b = r(1, a - 1); return { q: `(${a}x+3)-(${b}x+1) の x の係数は？`, ans: a - b, h1: "引く括弧の符号を逆に", h2: `${a}-${b}=${a - b}` }; }),
          p("v3e3", (r) => { const a = r(1, 8), b = r(1, 8); return { q: `(2x+${a})+(3x-${b}) の定数項は？`, ans: a - b, h1: "定数項を計算", h2: `${a}-${b}=${a - b}` }; }),
          p("v3e4", (r) => { const a = r(2, 6), b = r(1, 8), c = r(1, 8); return { q: `(${a}x-${b})+(x+${c}) の x の係数は？`, ans: a + 1, h1: "xの項を集める", h2: `${a}+1=${a + 1}` }; }),
          p("v3e5", (r) => { const a = r(2, 6), b = r(2, 6); return { q: `${a}x+${b}-x の x の係数は？`, ans: a - 1, h1: "xの項だけ集める", h2: `${a}-1=${a - 1}` }; }),
        ],
        standard: [
          p("v3s1", (r) => { const a = r(2, 5), b = r(1, 6), c = r(2, 5), d = r(1, 6); return { q: `(${a}x-${b})+(${c}x+${d}) の定数項は？`, ans: -b + d, h1: "定数を足す", h2: `-${b}+${d}=${-b + d}` }; }),
          p("v3s2", (r) => { const a = r(2, 4), b = r(1, 5), c = r(1, 6); return { q: `${a}(x+${b})-${c} の x の係数は？`, ans: a, h1: `展開: ${a}x+${a * b}-${c}`, h2: `x の係数は${a}` }; }),
          p("v3s3", (r) => { const a = r(2, 4), b = r(1, 5); return { q: `(5x-${b})-(2x+${b}) の定数項は？`, ans: -2 * b, h1: `-${b}-${b}`, h2: `-${2 * b}` }; }),
          p("v3s4", (r) => { const a = r(3, 8), b = r(1, 6), c = r(1, 6), d = r(1, 6); return { q: `(${a}x+${b})-(${c}x-${d}) の定数項は？`, ans: b + d, h1: "引く括弧の符号を逆に", h2: `${b}+${d}=${b + d}` }; }),
          p("v3s5", (r) => { const a = r(2, 5), b = r(1, 6), c = r(2, 5); return { q: `${a}(x-${b})+${c}x の x の係数は？`, ans: a + c, h1: `${a}x+${c}x`, h2: `${a}+${c}=${a + c}` }; }),
        ],
        advanced: [
          p("v3a1", (r) => { const a = r(2, 4), b = r(2, 4); return { q: `${a}(x+${b})-${a}(x-${b}) の定数項は？`, ans: 2 * a * b, h1: `${a * b}+${a * b}`, h2: `${2 * a * b}` }; }),
          p("v3a2", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 4); return { q: `(${a}x²+${b}x+${c})-(${a}x²-${b}x) の x の係数は？`, ans: 2 * b, h1: "x²が消える", h2: `${b}-(-${b})=${2 * b}` }; }),
          p("v3a3", (r) => { const a = r(2, 4), b = r(1, 5), c = r(2, 4), d = r(1, 5); return { q: `${a}(x+${b})+${c}(x+${d}) の定数項は？`, ans: a * b + c * d, h1: `${a * b}+${c * d}`, h2: `${a * b + c * d}` }; }),
          p("v3a4", (r) => { const a = r(2, 4), b = r(2, 5), c = r(2, 5); return { q: `(${a}x²+${b}x)-(${a}x²+${c}x) の x の係数は？`, ans: b - c, h1: "x²が消える", h2: `${b}-${c}=${b - c}` }; }),
          p("v3a5", (r) => { const a = r(2, 4), b = r(1, 5); return { q: `${a}(x-${b})-(x-${b}) の x の係数は？`, ans: a - 1, h1: `${a}x-x`, h2: `${a}-1=${a - 1}` }; }),
        ],
      },
    },
    {
      id: "v4",
      name: "乗法・除法（分配）",
      emoji: "✳️",
      desc: "数×文字式・文字式÷数",
      problems: {
        easy: [
          p("v4e1", (r) => { const a = r(2, 6), b = r(2, 5); return { q: `${a}x×${b} の x の係数は？`, ans: a * b, h1: "係数どうしをかける", h2: `${a}×${b}=${a * b}` }; }),
          p("v4e2", (r) => { const a = r(2, 6), b = r(2, 6); return { q: `${a * b}x÷${a} の x の係数は？`, ans: b, h1: "係数を割る", h2: `${a * b}÷${a}=${b}` }; }),
          p("v4e3", (r) => { const a = r(2, 5), b = r(2, 5), c = r(1, 6); return { q: `${a}(${b}x+${c}) の x の係数は？`, ans: a * b, h1: "分配法則", h2: `${a}×${b}=${a * b}` }; }),
          p("v4e4", (r) => { const a = r(2, 6), b = r(2, 5); return { q: `${a}x×(-${b}) の x の係数は？`, ans: -a * b, h1: "係数どうしをかける", h2: `${a}×(-${b})=${-a * b}` }; }),
          p("v4e5", (r) => { const a = r(2, 6), b = r(2, 6); return { q: `-${a * b}x÷${a} の x の係数は？`, ans: -b, h1: "係数を割る", h2: `-${a * b}÷${a}=${-b}` }; }),
        ],
        standard: [
          p("v4s1", (r) => { const a = r(2, 5), b = r(2, 5), c = r(1, 6); return { q: `${a}(${b}x+${c}) の定数項は？`, ans: a * c, h1: "分配法則", h2: `${a}×${c}=${a * c}` }; }),
          p("v4s2", (r) => { const a = r(2, 6), b = r(2, 5), c = r(1, 8); return { q: `(${a * b}x+${a * c})÷${a} の x の係数は？`, ans: b, h1: `各項を${a}で割る`, h2: `${a * b}÷${a}=${b}` }; }),
          p("v4s3", (r) => { const a = r(2, 5), b = r(2, 6), c = r(1, 6); return { q: `-${a}(${b}x-${c}) の x の係数は？`, ans: -a * b, h1: `-${a}を各項にかける`, h2: `-${a}×${b}=${-a * b}` }; }),
          p("v4s4", (r) => { const a = r(2, 5), b = r(2, 6), c = r(1, 6); return { q: `-${a}(${b}x-${c}) の定数項は？`, ans: a * c, h1: `-${a}×(-${c})`, h2: `+${a * c}` }; }),
          p("v4s5", (r) => { const a = r(2, 6), b = r(2, 5), c = r(1, 8); return { q: `(${a * b}x-${a * c})÷${a} の定数項は？`, ans: -c, h1: `各項を${a}で割る`, h2: `-${a * c}÷${a}=${-c}` }; }),
        ],
        advanced: [
          p("v4a1", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 5), d = r(2, 4); return { q: `${a}(${b}x+${c})+${d}(x+${c}) の x の係数は？`, ans: a * b + d, h1: `${a * b}x+${d}x`, h2: `${a * b}+${d}=${a * b + d}` }; }),
          p("v4a2", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 5); return { q: `${a}(${b}x+${c})-${a}(${b}x-${c}) の値は？`, ans: 2 * a * c, h1: `${a * c}+${a * c}`, h2: `${2 * a * c}` }; }),
          p("v4a3", (r) => { const a = r(2, 4), b = r(2, 3), c = r(1, 5); return { q: `${a}(${b}x+${c})÷${b} の x の係数は？`, ans: a, h1: `${a * b}x÷${b}`, h2: `係数は${a}` }; }),
          p("v4a4", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 5), d = r(2, 4); return { q: `${a}(${b}x-${c})+${d}(x+${c}) の x の係数は？`, ans: a * b + d, h1: `${a * b}x+${d}x`, h2: `${a * b}+${d}=${a * b + d}` }; }),
          p("v4a5", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 5); return { q: `-${a}(${b}x-${c}) の定数項は？`, ans: a * c, h1: `-${a}×(-${c})`, h2: `+${a * c}` }; }),
        ],
      },
    },
    {
      id: "v5",
      name: "四則混合（複合）",
      emoji: "🔀",
      desc: "括弧と分配をまとめて",
      problems: {
        easy: [
          p("v5e1", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 4); return { q: `${a}x+${b}(${c}x-1) の x の係数は？`, ans: a + b * c, h1: `${b}(${c}x-1)=${b * c}x-${b}`, h2: `${a}+${b * c}=${a + b * c}` }; }),
          p("v5e2", (r) => { const a = r(2, 4), b = r(1, 4); return { q: `2(a+${a})+4(a-${b}) の定数項は？`, ans: 2 * a - 4 * b, h1: `${2 * a}-${4 * b}`, h2: `${2 * a - 4 * b}` }; }),
          p("v5e3", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 4); return { q: `${a}x+${b}(x+${c}) の x の係数は？`, ans: a + b, h1: `${b}(x+${c})=${b}x+${b * c}`, h2: `${a}+${b}=${a + b}` }; }),
          p("v5e4", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 4); return { q: `${a}(x-${c})+${b}x の定数項は？`, ans: -a * c, h1: `${a}×(-${c})`, h2: `定数項は${-a * c}` }; }),
        ],
        standard: [
          p("v5s1", (r) => { const a = r(2, 4), b = r(2, 4); return { q: `${a}(x-3)-${b}(${a}x-2) の x の係数は？`, ans: a - b * a, h1: `${a}x-${b * a}x`, h2: `${a}-${b * a}=${a - b * a}` }; }),
          p("v5s2", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 4); return { q: `${a}(2x+${c})+${b}(3x-${c}) の x の係数は？`, ans: 2 * a + 3 * b, h1: `${2 * a}x+${3 * b}x`, h2: `${2 * a}+${3 * b}=${2 * a + 3 * b}` }; }),
          p("v5s3", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 4); return { q: `${a}(2x+${c})-${b}x の x の係数は？`, ans: 2 * a - b, h1: `${2 * a}x-${b}x`, h2: `${2 * a}-${b}=${2 * a - b}` }; }),
          p("v5s4", (r) => { const a = r(2, 4), b = r(2, 4), c = r(1, 4); return { q: `${a}(x+${c})+${b}(x-${c}) の x の係数は？`, ans: a + b, h1: `${a}x+${b}x`, h2: `${a}+${b}=${a + b}` }; }),
        ],
        advanced: [
          p("v5a1", (r) => { const a = r(2, 4), b = r(1, 4); return { q: `½(6x-${2 * b})+¼(12x-8) の x の係数は？`, ans: 3 + 3, h1: "3x+3x", h2: "6" }; }),
          p("v5a2", (r) => { const a = r(2, 3), b = r(2, 3), c = r(1, 4); return { q: `${a}(${b}x+${c})-${a}×${b}x の定数項は？`, ans: a * c, h1: `${a * b}x+${a * c}-${a * b}x`, h2: `定数項${a * c}` }; }),
          p("v5a3", (r) => { const a = r(2, 3), b = r(2, 3), c = r(1, 4); return { q: `${a}(${b}x+${c})-${b}(${a}x-${c}) の定数項は？`, ans: a * c + b * c, h1: `定数項: ${a * c}+${b * c}`, h2: `${a * c + b * c}` }; }),
          p("v5a4", (r) => { const a = r(2, 5), b = r(1, 4), c = r(2, 5); return { q: `${a}(x+${b})-${c}(x-${b}) の x の係数は？`, ans: a - c, h1: `${a}x-${c}x`, h2: `${a}-${c}=${a - c}` }; }),
        ],
      },
    },
  ],
};

// 🔥鬼：負の数をまじえた式の値（代入）。全単元共通の難問。答えは数値（4択は自動生成）。
function fmtQuad(a, b, c) {
  const t = (co, s) => (co === 0 ? "" : (co > 0 ? "+" : "−") + (Math.abs(co) === 1 && s ? "" : Math.abs(co)) + s);
  return (a < 0 ? "−" : "") + (Math.abs(a) === 1 ? "" : Math.abs(a)) + "x²" + t(b, "x") + t(c, "");
}
function genOniC2(r) {
  const X = (r(0, 1) ? 1 : -1) * r(2, 5);
  const a = (r(0, 1) ? 1 : -1) * r(2, 4), b = (r(0, 1) ? 1 : -1) * r(2, 5), c = (r(0, 1) ? 1 : -1) * r(2, 6);
  const ans = a * X * X + b * X + c;
  return { q: `x=${X < 0 ? "(" + X + ")" : X} のとき、${fmtQuad(a, b, c)} の値を求めなさい。`, ans, h1: "負の数を代入するときは ( ) をつける", h2: `x=${X} を代入（累乗→積→和の順）` };
}
chapter.units.forEach((u) => { u.problems.oni = [p(u.id + "oni", genOniC2)]; });
