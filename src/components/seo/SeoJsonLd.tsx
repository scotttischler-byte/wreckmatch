type SeoJsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function SeoJsonLd({ data }: SeoJsonLdProps) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
