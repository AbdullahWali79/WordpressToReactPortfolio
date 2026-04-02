"use client";

import { useMemo } from "react";

import { calculateSeoScore } from "@/lib/seo/score";

type SeoScorePanelProps = {
  title: string;
  slug: string;
  contentHtml: string;
  metaDescription?: string;
  seoTitle?: string;
  focusKeyword?: string;
  imageAlt?: string;
  canonicalUrl?: string;
};

export function SeoScorePanel({
  title,
  slug,
  contentHtml,
  metaDescription,
  seoTitle,
  focusKeyword,
  imageAlt,
  canonicalUrl,
}: SeoScorePanelProps) {
  const result = useMemo(
    () =>
      calculateSeoScore({
        title,
        slug,
        contentHtml,
        metaDescription,
        seoTitle,
        focusKeyword,
        imageAlt,
        canonicalUrl,
      }),
    [canonicalUrl, contentHtml, focusKeyword, imageAlt, metaDescription, seoTitle, slug, title],
  );

  const tone =
    result.status === "good"
      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
      : result.status === "average"
        ? "text-amber-700 bg-amber-50 border-amber-200"
        : "text-red-700 bg-red-50 border-red-200";

  return (
    <aside className="space-y-4 rounded-lg border bg-card p-4">
      <div className={`rounded-md border px-3 py-2 text-sm font-medium ${tone}`}>SEO Score: {result.score}/100</div>
      <div className="space-y-2">
        {result.checks.map((check) => (
          <div key={check.id} className="rounded border p-2 text-sm">
            <p className={check.passed ? "text-emerald-700" : "text-red-700"}>
              {check.passed ? "Passed" : "Needs work"}: {check.label}
            </p>
            {!check.passed ? <p className="mt-1 text-xs text-muted-foreground">{check.recommendation}</p> : null}
          </div>
        ))}
      </div>

      {result.warnings.length ? (
        <div>
          <h4 className="mb-2 text-sm font-semibold">Recommendations</h4>
          <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
