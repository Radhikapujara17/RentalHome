import React, { useState } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';
import { FileText, Printer, Copy, Check, Shield } from 'lucide-react';

const AgreementGeneratorPage = () => {
  const [formData, setFormData] = useState({
    landlordName: 'Jayeshbhai Mohanbhai Patel',
    landlordAddress: 'Rajkot, Gujarat',
    landlordPhone: '+91 98765 43202',
    tenantName: 'Priya Rajesh Mehta',
    tenantPermanentAddress: 'Paldi, Ahmedabad, Gujarat',
    tenantPhone: '+91 98765 43201',
    propertyAddress: 'Flat 402, 4th Floor, Radhika Heights, Opposite Cosmoplex Cinema, Kalawad Road, Rajkot',
    monthlyRent: 16500,
    securityDeposit: 33000,
    maintenanceAmount: 1500,
    meterType: 'direct_govt_pgvcl',
    subMeterRate: 0,
    lockInPeriodMonths: 6,
    noticePeriodDays: 30,
    landlordUpiId: 'jayesh.patel@okaxis',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [agreementText, setAgreementText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/tools/rental-agreement', formData);
      if (res.data.success) {
        setAgreementText(res.data.agreementText);
        toast.success('Gujarat 11-Month Agreement Drafted!');
      }
    } catch (err) {
      toast.error('Failed to generate agreement');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(agreementText);
    setCopied(true);
    toast.success('Agreement copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gujarat Tenancy Legal Framework</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Gujarat Standard 11-Month Rental Agreement Drafter
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto">
          Generate a legally robust residential rent agreement draft covering security deposit protection, electricity meter reality, and notice terms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Agreement Parties & Terms
          </h3>

          <form onSubmit={handleGenerate} className="space-y-3 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">Landlord / Owner Name</label>
              <input
                type="text"
                value={formData.landlordName}
                onChange={(e) => setFormData({ ...formData, landlordName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Tenant Full Name</label>
              <input
                type="text"
                value={formData.tenantName}
                onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Rented Property Full Address</label>
              <textarea
                rows={2}
                value={formData.propertyAddress}
                onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-bold text-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Lock-in Period (Months)</label>
                <input
                  type="number"
                  value={formData.lockInPeriodMonths}
                  onChange={(e) => setFormData({ ...formData, lockInPeriodMonths: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Notice Period (Days)</label>
                <input
                  type="number"
                  value={formData.noticePeriodDays}
                  onChange={(e) => setFormData({ ...formData, noticePeriodDays: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Electricity Meter Reality Clause</label>
              <select
                value={formData.meterType}
                onChange={(e) => setFormData({ ...formData, meterType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white font-bold"
              >
                <option value="direct_govt_pgvcl">Direct Independent PGVCL Govt Meter</option>
                <option value="sub_meter">Sub-Meter with fixed unit tariff</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Landlord UPI ID (For Direct Rent QR Code)</label>
              <input
                type="text"
                placeholder="e.g. jayesh.patel@okaxis or 9876543202@upi"
                value={formData.landlordUpiId}
                onChange={(e) => setFormData({ ...formData, landlordUpiId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all"
            >
              Draft Legal Agreement
            </button>
          </form>
        </div>

        {/* Legal Text Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-black text-slate-800">11-Month Tenancy Agreement Draft</span>
              </div>
              {agreementText && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              )}
            </div>

            {agreementText ? (
              <div className="space-y-4">
                {/* Embedded NPCI UPI Payment QR Code */}
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200">
                      ⚡ 1-Click Monthly Rent Payment QR Code
                    </span>
                    <div className="text-lg font-black text-slate-900">
                      ₹{Number(formData.monthlyRent || 0).toLocaleString()} / month
                    </div>
                    <div className="text-xs text-slate-700 font-mono font-bold">
                      UPI ID: {formData.landlordUpiId || 'rentnest@upi'}
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Tenant scans to settle rent via Google Pay, PhonePe, Paytm, or BHIM directly to landlord bank account.
                    </p>
                  </div>

                  <div className="p-2 bg-white rounded-xl border border-emerald-200 shadow-sm shrink-0 text-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(`upi://pay?pa=${formData.landlordUpiId || 'rentnest@upi'}&pn=${encodeURIComponent(formData.landlordName || 'Landlord')}&am=${formData.monthlyRent}&cu=INR&tn=Rent_Payment`)}`}
                      alt="UPI Rent Payment QR Code"
                      className="w-24 h-24 mx-auto rounded-lg"
                    />
                    <span className="text-[9px] font-bold text-slate-500 block mt-1">Scan with UPI</span>
                  </div>
                </div>

                <pre className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                  {agreementText}
                </pre>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-extrabold text-slate-700">Click "Draft Legal Agreement"</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Generates standard Gujarat rent agreement template ready for ₹300 stamp paper printing or e-stamping.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default AgreementGeneratorPage;
