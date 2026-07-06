// ============================================================
// battleTurn.js — 行動選択型バトル（v2）の純ロジック
//  設計: Obsidian「設計_バトル刷新_行動選択型_2026-07-05」／手書き構想D・E
//  1ターン = ①行動選択(攻撃/必殺技/スキル/防御) → ②問題(制限時間) →
//            ③敵ターン(毎ターン動く)。正解しないと自分の行動は失敗。
//  ここは React に依存しない純関数だけ。画面(TurnBattle.jsx)が状態を持ち、
//  敵の行動決定(turnEnemyDecide)とテンプレ定義をここから使う。
// ============================================================
import { genBattleProblem } from "./battle.js";

// ── 必殺技・スキルのSP ──────────────────────────────
export const TURN_SP_MAX = 10;
export const ULT_COST = 5;          // 必殺技のSP
export const ULT_MULT = 3;          // 必殺技のダメージ倍率（後々5倍に上げる想定）
export const ULT_MULT_UP = 5;

// ── プレイヤーのスキル（新・少数精鋭。ガチャは一旦オフ） ──────────
//   cost … 発動SP（正解して初めて発動＝SP消費。失敗時は消費しない）
//   kind … TurnBattle が解釈する効果種別
export const TURN_SKILLS = [
  { id: "heal",       name: "かいふく",   icon: "💚", color: "#4ade80", cost: 1, kind: "heal",       value: 5, desc: "HP（ハート）を5回復" },
  { id: "guard1",     name: "ダメ軽減",   icon: "🛡️", color: "#60a5fa", cost: 2, kind: "reduce",     turns: 2, amt: 1, desc: "2ターン 受けるダメージ −1" },
  { id: "barrier",    name: "バリア",     icon: "🔰", color: "#93c5fd", cost: 3, kind: "nullifyOnce", desc: "次の1回だけダメージ無効" },
  { id: "antisleep",  name: "めざまし",   icon: "⏰", color: "#38bdf8", cost: 2, kind: "immSleep",   turns: 5, desc: "5ターン 眠らない" },
  { id: "antipoison", name: "どく消し",   icon: "🧪", color: "#a3e635", cost: 2, kind: "immPoison",  turns: 5, desc: "毒を消す＋5ターン毒無効" },
];

export function findTurnSkill(id) {
  return TURN_SKILLS.find((s) => s.id === id) || null;
}

// ── 敵の行動パターン（6種・テンプレ化） ──────────────────
//   attack : 毎ターン1ダメージ
//   charge : Nターンためて発射（1→3 / 2→5 / 3→7 ダメージ）。ため中は予告。
//   multi  : Nターンためて 1×(3/5/7) の多段ヒット
//   sleep  : 3ターン眠らせる（クールダウンあり）
//   guard  : 1ターン こちらの攻撃を無効（クールダウンあり）
//   poison : 3ターン 毒（毎ターン末に1ダメージ）
export const CHARGE_DMG = { 1: 3, 2: 5, 3: 7 };
export const MULTI_HITS = { 1: 3, 2: 5, 3: 7 };

export const TURN_ENEMY_PATTERNS = {
  attack: { id: "attack", name: "こうげき型", icon: "👊", desc: "毎ターン こうげきしてくる" },
  charge: { id: "charge", name: "ためる型",   icon: "🔴", desc: "ためて 大ダメージ（予告あり）" },
  multi:  { id: "multi",  name: "連続こうげき型", icon: "✊", desc: "ためて 連続こうげき" },
  sleep:  { id: "sleep",  name: "ねむり型",   icon: "😴", desc: "たまに ねむらせてくる" },
  guard:  { id: "guard",  name: "まもり型",   icon: "🛡️", desc: "たまに 身をまもる" },
  poison: { id: "poison", name: "どく型",     icon: "☠️", desc: "たまに どくにする" },
};

// 中1の各単元モンスターに6種のパターンを「単元の末尾番号」で循環割り当て。
//   例: u1/v1/e1…=こうげき、2=ためる、3=ねむり、4=まもり、5=連続、6=どく。
//   → c1(u1〜u6)は従来と同じ割当のまま、c2〜c7へも同じ規則で広がる。
//   章ボスは「ためる型（強）」。sample/番号なしは attack。
const PATTERN_CYCLE = ["attack", "charge", "sleep", "guard", "multi", "poison"];
export function patternForMonster(monster) {
  if (!monster) return "attack";
  if (monster.kind === "sample") return "attack";
  if (monster.kind === "chapterBoss") return "charge";
  const m = String(monster.unitId || "").match(/(\d+)$/);
  const n = m ? parseInt(m[1], 10) : 1;
  return PATTERN_CYCLE[(n - 1) % PATTERN_CYCLE.length];
}

// ── ボス2段階変身 ──────────────────────────────────
//  章ボスは HP が半分を切ると「変身」してパターンが激しくなる（予告あり）。
//  第1段階=ためる型（大技を予告）→ 第2段階=連続こうげき型（手数で押す）。
export function isTwoPhaseBoss(monster) {
  return !!monster && monster.kind === "chapterBoss";
}
export const BOSS_PHASE2_PATTERN = "multi";

// ── ジャスト防御 ────────────────────────────────────
//  敵の「ためた大技(burst/multi)」を、防御を選んで正解したターンに受けると
//  “ジャスト防御”成立＝反撃ダメージ。予告を読む行為に報酬を与える。
export const JUST_GUARD_COUNTER_MULT = 1.0; // 反撃＝通常こうげき baseDmg の何倍か

// ── 学習連動スキル入手（次段: ロードアウト制と対）──────────
//  正負の各単元サイクルをクリアすると、その単元の敵の“対策スキル”を授かる。
//  「苦しんだ敵の対策を、学習で手に入れる」＝学ぶ＝強くなる。
export const LEARN_UNLOCK_C1 = {
  u1: "heal",       // こうげき型 → まず生存の かいふく
  u2: "guard1",     // ためる型   → 大ダメージを和らげる ダメ軽減
  u3: "antisleep",  // ねむり型   → めざまし
  u4: "barrier",    // まもり型   → 押し切る バリア
  u5: "guard1",     // 連続型     → ダメ軽減（既得なら実質ボーナス）
  u6: "antipoison", // どく型     → どく消し
};

/**
 * 敵の1ターンの行動を決める（純関数）。
 * @param {string} patternId TURN_ENEMY_PATTERNS のキー
 * @param {object} state     持ち越し状態 { chargeLeft, chargeTarget, cooldown }
 * @param {function} rand    乱数（テスト用に差し替え可）
 * @returns {{ st: object, act: object }}
 *   act.kind: "attack" | "charging" | "burst" | "multi" | "sleep" | "guard" | "poison"
 */
export function turnEnemyDecide(patternId, state = {}, rand = Math.random) {
  const st = { ...state };
  const dec = (act) => ({ st, act });

  switch (patternId) {
    case "attack":
      return dec({ kind: "attack", dmg: 1 });

    case "charge":
    case "multi": {
      const isMulti = patternId === "multi";
      const release = (n) =>
        isMulti ? { kind: "multi", hits: MULTI_HITS[n] || 3, per: 1 } : { kind: "burst", dmg: CHARGE_DMG[n] || 5 };
      if ((st.chargeLeft || 0) > 0) {
        // ため中：残りを1減らし、0になったら発射
        st.chargeLeft -= 1;
        if (st.chargeLeft === 0) {
          const n = st.chargeTarget || 2;
          st.chargeTarget = null;
          return dec(release(n));
        }
        return dec({ kind: "charging", left: st.chargeLeft });
      }
      // ためを開始（1〜3ターン。子どもが3種すべて見られるよう毎回ランダム）
      const target = 1 + Math.floor(rand() * 3);
      st.chargeTarget = target;
      st.chargeLeft = target;
      return dec({ kind: "charging", left: target, started: true });
    }

    case "sleep": {
      if ((st.cooldown || 0) > 0) { st.cooldown -= 1; return dec({ kind: "attack", dmg: 1 }); }
      st.cooldown = 4;
      return dec({ kind: "sleep", turns: 3 });
    }
    case "guard": {
      if ((st.cooldown || 0) > 0) { st.cooldown -= 1; return dec({ kind: "attack", dmg: 1 }); }
      st.cooldown = 3;
      return dec({ kind: "guard", turns: 1 });
    }
    case "poison": {
      if ((st.cooldown || 0) > 0) { st.cooldown -= 1; return dec({ kind: "attack", dmg: 1 }); }
      st.cooldown = 5;
      return dec({ kind: "poison", turns: 3 });
    }
    default:
      return dec({ kind: "attack", dmg: 1 });
  }
}

// ── プレイヤーのダメージ（理解度は使わず、まずはヒット数ベースでシンプルに）──
//   ユニット敵は約KILL_HITS発、ボスは長め。必殺技はその ULT_MULT 倍。
//   ※プレイ調整で KILL_HITS を変える。
export function baseAttackDamage(monster) {
  const hits = monster.kind === "chapterBoss" || monster.kind === "finalBoss" || monster.kind === "secretBoss" ? 12
    : monster.kind === "sample" ? 4 : 6;
  return Math.max(1, Math.ceil((monster.hp || 1) / hits));
}

/** 次の問題を出す（problemSource があればそれを使う）。 */
export function nextTurnProblem(monster, lastId, problemSource) {
  return problemSource ? problemSource(lastId) : genBattleProblem(monster, lastId);
}
