import type { FaqItem } from "@/lib/geo/pillar-faqs";

type Props = {
  heading?: string;
  faqs: FaqItem[];
  className?: string;
  dark?: boolean;
};

export function PageFaqBlock({ heading = "Frequently asked questions", faqs, className = "", dark = false }: Props) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const summaryCls = dark
    ? "cursor-pointer list-none font-bold text-white"
    : "cursor-pointer list-none font-bold text-slate-900";
  const answerCls = dark ? "mt-3 text-sm text-slate-300" : "mt-3 text-sm text-slate-600";
  const cardCls = dark
    ? "rounded-xl border border-slate-700 bg-slate-900/60 p-5 open:border-amber-500/40"
    : "rounded-xl border border-slate-200 bg-white p-5 shadow-sm open:border-emerald-400";

  return (
    <section className={className} aria-labelledby="geo-faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <h2 id="geo-faq-heading" className="text-xl font-bold text-inherit">
        {heading}
      </h2>
      <div className="mt-4 space-y-3">
        {faqs.map((f) => (
          <details key={f.question} className={cardCls}>
            <summary className={summaryCls}>{f.question}</summary>
            <p className={answerCls}>{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
