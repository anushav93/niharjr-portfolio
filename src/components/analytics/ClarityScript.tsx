'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'analytics-consent';

type ClarityScriptProps = {
  clarityId: string;
};

export default function ClarityScript({ clarityId }: ClarityScriptProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      setEnabled(true);
    }

    const handleConsent = (e: Event) => {
      const detail = (e as CustomEvent<{ accepted: boolean }>).detail;
      if (detail.accepted) setEnabled(true);
    };

    window.addEventListener('analytics-consent', handleConsent);
    return () => window.removeEventListener('analytics-consent', handleConsent);
  }, []);

  if (!enabled) return null;

  return (
    <Script
      id="clarity-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
      }}
    />
  );
}

export { CONSENT_KEY };
