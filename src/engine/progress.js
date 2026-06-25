// ============================================================
// progress.js — 進捗・アンロック判定
// 「どの単元が解放済みか」「ある単元で取った星」などの判定ロジック。
// 保存データ(playerState)を読むだけで、保存方法(local/server)には依存しない。
// ============================================================

/** ある単元・難易度で取得済みの星を返す */
export function getStars(playerState, unitId, level) {
  return playerState?.stars?.[`${unitId}-${level}`] || 0;
}

/**
 * 単元が解放されているか。
 *  すべての小単元を最初から開放する。以前は「前の単元を★1クリアで解放」だったが、
 *  苦手な子が途中で詰まると先に進めず離脱しやすかったため、順番不問でどこからでも
 *  挑戦できるようにした（得意/苦手の可視化と「苦手ミックス」での復習を活かす方針）。
 */
export function isUnitUnlocked() {
  return true;
}

/** ある単元を「簡単・普通・難しい」全て★1以上で取れているか（仲間にする条件） */
export function unitFullyStarred(playerState, unitId) {
  return ["easy", "standard", "advanced"].every((lv) => getStars(playerState, unitId, lv) >= 1);
}

/** 章ごとの獲得星合計（達成度の表示用） */
export function chapterStarTotal(playerState, chapter, levelKeys) {
  let total = 0;
  for (const u of chapter.units) {
    for (const lv of levelKeys) total += getStars(playerState, u.id, lv);
  }
  return total;
}
