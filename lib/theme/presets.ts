import type { CSSProperties } from "react";

import type { SiteSettings, ThemeId, ThemeSettings } from "@/types/database";

type ThemePreset = {
  id: ThemeId;
  name: string;
  description: string;
  eyebrow: string;
  headline: string;
  sampleCopy: string;
  defaults: ThemeSettings;
};

export const themePresets: ThemePreset[] = [
  {
    id: "editorial-luxe",
    name: "Editorial Luxe",
    description: "Warm ivory surfaces, deep navy typography, and a premium editorial rhythm for brand-first portfolios.",
    eyebrow: "Luxury editorial system",
    headline: "A polished publishing theme built for authority and trust.",
    sampleCopy: "High-contrast serif headlines with refined spacing and soft neutral backgrounds.",
    defaults: {
      primary_color: "#0f3d56",
      accent_color: "#b88746",
      surface_color: "#fffaf2",
      background_color: "#f6efe5",
      heading_font: "Georgia, 'Times New Roman', serif",
      body_font: "'Trebuchet MS', 'Segoe UI', sans-serif",
      button_radius: "14px",
    },
  },
  {
    id: "studio-carbon",
    name: "Studio Carbon",
    description: "Dark, cinematic contrast with electric accent energy for modern agencies, creators, and product studios.",
    eyebrow: "Contemporary studio system",
    headline: "A bold visual theme for high-impact portfolios and launches.",
    sampleCopy: "Dense dark surfaces, sharp geometry, and saturated accent color designed for standout presentation.",
    defaults: {
      primary_color: "#4fe0c6",
      accent_color: "#ff7a59",
      surface_color: "#18232d",
      background_color: "#0b1117",
      heading_font: "'Arial Narrow', 'Avenir Next Condensed', sans-serif",
      body_font: "'Segoe UI', 'Helvetica Neue', sans-serif",
      button_radius: "18px",
    },
  },
];

function hexToHslParts(hex: string): string {
  const sanitized = hex.replace("#", "");
  const normalized = sanitized.length === 3 ? sanitized.split("").map((char) => `${char}${char}`).join("") : sanitized;
  const red = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const green = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) {
    return `0 0% ${Math.round(lightness * 100)}%`;
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  hue /= 6;

  return `${Math.round(hue * 360)} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%`;
}

export function getThemePreset(id: ThemeId | string | null | undefined): ThemePreset {
  return themePresets.find((preset) => preset.id === id) ?? themePresets[0];
}

export function resolveThemeSettings(settings: SiteSettings | null | undefined): {
  theme: ThemePreset;
  values: ThemeSettings;
} {
  const theme = getThemePreset(settings?.active_theme);
  return {
    theme,
    values: {
      ...theme.defaults,
      ...(settings?.theme_settings ?? {}),
    },
  };
}

export function buildThemeCssVariables(settings: SiteSettings | null | undefined): CSSProperties {
  const { theme, values } = resolveThemeSettings(settings);
  const darkTheme = theme.id === "studio-carbon";

  const backgroundHsl = hexToHslParts(values.background_color);
  const surfaceHsl = hexToHslParts(values.surface_color);
  const primaryHsl = hexToHslParts(values.primary_color);
  const accentHsl = hexToHslParts(values.accent_color);

  return {
    ["--font-heading" as string]: values.heading_font,
    ["--font-body" as string]: values.body_font,
    ["--radius" as string]: values.button_radius,
    ["--background" as string]: backgroundHsl,
    ["--foreground" as string]: darkTheme ? "210 33% 96%" : "217 33% 15%",
    ["--muted" as string]: darkTheme ? "214 24% 16%" : "36 32% 92%",
    ["--muted-foreground" as string]: darkTheme ? "210 15% 72%" : "215 14% 35%",
    ["--card" as string]: surfaceHsl,
    ["--card-foreground" as string]: darkTheme ? "210 33% 96%" : "217 33% 15%",
    ["--border" as string]: darkTheme ? "214 20% 24%" : "35 26% 83%",
    ["--input" as string]: darkTheme ? "214 20% 24%" : "35 26% 83%",
    ["--primary" as string]: primaryHsl,
    ["--primary-foreground" as string]: darkTheme ? "215 40% 8%" : "210 40% 98%",
    ["--ring" as string]: accentHsl,
    ["--theme-accent" as string]: values.accent_color,
    ["--theme-primary" as string]: values.primary_color,
    ["--theme-background" as string]: values.background_color,
    ["--theme-surface" as string]: values.surface_color,
    ["--theme-hero-gradient" as string]:
      theme.id === "studio-carbon"
        ? "linear-gradient(135deg, #0b1117 0%, #132634 55%, #163a44 100%)"
        : "linear-gradient(135deg, #f6efe5 0%, #f2e6d3 36%, #0f3d56 100%)",
    ["--theme-hero-text" as string]: theme.id === "studio-carbon" ? "#f8fffd" : "#ffffff",
  };
}
