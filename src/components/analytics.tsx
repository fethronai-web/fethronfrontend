import Script from "next/script";

/**
 * Site analytics — loaded once in the root layout, so it covers BOTH the studio
 * (fethron.com) and the agent (aistudio.fethron.com), which share this deployment.
 *
 * - Microsoft Clarity: heatmaps + session recordings (where people click / scroll /
 *   drop off). Project id is public by design (it only writes events).
 * - Google Analytics 4: traffic, top pages, sources, engagement time. Set
 *   NEXT_PUBLIC_GA_ID in Vercel to enable it (left off until the id exists).
 *
 * Only runs in production, so local dev + noise never pollutes the data.
 */
const CLARITY_ID = "x592ymmglg";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script id="ms-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
      </Script>

      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
    </>
  );
}
