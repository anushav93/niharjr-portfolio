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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-xs p-3 rounded-sm shadow-lg border border-primary-700 bg-brand-dark"
    >
      <p className="text-[11px] leading-snug text-primary-100 mb-3">
        We use cookies only for the performance of the website.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleChoice(false)}
          className="flex-1 px-2 py-1.5 text-[10px] tracking-[0.12em] uppercase border border-primary-600 text-primary-200 hover:border-primary-400 hover:text-primary-50 transition-colors"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => handleChoice(true)}
          className="flex-1 px-2 py-1.5 text-[10px] tracking-[0.12em] uppercase bg-brand-light text-brand-dark hover:bg-primary-100 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
