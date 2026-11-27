import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { ShieldCheck, Lock, Trash2, EyeOff } from 'lucide-react';

const PrivacyPolicyPage = () => {
  return (
    <div className="px-4 py-10 space-y-8">
      <Seo
        title="Privacy Policy & Data Protection | RentNest"
        description="Learn how RentNest collects, protects, and lets you manage your personal information, KYC verification proofs, and analytics preferences."
        canonicalPath="/privacy-policy"
      />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
            <span>DPDP Act 2023 Aligned Privacy Standard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            RentNest Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Last updated: November 2026</p>
        </div>

        <div className="space-y-5 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-1.5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We collect only what is needed to run verified rental listings and visit passes: your name, verified Indian mobile number, optional email, city, property listing details, chat messages, and (for landlords requesting verification) an electricity bill or property tax document.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <EyeOff className="w-4 h-4 text-indigo-600" />
              <span>2. How KYC Proofs &amp; Contact Privacy Are Protected</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Uploaded utility bills and consumer numbers are never shared with tenants or public visitors. After an Admin reviews a pending KYC request, raw KYC document URLs are purged from the user record while retaining only the verification status. Landlords can also set their contact preference to <strong>Verified Only</strong> to hide their phone number from unverified users.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-base font-extrabold text-slate-900">3. Analytics &amp; Cookies</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We use essential `HttpOnly` authentication cookies for session security and Google Analytics 4 (`G-LLWCM48NRV`) without sending personal identifiers (no phone numbers, emails, names, or PANs). You can accept or decline analytics cookies anytime via our consent banner.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>4. Soft Deletion &amp; Right to Erasure</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Deleting a property listing, saved search, or your account performs a soft deactivation (`isDeleted`) that immediately hides your data from active users, clears saved wishlists/KYC files, and revokes active sessions. You can deactivate your account directly from your <Link to="/dashboard" className="text-blue-600 font-bold hover:underline">Dashboard</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
