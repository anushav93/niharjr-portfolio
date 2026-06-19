'use client';

import { useEffect, useState } from 'react';
import { CONSENT_KEY } from './ClarityScript';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const handleChoice = (accepted: boolean) => {
    localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'declined');
    window.dispatchEvent(new CustomEvent('analytics-consent', { detail: { accepted } }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 right-4 z-[100] max-w-xs p-3 rounded-sm shadow-lg border border-[#544536]"
      style={{ backgroundColor: '#2a231f' }}
    >
      <p className="text-[11px] leading-snug text-[#f5f0e8] mb-3">
        We use cookies only for the performance of the website.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleChoice(false)}
          className="flex-1 px-2 py-1.5 text-[10px] tracking-[0.12em] uppercase border border-[#6e5c44] text-[#e8dcc8] hover:border-[#bfa078] hover:text-[#faf8f5] transition-colors"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => handleChoice(true)}
          className="flex-1 px-2 py-1.5 text-[10px] tracking-[0.12em] uppercase bg-[#faf8f5] text-[#2a231f] hover:bg-[#f5f0e8] transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
