// ============================================================
// c5_heimen.js — 中1「平面図形」
// 小テスト準拠：図形の基本・角／移動／おうぎ形（弧・面積・中心角）
// 作図は数値回答にならないため、角度・おうぎ形計算・移動後の座標で出題。
// おうぎ形は π=3.14 として小数で答える。
// ============================================================
const p = (id, build) => ({ id, build });
const r2 = (n) => Math.round(n * 100) / 100; // 小数2桁

export const chapter = {
  id: "c5",
  name: "平面図形",
  emoji: "🔺",
  color: "#f472b6",
  grade: 1,
  units: [
    {
      id: "z1",
      name: "図形の基本と角",
      emoji: "📐",
      desc: "対頂角・補角・多角形の角",
      problems: {
        easy: [
          p("z1e1", (r) => { const a = r(20, 80); return { q: `${a}°の対頂角は何度？`, ans: a, h1: "対頂角は等しい", h2: `${a}°` }; }),
          p("z1e2", (r) => { const a = r(20, 70); return { q: `${a}°の補角（合わせて180°）は？`, ans: 180 - a, h1: "180−その角", h2: `${180 - a}°` }; }),
          p("z1e3", (r) => { const a = r(10, 80); return { q: `${a}°の余角（合わせて90°）は？`, ans: 90 - a, h1: "90−その角", h2: `${90 - a}°` }; }),
          p("z1e4", (r) => { const a = r(100, 170); return { q: `${a}°ととなり合って一直線（180°）になる角は？`, ans: 180 - a, h1: "180−その角", h2: `${180 - a}°` }; }),
        ],
        standard: [
          p("z1s1", (r) => { const a = r(20, 70); return { q: `平行線の錯角。一方が${a}°のとき他方は？`, ans: a, h1: "錯角は等しい", h2: `${a}°` }; }),
          p("z1s2", (r) => { const n = r(3, 8); return { q: `${n}角形の内角の和は？`, ans: (n - 2) * 180, h1: "(n−2)×180", h2: `(${n}-2)×180=${(n - 2) * 180}°` }; }),
          p("z1s3", (r) => { const a = r(10, 50), b = r(10, 50); return { q: `三角形の2角が${a}°と${b}°。残りの角は？`, ans: 180 - a - b, h1: "内角の和180°", h2: `${180 - a - b}°` }; }),
          p("z1s4", (r) => { const a = r(20, 70); return { q: `平行線の同位角。一方が${a}°のとき他方は？`, ans: a, h1: "同位角は等しい", h2: `${a}°` }; }),
        ],
        advanced: [
          p("z1a1", (r) => { const n = r(5, 10); return { q: `正${n}角形の1つの外角は？`, ans: 360 / n, h1: "外角の和360°", h2: `360÷${n}=${360 / n}°`, skip: 360 % n !== 0 }; }),
          p("z1a2", (r) => { const n = r(5, 9); return { q: `正${n}角形の1つの内角は？`, ans: (n - 2) * 180 / n, h1: `内角の和÷${n}`, h2: `${(n - 2) * 180 / n}°`, skip: ((n - 2) * 180) % n !== 0 }; }),
          p("z1a3", (r) => { const exts = [24, 30, 36, 40, 45, 60, 72]; const e = exts[r(0, exts.length - 1)]; return { q: `1つの外角が${e}°である正多角形は正何角形か（数字で）？`, ans: 360 / e, h1: "辺の数=360÷外角", h2: `360÷${e}=${360 / e}` }; }),
          p("z1a4", (r) => { const n = r(4, 9); return { q: `${n}角形の1つの頂点から引ける対角線の本数は？`, ans: n - 3, h1: "自分ととなり2つには引けない", h2: `${n}-3=${n - 3}本` }; }),
        ],
      },
    },
    {
      id: "z2",
      name: "図形の移動",
      emoji: "🔄",
      desc: "対称・回転・平行移動（座標）",
      problems: {
        easy: [
          p("z2e1", (r) => { const a = r(2, 8); return { q: `点(${a},0)をy軸対称移動した点のx座標は？`, ans: -a, h1: "y軸対称はx符号反転", h2: `-${a}` }; }),
          p("z2e2", (r) => { const b = r(2, 8); return { q: `点(0,${b})をx軸対称移動した点のy座標は？`, ans: -b, h1: "x軸対称はy符号反転", h2: `-${b}` }; }),
          p("z2e3", (r) => { const a = r(2, 8), b = r(2, 8); return { q: `点(${a},${b})をx軸対称移動した点のy座標は？`, ans: -b, h1: "x軸対称はy符号反転", h2: `-${b}` }; }),
          p("z2e4", (r) => { const a = r(2, 8), b = r(2, 8); return { q: `点(${a},${b})をy軸対称移動した点のx座標は？`, ans: -a, h1: "y軸対称はx符号反転", h2: `-${a}` }; }),
        ],
        standard: [
          p("z2s1", (r) => { const a = r(2, 5), b = r(2, 5); return { q: `点(${a},${b})を原点対称移動した点のx座標は？`, ans: -a, h1: "両座標の符号反転", h2: `-${a}` }; }),
          p("z2s2", (r) => { const a = r(1, 5), b = r(1, 5), dx = r(1, 4); return { q: `点(${a},${b})をx方向に+${dx}平行移動した点のx座標は？`, ans: a + dx, h1: "x座標に加える", h2: `${a}+${dx}=${a + dx}` }; }),
          p("z2s3", (r) => { const a = r(2, 5), b = r(2, 5); return { q: `点(${a},${b})を原点対称移動した点のy座標は？`, ans: -b, h1: "両座標の符号反転", h2: `-${b}` }; }),
          p("z2s4", (r) => { const a = r(1, 5), b = r(2, 6), dy = r(1, 4); return { q: `点(${a},${b})をy方向に-${dy}平行移動した点のy座標は？`, ans: b - dy, h1: "y座標から引く", h2: `${b}-${dy}=${b - dy}` }; }),
        ],
        advanced: [
          p("z2a1", (r) => { const a = r(2, 4), b = r(2, 4); return { q: `点(${a},${b})を原点中心に90°反時計回りに回転した点のx座標は？`, ans: -b, h1: "(x,y)→(-y,x)", h2: `-${b}` }; }),
          p("z2a2", (r) => { const a = r(1, 5), b = r(1, 5); return { q: `点(${a},${b})を直線y=xに対称移動した点のx座標は？`, ans: b, h1: "xとyを交換", h2: `${b}` }; }),
          p("z2a3", (r) => { const a = r(2, 4), b = r(2, 4); return { q: `点(${a},${b})を原点中心に90°反時計回りに回転した点のy座標は？`, ans: a, h1: "(x,y)→(-y,x)", h2: `${a}` }; }),
          p("z2a4", (r) => { const a = r(1, 5), b = r(1, 5); return { q: `点(${a},${b})を直線y=xに対称移動した点のy座標は？`, ans: a, h1: "xとyを交換", h2: `${a}` }; }),
        ],
      },
    },
    {
      id: "z3",
      name: "おうぎ形①（弧・面積）",
      emoji: "🍕",
      desc: "答えは「□π」の□（係数）を答える",
      problems: {
        easy: [
          p("z3e1", (r) => { const rad = r(2, 9); return { q: `半径${rad}cmの円の面積は □π cm²。□は？`, ans: rad * rad, h1: "面積=π×r²なので□=r²", h2: `${rad}²=${rad * rad}` }; }),
          p("z3e2", (r) => { const rad = r(2, 9); return { q: `半径${rad}cmの円の円周は □π cm。□は？`, ans: 2 * rad, h1: "円周=2×π×rなので□=2r", h2: `2×${rad}=${2 * rad}` }; }),
          p("z3e3", (r) => { const d = r(2, 9); return { q: `直径${2 * d}cmの円の面積は □π cm²。□は？`, ans: d * d, h1: `半径=直径÷2=${d}cm`, h2: `${d}²=${d * d}` }; }),
          p("z3e4", (r) => { const rad = r(2, 9); return { q: `半径${rad}cmの半円の弧の長さは □π cm。□は？`, ans: rad, h1: "半円の弧=円周の半分=π×r", h2: `□=${rad}` }; }),
        ],
        standard: [
          p("z3s1", (r) => { const rad = r(1, 3) * 2, ang = r(1, 3) * 90; return { q: `半径${rad}cm・中心角${ang}°のおうぎ形の面積は □π cm²。□は？`, ans: rad * rad * ang / 360, h1: "□=r²×(中心角/360)", h2: `${rad * rad}×${ang}/360=${rad * rad * ang / 360}` }; }),
          p("z3s2", (r) => { const rad = r(1, 3) * 3, ang = r(1, 5) * 60; return { q: `半径${rad}cm・中心角${ang}°のおうぎ形の弧の長さは □π cm。□は？`, ans: 2 * rad * ang / 360, h1: "□=2r×(中心角/360)", h2: `2×${rad}×${ang}/360=${2 * rad * ang / 360}` }; }),
          p("z3s3", (r) => { const rad = r(1, 4) * 2, ang = 180; return { q: `半径${rad}cm・中心角180°（半円）の面積は □π cm²。□は？`, ans: rad * rad / 2, h1: "□=r²×(180/360)=r²÷2", h2: `${rad * rad}÷2=${rad * rad / 2}` }; }),
          p("z3s4", (r) => { const rad = r(1, 3) * 2, ang = r(1, 3) * 90; return { q: `半径${rad}cm・中心角${ang}°のおうぎ形の面積は □π cm²。□は？`, ans: rad * rad * ang / 360, h1: "□=r²×(中心角/360)", h2: `${rad * rad}×${ang}/360=${rad * rad * ang / 360}` }; }),
        ],
        advanced: [
          p("z3a1", (r) => { const r1 = r(2, 4), ro = r(5, 8); return { q: `半径${ro}cmの円から半径${r1}cmの円をくり抜いた面積は □π cm²。□は？`, ans: ro * ro - r1 * r1, h1: "□=R²−r²", h2: `${ro * ro}−${r1 * r1}=${ro * ro - r1 * r1}` }; }),
          p("z3a2", (r) => { const pairs = [[6, 3], [6, 4], [6, 6], [4, 4], [3, 3], [5, 5], [9, 3]]; const [rad, n] = pairs[r(0, pairs.length - 1)]; const ans = rad * rad / n; return { q: `半径${rad}cmの円を${n}等分したおうぎ形1つの面積は □π cm²。□は？`, ans, h1: `□=r²÷${n}`, h2: `${rad * rad}÷${n}=${ans}` }; }),
          p("z3a3", (r) => { const r1 = r(2, 4), ro = r(5, 9); return { q: `半径${ro}cmの円と半径${r1}cmの円の面積の差は □π cm²。□は？`, ans: ro * ro - r1 * r1, h1: "□=R²−r²", h2: `${ro * ro}−${r1 * r1}=${ro * ro - r1 * r1}` }; }),
          p("z3a4", (r) => { const pairs = [[6, 3], [8, 4], [8, 2], [12, 4], [10, 5], [12, 3], [12, 6]]; const [rad, n] = pairs[r(0, pairs.length - 1)]; return { q: `半径${rad}cmの円を${n}等分したおうぎ形1つの弧の長さは □π cm。□は？`, ans: 2 * rad / n, h1: `□=2r÷${n}`, h2: `${2 * rad}÷${n}=${2 * rad / n}` }; }),
        ],
      },
    },
    {
      id: "z4",
      name: "おうぎ形②（中心角）",
      emoji: "🧭",
      desc: "弧・割合から中心角を求める",
      problems: {
        easy: [
          p("z4e1", (r) => { const rad = r(2, 6); return { q: `半径${rad}cmの円で、面積が全体の1/4のおうぎ形の中心角は？`, ans: 90, h1: "360×1/4", h2: "90°" }; }),
          p("z4e2", (r) => { const rad = r(2, 6); return { q: `半径${rad}cmの円で、全体の1/3のおうぎ形の中心角は？`, ans: 120, h1: "360×1/3", h2: "120°" }; }),
          p("z4e3", (r) => { const rad = r(2, 6); return { q: `半径${rad}cmの円で、全体の1/6のおうぎ形の中心角は？`, ans: 60, h1: "360×1/6", h2: "60°" }; }),
          p("z4e4", (r) => { const rad = r(2, 6); return { q: `半径${rad}cmの円で、全体の1/2（半円）の中心角は？`, ans: 180, h1: "360×1/2", h2: "180°" }; }),
        ],
        standard: [
          p("z4s1", (r) => { const rad = r(1, 3) * 3, ang = r(1, 4) * 60; const arc = 2 * rad * ang / 360; return { q: `半径${rad}cm・弧の長さ ${arc}π cm のおうぎ形の中心角は？`, ans: ang, h1: "中心角=弧÷(2r)×360", h2: `${arc}÷${2 * rad}×360=${ang}°` }; }),
          p("z4s2", (r) => { const tri = [[6, 30, 3], [6, 60, 6], [6, 90, 9], [6, 120, 12], [4, 90, 4], [3, 120, 3]]; const [rad, ang, area] = tri[r(0, tri.length - 1)]; return { q: `半径${rad}cm・面積 ${area}π cm² のおうぎ形の中心角は？`, ans: ang, h1: "中心角=面積÷r²×360", h2: `${area}÷${rad * rad}×360=${ang}°` }; }),
          p("z4s3", (r) => { const rad = r(1, 4) * 3, ang = r(1, 4) * 60; const arc = 2 * rad * ang / 360; return { q: `半径${rad}cm・弧 ${arc}π cm のおうぎ形の中心角は？`, ans: ang, h1: "中心角=弧÷(2r)×360", h2: `${arc}÷${2 * rad}×360=${ang}°` }; }),
          p("z4s4", (r) => { const rad = r(2, 6); return { q: `半径${rad}cmの円で、弧の長さが円周の1/4のおうぎ形の中心角は？`, ans: 90, h1: "360×1/4", h2: "90°" }; }),
        ],
        advanced: [
          p("z4a1", (r) => { const tri = [[6, 30, 3], [6, 60, 6], [6, 90, 9], [6, 120, 12], [6, 150, 15], [4, 90, 4], [2, 90, 1], [3, 120, 3]]; const [rad, ang, area] = tri[r(0, tri.length - 1)]; return { q: `半径${rad}cm・面積 ${area}π cm² のおうぎ形の中心角は？`, ans: ang, h1: "中心角=面積÷r²×360", h2: `${area}÷${rad * rad}×360=${ang}°` }; }),
          p("z4a2", (r) => { const data = [[3, 120, 2], [6, 60, 2], [6, 120, 4], [9, 120, 6], [4, 90, 2], [12, 90, 6]]; const [rad, ang, arc] = data[r(0, data.length - 1)]; return { q: `半径${rad}cm・弧 ${arc}π cm のおうぎ形の中心角は？`, ans: ang, h1: "中心角=弧÷(2r)×360", h2: `${arc}÷${2 * rad}×360=${ang}°` }; }),
          p("z4a3", (r) => { const ms = [2, 3, 4, 5, 6, 8]; const m = ms[r(0, ms.length - 1)]; return { q: `おうぎ形の弧の長さが円周の1/${m}のとき、中心角は？`, ans: 360 / m, h1: `360×1/${m}`, h2: `${360 / m}°` }; }),
          p("z4a4", (r) => { const ms = [2, 3, 4, 6]; const m = ms[r(0, ms.length - 1)]; return { q: `面積が円全体の1/${m}のおうぎ形の中心角は？`, ans: 360 / m, h1: `360×1/${m}`, h2: `${360 / m}°` }; }),
        ],
      },
    },
  ],
};
