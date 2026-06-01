import { PageFaqBlock } from "@/components/seo/PageFaqBlock";
import { geoFaqsForPath } from "@/lib/geo/pillar-faqs";
import { geoBrandFromHeaders, geoPathFromHeaders } from "@/lib/geo/request-brand";

export async function GeoAutoFaqInjector() {
  const pathname = await geoPathFromHeaders();
  const brand = await geoBrandFromHeaders();
  const faqs = geoFaqsForPath(pathname, brand);
  if (!faqs?.length) return null;

  const dark = brand === "bobbygarcia";

  return (
    <div className="mx-auto max-w-4xl px-4 pb-10">
      <PageFaqBlock faqs={faqs} dark={dark} />
    </div>
  );
}
