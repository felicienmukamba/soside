/**
 * Renders a schema.org object as a <script type="application/ld+json">.
 * `data` is always our own static, developer-authored content (see
 * lib/schema.ts) — never user input — so dangerouslySetInnerHTML is safe here.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
