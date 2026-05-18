import Script from "next/script";
import { GOOGLE_ADS_ID } from "@/lib/google-ads";

export { GOOGLE_ADS_ID, GOOGLE_ADS_SIGNUP_CONVERSION } from "@/lib/google-ads";

export function GoogleAdsTag() {
  if (!GOOGLE_ADS_ID) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
