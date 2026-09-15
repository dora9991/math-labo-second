-- ============================================================
-- exam-maker（テスト作成ツール／math-labo4）— 作業中データのクラウド保存
--  Supabase ダッシュボードの SQL Editor に貼って実行する。
--
--  exam-makerにはログイン画面が無いので、ブラウザごとの「匿名ログイン」
--  (supabase.auth.signInAnonymously) で本人を識別する。1ブラウザ＝1下書き。
--  他人の下書きは auth.uid() が一致しないので読めない・書けない（RLS）。
--
--  事前準備（1回だけ）：
--   Supabase ダッシュボード → Authentication → Providers →
--   「Anonymous Sign-Ins」を ON にする。
-- ============================================================

-- 作業中データ（左パネルの設定＋自動生成したテスト本体）を JSON で丸ごと保存。
-- 1匿名ユーザーにつき1行（=1下書き）。複数下書きの保存には対応しない。
create table if not exists public.exam_maker_drafts (
  id          uuid primary key references auth.users(id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.exam_maker_drafts enable row level security;

-- 本人の行だけ 参照・作成・更新できる（他人の下書きは見えない・触れない）。
drop policy if exists "exam_maker_drafts self select" on public.exam_maker_drafts;
create policy "exam_maker_drafts self select" on public.exam_maker_drafts
  for select using (auth.uid() = id);

drop policy if exists "exam_maker_drafts self insert" on public.exam_maker_drafts;
create policy "exam_maker_drafts self insert" on public.exam_maker_drafts
  for insert with check (auth.uid() = id);

drop policy if exists "exam_maker_drafts self update" on public.exam_maker_drafts;
create policy "exam_maker_drafts self update" on public.exam_maker_drafts
  for update using (auth.uid() = id) with check (auth.uid() = id);
