import { sanitizeRichText } from "@/lib/security/sanitize";

export function ContentRenderer({ html }: { html: string }) {
  return <article className="prose-rich" dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }} />;
}
