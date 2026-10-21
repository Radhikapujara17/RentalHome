import React, { useState } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';
import { Calculator, Printer, ShieldCheck, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

const HraCalculatorPage = () => {
  const [params, setParams] = useState({
    basicSalary: 45000,
    hraReceived: 18000,
    rentPaid: 15000,
    isMetro: false,
    tenantName: 'Priya Mehta',
    landlordName: 'Jayeshbhai Patel',
    propertyAddress: 'Radhika Heights, Kalawad Road, Rajkot, Gujarat',
    panNumber: 'AAAPA1234K',
    financialYear: '2026-2027'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/tools/hra-calculator', params);
      if (res.data.success) {
        setResult(res.data.data);
        toast.success('HRA Tax Exemption Calculated!');
      }
    } catch (err) {
      toast.error('Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Calculator className="w-3.5 h-3.5 text-emerald-600" />
          <span>Section 10(13A) Income Tax Tool</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Free 1-Click HRA Rent Receipt Generator
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto">
          Calculate your maximum tax exemption and generate instant printable monthly rent receipts compliant with Indian IT department rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Income & Rent Details
          </h3>

          <form onSubmit={handleCalculate} className="space-y-3 text-xs font-semibold">
            <div>
              <label className="block text-slate-700 mb-1">Monthly Basic Salary + DA (₹)</label>
              <input
                type="number"
                value={params.basicSalary}
                onChange={(e) => setParams({ ...params, basicSalary: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Monthly HRA Received from Employer (₹)</label>
              <input
                type="number"
                value={params.hraReceived}
                onChange={(e) => setParams({ ...params, hraReceived: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Actual Monthly Rent Paid (₹)</label>
              <input
                type="number"
                value={params.rentPaid}
                onChange={(e) => setParams({ ...params, rentPaid: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-bold text-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1">City Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setParams({ ...params, isMetro: false })}
                  className={`py-2 rounded-xl border text-center transition-all ${!params.isMetro ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                >
                  Non-Metro (Rajkot - 40%)
                </button>
                <button
                  type="button"
                  onClick={() => setParams({ ...params, isMetro: true })}
                  className={`py-2 rounded-xl border text-center transition-all ${params.isMetro ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                >
                  Metro (50%)
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div>
                <label className="block text-slate-700 mb-1">Tenant Name (Receipt)</label>
                <input
                  type="text"
                  value={params.tenantName}
                  onChange={(e) => setParams({ ...params, tenantName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Landlord Name</label>
                <input
                  type="text"
                  value={params.landlordName}
                  onChange={(e) => setParams({ ...params, landlordName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Landlord PAN (Mandatory if rent &gt; ₹1L/yr)</label>
                <input
                  type="text"
                  value={params.panNumber}
                  onChange={(e) => setParams({ ...params, panNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-600 uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Calculate & Generate Receipts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Results & Receipt Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {result ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">Annual HRA Exempt</span>
                  <span className="text-xl font-black text-emerald-700">₹{result.exemptAmount.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800 uppercase block">Taxable HRA</span>
                  <span className="text-xl font-black text-amber-700">₹{result.taxableHra.toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-bold text-blue-800 uppercase block">Annual Rent Paid</span>
                  <span className="text-xl font-black text-blue-700">₹{result.annualRent.toLocaleString()}</span>
                </div>
              </div>

              {/* Sample Printable Rent Receipt */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-black text-slate-800">Rent Receipt Preview</span>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print All 12 Months</span>
                  </button>
                </div>

                {/* Printable Receipt Box */}
                <div className="p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50/50 space-y-4 text-xs font-serif">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="font-sans font-bold text-slate-500 uppercase tracking-widest text-[10px]">Rent Receipt</span>
                    <span className="font-mono text-slate-400">Receipt No: RN-HRA-101</span>
                  </div>

                  <p className="leading-relaxed text-slate-800">
                    Received a sum of <strong>₹{params.rentPaid.toLocaleString()}/-</strong> (Rupees in words: {params.rentPaid} only) from <strong>{params.tenantName}</strong> towards house rent for the month of <strong>April 2026</strong> for residential premises situated at:
                  </p>
                  <p className="font-bold text-slate-900">{params.propertyAddress}</p>

                  <div className="pt-6 flex justify-between items-end border-t border-slate-200 font-sans">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Landlord PAN</div>
                      <div className="font-mono font-bold text-slate-700">{params.panNumber || 'Not Required (< ₹1L)'}</div>
                    </div>

                    <div className="border border-slate-300 bg-white p-2 text-center rounded text-[10px] text-slate-400 font-mono">
                      [ ₹1 REVENUE STAMP ]
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-800">{params.landlordName}</div>
                      <div className="text-[10px] text-slate-500">(Landlord Signature)</div>
                    </div>
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Calculator className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-extrabold text-slate-700">Enter your details to generate receipts</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Calculate section 10(13A) allowance and instantly download formatted rent receipts with revenue stamp placeholders.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default HraCalculatorPage;
