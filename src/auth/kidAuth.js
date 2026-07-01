// ============================================================
// kidAuth.js — 子ども向けログイン（メール不要）。
//  「クラスコード＋なまえ＋あいことば(4桁PIN)」を Supabase の email/password に内部変換する。
//   ・email：クラスコード(ascii)＋(クラス+なまえ)の決定論ハッシュ ＠mathlabo.local
//     → 同じ入力なら必ず同じメール＝再ログインできる。日本語の名前でもOK（ハッシュ化）。
//   ・password：あいことばを 6文字以上にパディング。
//  初回ログインは自動でアカウント作成（自己登録）。以降は同じ入力でサインイン。
//  ※ Supabase 側で「Confirm email」を OFF にしておくこと（.local メールは確認できないため）。
// ============================================================
import { supabase } from "./supabase.js";

function hash36(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
export function emailFor(classCode, name) {
  const cc = String(classCode || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "") || "cc";
  const h = hash36(String(classCode || "").trim() + "|" + String(name || "").trim());
  return `${cc}.${h}@mathlabo.local`;
}
function passwordFor(pin) { return "mlpw-" + String(pin || "").trim(); }

/** 現在のログインユーザー（未ログイン/認証OFFは null） */
export async function getUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

/**
 * 子どもログイン。成功で { uid, name } を返す。失敗は分かりやすい日本語で throw。
 *  流れ：サインイン試行 → 失敗なら新規作成 → それも「登録済み」なら＝あいことば違い。
 */
export async function signInKid(classCode, name, pin) {
  if (!supabase) throw new Error("ログイン機能はまだ準備中です（Supabase未設定）。");
  const email = emailFor(classCode, name);
  const password = passwordFor(pin);

  const si = await supabase.auth.signInWithPassword({ email, password });
  if (!si.error && si.data?.user) { await upsertStudent(si.data.user.id, name, classCode); return { uid: si.data.user.id, name }; }

  // サインイン失敗 → 新規作成を試す（初回ログイン＝自己登録）
  const su = await supabase.auth.signUp({ email, password, options: { data: { display_name: name, class_code: classCode } } });
  if (su.error) {
    const msg = String(su.error.message || "");
    if (/already registered|already exists/i.test(msg)) throw new Error("あいことばが ちがうかも。もう一度たしかめてね。");
    throw new Error("ログインできませんでした：" + msg);
  }
  const uid = su.data?.user?.id;
  if (!uid) throw new Error("アカウント作成に失敗しました。しばらくして もう一度ためしてね。");
  await upsertStudent(uid, name, classCode);
  return { uid, name };
}

export async function signOutKid() { if (supabase) await supabase.auth.signOut(); }

// students テーブルに名前・クラスを記録（表示と教師ダッシュボード用）。RLS：本人のみ。
async function upsertStudent(uid, name, classCode) {
  try {
    await supabase.from("students").upsert(
      { id: uid, name: String(name || "").trim(), class_code: String(classCode || "").trim() },
      { onConflict: "id" }
    );
  } catch { /* students テーブル未作成でもログイン自体は通す */ }
}
