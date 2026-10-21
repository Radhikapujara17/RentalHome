import React from 'react';
import { useCompare } from '../context/CompareContext';
import { X, Trash2, Zap, Droplets, Leaf, ShieldCheck, Check, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompareModal = () => {
  const { shortlist, removeFromCompare, clearCompare, isCompareModalOpen, setIsCompareModalOpen } = useCompare();

  if (!isCompareModalOpen || shortlist.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-extrabold">Side-by-Side Property Comparison</span>
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {shortlist.length} {shortlist.length === 1 ? 'Property' : 'Properties'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-rose-400 font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-4 px-3 w-44 font-bold text-slate-500 uppercase tracking-wider bg-slate-50 rounded-tl-xl">
                  Comparison Metric
                </th>
                {shortlist.map((prop) => (
                  <th key={prop._id} className="py-4 px-4 min-w-[240px] align-top">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(prop._id)}
                        className="absolute -top-2 -right-2 p-1 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full border border-slate-200 shadow-sm"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <img
                        src={prop.photos?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                        alt={prop.title}
                        className="w-full h-32 object-cover rounded-xl mb-2"
                      />
                      <div className="font-extrabold text-sm text-slate-900 line-clamp-1">{prop.societyName}</div>
                      <div className="text-slate-500 text-[11px] font-medium">{prop.locality} • {prop.bhk}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              
              {/* Monthly Rent */}
              <tr>
                <td className="py-3 px-3 font-bold text-slate-700 bg-slate-50">Monthly Rent</td>
                {shortlist.map((prop) => (
                  <td key={prop._id} className="py-3 px-4 font-black text-blue-600 text-sm">
                    ₹{prop.pricing.monthlyRent.toLocaleString()}
                  </td>
                ))}
              </tr>

              {/* Security Deposit */}
              <tr>
                <td className="py-3 px-3 font-bold text-slate-700 bg-slate-50">Security Deposit</td>
                {shortlist.map((prop) => (
                  <td key={prop._id} className="py-3 px-4 text-slate-800">
                    ₹{prop.pricing.securityDeposit.toLocaleString()} ({prop.pricing.depositMonths || 2} mos)
                  </td>
                ))}
              </tr>

              {/* Maintenance Fee */}
              <tr>
                <td className="py-3 px-3 font-bold text-slate-700 bg-slate-50">Monthly Maintenance</td>
                {shortlist.map((prop) => (
                  <td key={prop._id} className="py-3 px-4 text-slate-800">
                    {prop.pricing.maintenanceAmount ? `₹${prop.pricing.maintenanceAmount}` : 'Included in Rent'}
                  </td>
                ))}
              </tr>

              {/* Total Monthly Outflow */}
              <tr className="bg-blue-50/40">
                <td className="py-3 px-3 font-extrabold text-blue-900 bg-blue-100/60">Total Estimated Outflow</td>
                {shortlist.map((prop) => (
                  <td key={prop._id} className="py-3 px-4 font-extrabold text-blue-900 text-sm">
                    ₹{(prop.pricing.monthlyRent + (prop.pricing.maintenanceAmount || 0)).toLocaleString()}/mo
                  </td>
                ))}
              </tr>

              {/* Brokerage */}
              <tr>
                <td className="py-3 px-3 font-bold text-slate-700 bg-slate-50">Brokerage Terms</td>
                {shortlist.map((prop) => (
                  <td key={prop._id} className="py-3 px-4">
                    {prop.pricing.brokerageAmount === 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Zero Brokerage (Direct Owner)
                      </span>
                    ) : (
                      <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        ₹{prop.pricing.brokerageAmount} ({prop.owner?.brokerDetails?.brokerageTerms || 'Broker'})
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Electricity Meter */}
              <tr>
                <td className="py-3 px-3 font-bold text-slate-700 bg-slate-50">Electricity Meter Reality</td>
                {shortlist.map((prop) => (
                  <td key={prop._id} className="py-3 px-4">
                    {prop.utilities.electricityMeterType === 'direct_govt_pgvcl' ? (
                      <span className="text-blue-700 font-bold flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5 text-blue-500" />
                        <span>Direct PGVCL Govt Meter (Bill rate)</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold flex items-center space-x-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Sub-meter (₹{prop.utilities.subMeterUnitRate}/unit)</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Water Supply */}
              <tr>
                <td className="py-3 px-3 font-bold text-slate-700 bg-slate-50">Water Supply</td>
                {shortlist.map((prop) => (
                  <td key={prop._id} className="py-3 px-4">
                    <span className="text-cyan-800 font-semibold flex items-center space-x-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{prop.utilities.waterScheduleHours}</span>
                    </span>
                  </td>
                ))}
              </tr>

              {/* Food & Rules */}
              <tr>
                <td className="py-3 px-3 font-bold text-slate-700 bg-slate-50">Dietary & Living Rules</td>
                {shortlist.map((prop) => (
                  <td key={prop._id} className="py-3 px-4">
                    <div className="font-bold text-slate-800">{prop.rules.foodPreference}</div>
                    <div className="text-[11px] text-slate-500">{prop.rules.allowedTenants} • {prop.rules.gateCurfew}</div>
                  </td>
                ))}
              </tr>

              {/* Furnishing */}
              <tr>
                <td className="py-3 px-3 font-bold text-slate-700 bg-slate-50">Furnishing & Carpet Area</td>
                {shortlist.map((prop) => (
                  <td key={prop._id} className="py-3 px-4 text-slate-700">
                    <div className="font-bold">{prop.furnishingStatus}</div>
                    <div className="text-[11px] text-slate-500">{prop.carpetAreaSqFt} sq.ft carpet area</div>
                  </td>
                ))}
              </tr>

              {/* Direct Actions */}
              <tr>
                <td className="py-4 px-3 font-bold text-slate-700 bg-slate-50 rounded-bl-xl">Direct Actions</td>
                {shortlist.map((prop) => {
                  const num = prop.owner?.phone ? prop.owner.phone.replace(/[^0-9]/g, '') : '919876543202';
                  const msg = encodeURIComponent(`Hi! Inquiring about ${prop.bhk} in ${prop.societyName}, ${prop.locality} on RentNest.`);
                  return (
                    <td key={prop._id} className="py-4 px-4">
                      <div className="space-y-2">
                        <a
                          href={`https://wa.me/${num}?text=${msg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-center flex items-center justify-center space-x-1.5 shadow-sm transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Owner</span>
                        </a>
                        <Link
                          to={`/property/${prop.slug || prop._id}`}
                          onClick={() => setIsCompareModalOpen(false)}
                          className="block w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-center rounded-xl transition-colors text-[11px]"
                        >
                          View Full Details
                        </Link>
                      </div>
                    </td>
                  );
                })}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default CompareModal;
