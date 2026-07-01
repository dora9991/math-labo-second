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

-- ============================================================
-- Step3：サーバ権威のプレイヤー状態と、解答ログ
--  ⚠️ 鉄則：player_state / attempts は client の insert/update を一切許可しない（select だけ）。
--    更新は Edge Function（service_role）だけが、採点結果から行う。
--    ＝ membership-site で起きた「self update で role を admin に自己昇格」と同型の穴を作らないため。
--  ※ AUTH＋サーバ権威を使わないなら、この節は実行しなくてよい（Step0だけでも動く）。
-- ============================================================

-- プレイヤー状態（レベル・クリスタル・石・装備など）。中身は state(jsonb) に丸ごと。
--  検索/教師ダッシュボード用に world・level・coins・crystals だけ列にも出しておく（表示用ミラー）。
create table if not exists public.player_state (
  student_id  uuid primary key references public.students(id) on delete cascade,
  state       jsonb not null default '{}'::jsonb,  -- recordSchema.initialPlayerState の形をそのまま保存
  world       int  not null default 1,
  level       int  not null default 1,
  coins       int  not null default 0,
  crystals    int  not null default 0,
  updated_at  timestamptz not null default now()
);
alter table public.player_state enable row level security;
-- 本人は「読む」だけ。書き込みポリシーは作らない＝クライアントからは絶対に書けない（service_role のみ）。
drop policy if exists "ps self select" on public.player_state;
create policy "ps self select" on public.player_state
  for select using (auth.uid() = student_id);

-- 解答ログ（1問ごと）。サーバが採点した結果を service_role で追記する。分析・不正検知の元。
create table if not exists public.attempts (
  id          bigint generated always as identity primary key,
  student_id  uuid not null references public.students(id) on delete cascade,
  unit_id     text,
  level       text,            -- easy/standard/advanced/oni
  template_id text,
  seed        bigint,          -- 問題を再現するための種（Step2）
  ok          boolean not null,
  mode        text,            -- practice/battle/relearn/applied ...
  created_at  timestamptz not null default now()
);
alter table public.attempts enable row level security;
create index if not exists attempts_student_created on public.attempts (student_id, created_at desc);
-- 本人は自分のログを読めるだけ。書き込みは service_role のみ（ポリシーを作らない）。
drop policy if exists "attempts self select" on public.attempts;
create policy "attempts self select" on public.attempts
  for select using (auth.uid() = student_id);

-- 教師閲覧（任意・後で）：別途 role 列や teachers テーブルを足し、service_role の
--  Edge Function 経由で集計を返す。生徒の RLS はあくまで「自分の行だけ」を維持する。
