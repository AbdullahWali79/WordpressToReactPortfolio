"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getThemePreset, themePresets } from "@/lib/theme/presets";
import type { ThemeId, ThemeSettings } from "@/types/database";

type AppearanceFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  initialTheme: ThemeId;
  initialValues: ThemeSettings;
};

export function AppearanceForm({ action, initialTheme, initialValues }: AppearanceFormProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeId>(initialTheme);
  const [values, setValues] = useState<ThemeSettings>(initialValues);

  const activePreset = getThemePreset(activeTheme);

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="active_theme" value={activeTheme} />

      <section className="grid gap-5 lg:grid-cols-2">
        {themePresets.map((preset) => {
          const isSelected = preset.id === activeTheme;
          return (
            <button
              key={preset.id}
              type="button"
              className="text-left"
              onClick={() => {
                setActiveTheme(preset.id);
                setValues(preset.defaults);
              }}
            >
              <Card className={isSelected ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>{preset.name}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">{preset.description}</p>
                    </div>
                    <span className="rounded-full border px-3 py-1 text-xs">{isSelected ? "Selected" : "Preset"}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="rounded-4 border p-4 text-white"
                    style={{
                      background:
                        preset.id === "studio-carbon"
                          ? "linear-gradient(135deg, #0b1117 0%, #132634 60%, #163a44 100%)"
                          : "linear-gradient(135deg, #f6efe5 0%, #f2e6d3 36%, #0f3d56 100%)",
                      color: preset.id === "studio-carbon" ? "#f7fffd" : "#ffffff",
                    }}
                  >
                    <p className="mb-2 small text-uppercase opacity-75">{preset.eyebrow}</p>
                    <h3 className="mb-2 text-3xl font-semibold" style={{ fontFamily: preset.defaults.heading_font }}>
                      {preset.headline}
                    </h3>
                    <p className="mb-3 opacity-75" style={{ fontFamily: preset.defaults.body_font }}>
                      {preset.sampleCopy}
                    </p>
                    <div className="d-flex gap-2">
                      <span
                        className="rounded-pill px-3 py-2 text-sm fw-semibold"
                        style={{ backgroundColor: preset.defaults.accent_color, color: "#fff" }}
                      >
                        Accent
                      </span>
                      <span className="rounded-pill border px-3 py-2 text-sm fw-semibold" style={{ borderColor: "rgba(255,255,255,0.35)" }}>
                        Hero
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="primary_color">Primary Color</Label>
              <Input
                id="primary_color"
                name="primary_color"
                type="color"
                value={values.primary_color}
                onChange={(e) => setValues((current) => ({ ...current, primary_color: e.target.value }))}
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="accent_color">Accent Color</Label>
              <Input
                id="accent_color"
                name="accent_color"
                type="color"
                value={values.accent_color}
                onChange={(e) => setValues((current) => ({ ...current, accent_color: e.target.value }))}
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="surface_color">Surface Color</Label>
              <Input
                id="surface_color"
                name="surface_color"
                type="color"
                value={values.surface_color}
                onChange={(e) => setValues((current) => ({ ...current, surface_color: e.target.value }))}
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="background_color">Background Color</Label>
              <Input
                id="background_color"
                name="background_color"
                type="color"
                value={values.background_color}
                onChange={(e) => setValues((current) => ({ ...current, background_color: e.target.value }))}
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="heading_font">Heading Font Stack</Label>
              <Input
                id="heading_font"
                name="heading_font"
                value={values.heading_font}
                onChange={(e) => setValues((current) => ({ ...current, heading_font: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="body_font">Body Font Stack</Label>
              <Input
                id="body_font"
                name="body_font"
                value={values.body_font}
                onChange={(e) => setValues((current) => ({ ...current, body_font: e.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="button_radius">Button Radius</Label>
              <Input
                id="button_radius"
                name="button_radius"
                value={values.button_radius}
                onChange={(e) => setValues((current) => ({ ...current, button_radius: e.target.value }))}
                placeholder="14px"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">Save Appearance</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Preview Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="rounded-md border p-3">
              <p className="font-medium text-foreground">Active Theme</p>
              <p className="mt-1">{activePreset.name}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="font-medium text-foreground">Best For</p>
              <p className="mt-1">{activePreset.description}</p>
            </div>
            <div
              className="rounded-4 border p-4"
              style={{
                background: values.background_color,
                color: activeTheme === "studio-carbon" ? "#f7fffd" : "#13212e",
              }}
            >
              <p className="mb-2 text-uppercase small opacity-75">Preview</p>
              <h3 className="mb-2 text-2xl font-semibold" style={{ fontFamily: values.heading_font }}>
                Brand-ready portfolio publishing
              </h3>
              <p className="mb-3" style={{ fontFamily: values.body_font }}>
                This preview reflects your current palette and font choices before you save them live.
              </p>
              <div className="d-flex gap-2">
                <span
                  className="rounded-pill px-3 py-2 text-sm fw-semibold"
                  style={{ backgroundColor: values.primary_color, color: "#fff" }}
                >
                  Primary
                </span>
                <span
                  className="rounded-pill px-3 py-2 text-sm fw-semibold"
                  style={{ backgroundColor: values.accent_color, color: "#fff" }}
                >
                  Accent
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </form>
  );
}
