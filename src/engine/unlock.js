// ============================================================
// unlock.js — バトルモンスターの解放判定（純関数）
//
//  入門サンプル     : 最初から戦える（チュートリアル兼・弱い）。
//  小単元モンスター : その小単元のタイムアタックで「難易度を1つ★1以上」で解放（壁を下げる）。
//  章ボス           : その章の全小単元で「3難易度すべて★1以上」＝計算マスターで解放。
//  最終ボス(魔王)   : すべての章ボスをたおすと解放。
// ============================================================
import { MONSTERS } from "../data/monsters.js";
import { LEVEL_KEYS } from "../data/index.js";

/** 小単元モンスターが解放済みか（pools の全ユニットで「いずれかの難易度」★1以上） */
export function isUnitMonsterUnlocked(player, monster) {
  const stars = player?.stars || {};
  return monster.pools.every((p) =>
    LEVEL_KEYS.some((l) => (stars[`${p.u}-${l}`] || 0) >= 1)
  );
}

/** ある章の小単元モンスター一覧 */
export function unitMonstersOfChapter(chapterId) {
  return MONSTERS.filter((m) => m.kind === "unit" && m.chapterId === chapterId);
}

/** ある章の全小単元で3難易度すべて★1以上か（＝その章の計算マスター） */
export function isChapterMastered(player, chapterId) {
  const stars = player?.stars || {};
  const units = unitMonstersOfChapter(chapterId);
  return units.length > 0 && units.every((m) =>
    LEVEL_KEYS.every((l) => (stars[`${m.unitId}-${l}`] || 0) >= 1)
  );
}

/** 章ボスが解放済みか（その章の全単元で3難易度すべて★1以上＝計算マスター） */
export function isChapterBossUnlocked(player, chapterId) {
  return isChapterMastered(player, chapterId);
}

/** 最終ボスが解放済みか（その学年の全章ボスを撃破）。
 *  完全ワールド分離: 学年ごとに魔王がいるので grade を指定（未指定なら全章ボス＝後方互換）。 */
export function isFinalBossUnlocked(clearedIds, grade = null) {
  const bosses = MONSTERS.filter((m) => m.kind === "chapterBoss" && (grade == null || m.grade === grade));
  return bosses.length > 0 && bosses.every((m) => clearedIds.has(m.id));
}

/** モンスター種別を問わず解放済みか */
export function isUnlocked(player, clearedIds, monster) {
  if (monster.kind === "sample") return true; // 入門サンプルは最初から
  if (monster.kind === "unit") return isUnitMonsterUnlocked(player, monster);
  if (monster.kind === "chapterBoss") return isChapterBossUnlocked(player, monster.chapterId);
  if (monster.kind === "finalBoss") return isFinalBossUnlocked(clearedIds, monster.grade ?? null);
  // 裏ボス：前の裏ボス（tier0 は魔王）を倒すと解放（段階的に出現）
  if (monster.kind === "secretBoss") return clearedIds.has(monster.prevId);
  return true;
}

/** 解放済みだが「まだ見ていない（seenMonsters 未登録）」モンスターのidリスト */
export function newlyUnlockedIds(player, clearedIds) {
  const seen = player?.seenMonsters || {};
  return MONSTERS.filter((m) => !seen[m.id] && isUnlocked(player, clearedIds, m)).map((m) => m.id);
}

/** 未解放モンスターの解放条件を説明する文 */
export function unlockHint(monster) {
  if (monster.kind === "unit") {
    return `「${monster.unit}」のタイムアタックで、いずれかの難易度を★1以上クリアすると出現！`;
  }
  if (monster.kind === "chapterBoss") {
    return "この章の全単元で かんたん・ふつう・発展 をすべて★1以上（計算マスター）にすると出現！";
  }
  if (monster.kind === "finalBoss") {
    return "すべての章ボスをたおすと出現！";
  }
  if (monster.kind === "secretBoss") {
    return monster.secretTier === 0
      ? "数学の魔王をたおすと、裏ボスへの道がひらく！"
      : "前の裏ボスをたおすと、次の裏ボスが出現！";
  }
  return "";
}
