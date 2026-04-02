-- Appearance system migration for an existing project.
-- Run this after the original schema and RLS scripts.

alter table public.settings
add column if not exists active_theme text not null default 'editorial-luxe';

alter table public.settings
add column if not exists theme_settings jsonb not null default '{
  "primary_color":"#0f3d56",
  "accent_color":"#b88746",
  "surface_color":"#fffaf2",
  "background_color":"#f6efe5",
  "heading_font":"Georgia, ''Times New Roman'', serif",
  "body_font":"''Trebuchet MS'', ''Segoe UI'', sans-serif",
  "button_radius":"14px"
}'::jsonb;
