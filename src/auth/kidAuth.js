// ============================================================
// kidAuth.js — 子ども向けログイン（メール不要）。
//  ログインの識別は「ID」1つだけ（自分で決める）。ニックネームは表示名にすぎず、
//  ログインには一切関係しない＝いつ変えてもログインが変わらない。
//   ・email：ID の決定論ハッシュ ＠mathlabo.local
//     → 同じIDなら必ず同じメール＝再ログインできる。日本語のIDでもOK（ハッシュ化）。
//   ・password：あいことば（パスワード）を prefix でパディング。
//  初回ログイン（サインイン失敗）は自動でアカウント作成（自己登録）。
//  以降は同じID＋あいことばでサインイン。ニックネームは新規登録のときだけ使う
//  （既存アカウントのニックネームは上書きしない＝設定画面での変更を壊さない）。
//  ※ Supabase 側で「Confirm email」を OFF にしておくこと（.local メールは確認できないため）。
// ============================================================
import { supabase } from "./supabase.js";

function hash36(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
export function emailFor(id) {
  const h = hash36(String(id || "").trim());
  return `id-${h}@mathlabo.local`;
}
function passwordFor(pin) { return "mlpw-" + String(pin || "").trim(); }

/** 現在のログインユーザー（未ログイン/認証OFFは null） */
export async function getUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

/**
 * 子どもログイン。成功で { uid, isNew } を返す。失敗は分かりやすい日本語で throw。
 *  流れ：サインイン試行 → 失敗なら新規作成（このときだけ nickname を使う）。
 * @param {string} id       ログイン用のID（本人が決める）
 * @param {string} pin      あいことば（パスワード）
 * @param {string} nickname 新規登録のときだけ使う表示名（既存アカウントには影響しない）
 */
export async function signInKid(id, pin, nickname = "") {
  if (!supabase) throw new Error("ログイン機能はまだ準備中です（Supabase未設定）。");
  const email = emailFor(id);
  const password = passwordFor(pin);

  const si = await supabase.auth.signInWithPassword({ email, password });
  if (!si.error && si.data?.user) return { uid: si.data.user.id, isNew: false };

  // サインイン失敗 → 新規作成を試す（初回ログイン＝自己登録）
  const su = await supabase.auth.signUp({ email, password, options: { data: { display_name: nickname } } });
  if (su.error) {
    const msg = String(su.error.message || "");
    if (/already registered|already exists/i.test(msg)) throw new Error("パスワードが ちがうかも。もう一度たしかめてね。");
    throw new Error("ログインできませんでした：" + msg);
  }
  const uid = su.data?.user?.id;
  if (!uid) throw new Error("アカウント作成に失敗しました。しばらくして もう一度ためしてね。");
  await upsertStudent(uid, nickname, id);
  return { uid, isNew: true };
}

export async function signOutKid() { if (supabase) await supabase.auth.signOut(); }

// students テーブルに名前・IDを記録（表示と教師ダッシュボード用）。RLS：本人のみ。
//  ※ class_code 列は元は「クラスコード」用だったが、今はログインIDをそのまま入れる。
async function upsertStudent(uid, name, loginId) {
  try {
    await supabase.from("students").upsert(
      { id: uid, name: String(name || "").trim(), class_code: String(loginId || "").trim() },
      { onConflict: "id" }
    );
  } catch { /* students テーブル未作成でもログイン自体は通す */ }
}

/** ニックネーム変更をサーバー(students.name)にも反映する。失敗しても致命的ではない（ローカルは別途更新済み）。 */
export async function updateNickname(name) {
  if (!supabase) return;
  try {
    const { data } = await supabase.auth.getUser();
    const uid = data?.user?.id;
    if (!uid) return;
    await supabase.from("students").update({ name: String(name || "").trim() }).eq("id", uid);
  } catch { /* noop */ }
}

/** ご意見箱：生徒の意見をサーバー(feedback)に送る。失敗しても致命的ではない（ローカルには別途保存済み）。 */
export async function submitFeedback({ message, category = "", name = "", loginId = "" }) {
  if (!supabase) return { ok: false };
  try {
    const { data } = await supabase.auth.getUser();
    const uid = data?.user?.id;
    if (!uid) return { ok: false };
    const { error } = await supabase.from("feedback").insert({
      student_id: uid, name: String(name || "").trim(), login_id: String(loginId || "").trim(),
      category, message: String(message || "").trim(),
    });
    return { ok: !error };
  } catch { return { ok: false }; }
}
