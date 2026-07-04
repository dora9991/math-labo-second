// ============================================================
// teacherModeEngine.js — 「教師モード」ノードグラフ(誤答駆動)を駆動するエンジン
//
//  問題DB再生成パイプライン(math-dialogue/pipeline)が1139問ぶん生成した
//  teacher_mode データを再生する。仮想生徒10人の実際の誤答から作った
//  「説明→確認クイズ→(誤答なら再説明して同じクイズに戻る)→…」の対話。
//
//  データ形状:
//   { start: "n1", nodes: [
//     { id, type:"explain", text, next },
//     { id, type:"check", question, choices:[...], correct, onCorrect, onWrong },
//   ]}
//
//  state は treeTeacher.js と同様の形（board が育つだけのシンプルな設計）。
//  判定ロジックは check ノードの choices[correct] と比較するだけ（4択ではなく2〜4択）。
// ============================================================

export function findNode(teacherMode, id) {
  if (!teacherMode || id == null) return null;
  return (teacherMode.nodes || []).find((n) => n.id === id) || null;
}

export function currentNode(teacherMode, state) {
  return findNode(teacherMode, state.nodeId);
}

const boardLineFor = (node, kind) => {
  if (!node) return null;
  if (node.type === "explain") return { text: node.text, kind };
  if (node.type === "check") return { text: node.question, kind: "problem" };
  return null;
};

// 対話を開始（最初のノードを板書に載せる）
export function startTeacherMode(teacherMode) {
  const first = findNode(teacherMode, teacherMode?.start);
  const board = [];
  const line = boardLineFor(first, "work");
  if (line) board.push(line);
  return { nodeId: teacherMode?.start, board, done: false, lastCorrect: null, wrongCounts: {} };
}

// explain ノードで「次へ」を押したとき（next="end" なら終了）
export function advanceExplain(teacherMode, state) {
  const node = currentNode(teacherMode, state);
  if (!node || node.type !== "explain") return state;
  if (!node.next || node.next === "end") return { ...state, done: true };
  const next = findNode(teacherMode, node.next);
  const board = [...state.board];
  const line = boardLineFor(next, "work");
  if (line) board.push(line);
  return { ...state, nodeId: node.next, board };
}

// check ノードで選択肢(index)を選んだとき。
//  同じcheckノードで2回目の誤答をすると、無限ループ（誤答→再説明→同じcheck…）で
//  心が折れないよう、正解と理由を板書に見せてから先（onCorrect）へ進める。
//  戻り値の forcedPass=true は「この問題は理解できずに進んだ＝学び直しノートへ」の合図。
export function answerCheck(teacherMode, state, choiceIndex) {
  const node = currentNode(teacherMode, state);
  if (!node || node.type !== "check") return state;
  const correct = choiceIndex === node.correct;
  const wrongCounts = { ...(state.wrongCounts || {}) };
  const board = [...state.board, { text: String(node.choices[choiceIndex]), kind: "student" }];

  if (!correct) {
    wrongCounts[node.id] = (wrongCounts[node.id] || 0) + 1;
    if (wrongCounts[node.id] >= 2) {
      board.push({ text: `正解は「${node.choices[node.correct]}」だよ。`, kind: "result" });
      const targetId = node.onCorrect;
      if (!targetId || targetId === "end") {
        return { ...state, done: true, lastCorrect: false, board, wrongCounts, forcedPass: true };
      }
      const next = findNode(teacherMode, targetId);
      const line = boardLineFor(next, "work");
      if (line) board.push(line);
      return { ...state, nodeId: targetId, board, lastCorrect: false, wrongCounts, forcedPass: true };
    }
  }

  const targetId = correct ? node.onCorrect : node.onWrong;
  if (!targetId || targetId === "end") {
    return { ...state, done: true, lastCorrect: correct, board, wrongCounts };
  }
  const next = findNode(teacherMode, targetId);
  const line = boardLineFor(next, correct ? "result" : "work");
  if (line) board.push(line);
  return { ...state, nodeId: targetId, board, lastCorrect: correct, wrongCounts };
}
