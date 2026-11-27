import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { FileText } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="px-4 py-10 space-y-8">
      <Seo
        title="Terms of Service | RentNest"
        description="Terms and conditions for listing properties, scheduling visits, and using RentNest tenant tools."
        canonicalPath="/terms"
      />

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <FileText className="w-4 h-4" />
            <span>Platform Usage Terms</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            RentNest Terms of Service
          </h1>
          <p className="text-xs text-slate-500">Last updated: November 2026</p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            <strong>1. Truthful Disclosures:</strong> Landlords and brokers must accurately declare monthly rent, security deposit, brokerage amount, electricity meter type (direct PGVCL vs sub-meter unit rate), and water schedule.
          </p>
          <p>
            <strong>2. Anti-Scam Safety:</strong> Tenants should never transfer token or advance deposits before physically inspecting the property with a generated Visit Pass. Suspicious listings may be reported and quarantined.
          </p>
          <p>
            <strong>3. Tenant Tools Disclaimer:</strong> The HRA calculator, 11-month agreement drafter, and move-in checklist are informational templates and do not constitute formal legal or tax advice.
          </p>
          <p>
            Questions about data handling? Read our <Link to="/privacy-policy" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
