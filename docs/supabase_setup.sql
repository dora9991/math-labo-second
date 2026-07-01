-- ============================================================
-- 数学ラボ2 — Supabase セットアップ（Step0：認証＝本人の記録に紐づける）
--  Supabase ダッシュボードの SQL Editor に貼って実行する。
--  設計: Obsidian 「設計_サーバ移行とチート対策_2026-06-28」
--  ※ Step0 では students テーブルだけ。attempts / player_state（サーバ権威）は Step3 で追加。
-- ============================================================

-- 生徒（＝ auth.users と1対1）。名前・クラスは表示と教師ダッシュボード用。
create table if not exists public.students (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  class_code  text,
  grade       int,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.students enable row level security;

-- 本人の行だけ 参照・作成・更新できる（他人の行は見えない・触れない）。
drop policy if exists "students self select" on public.students;
create policy "students self select" on public.students
  for select using (auth.uid() = id);

drop policy if exists "students self insert" on public.students;
create policy "students self insert" on public.students
  for insert with check (auth.uid() = id);

drop policy if exists "students self update" on public.students;
create policy "students self update" on public.students
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ⚠️ 将来 player_state（レベル/クリスタル/石など）を作る時の鉄則：
--   ・player_state は client の insert/update を一切許可しない（select だけ）。
--   ・更新は Edge Function（service_role）だけが、採点済みの attempts から行う。
--   ＝ membership-site で起きた「self update で role を admin に自己昇格」と同型の穴を作らないため。
--
-- 例（Step3 で有効化する雛形・今は実行しない）：
--   create table public.player_state (
--     student_id uuid primary key references public.students(id) on delete cascade,
--     world int, world_cleared jsonb, cycle jsonb, coins int, crystals int,
--     gear jsonb, skill_stats jsonb, updated_at timestamptz default now());
--   alter table public.player_state enable row level security;
--   create policy "ps self select" on public.player_state for select using (auth.uid() = student_id);
--   -- insert/update ポリシーは作らない（＝クライアントからは書けない。service_role のみ）。
