import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

const CONSENT_STORAGE_KEY = 'rentnest_analytics_consent';

const applyGtagConsent = (granted) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }
};

const ConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (saved === 'granted') {
      applyGtagConsent(true);
    } else if (saved === 'denied') {
      applyGtagConsent(false);
    } else {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleChoice = (granted) => {
    localStorage.setItem(CONSENT_STORAGE_KEY, granted ? 'granted' : 'denied');
    applyGtagConsent(granted);
    setVisible(false);
  };

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 space-y-3 print:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-extrabold tracking-wide uppercase text-emerald-300">
              Privacy &amp; Analytics Notice
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              We use essential security cookies and privacy-safe analytics (no phone, email, or KYC data sent). Read our{' '}
              <Link to="/privacy-policy" className="underline text-white hover:text-blue-300">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleChoice(false)}
          aria-label="Decline analytics cookies"
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <button
          type="button"
          onClick={() => handleChoice(false)}
          className="px-3 py-1.5 rounded-xl text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={() => handleChoice(true)}
          className="px-3.5 py-1.5 rounded-xl text-[11px] font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          Accept Analytics
        </button>
      </div>
    </div>
  );
};

export default ConsentBanner;
