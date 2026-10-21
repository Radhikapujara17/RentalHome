import React, { useState } from 'react';
import { useCompare } from '../context/CompareContext';
import { 
  X, 
  Trash2, 
  Zap, 
  Droplets, 
  ShieldCheck, 
  Check, 
  MessageCircle, 
  Sparkles, 
  Award, 
  TrendingDown, 
  Maximize2,
  HelpCircle,
  ArrowRight,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CompareModal = () => {
  const { shortlist, removeFromCompare, clearCompare, isCompareModalOpen, setIsCompareModalOpen } = useCompare();
  const [aiFocus, setAiFocus] = useState('value'); // 'value' | 'budget' | 'space'

  if (!isCompareModalOpen || shortlist.length === 0) return null;

  // AI Evaluation Algorithm (Strictly normalized to 0 - 100)
  const evaluateProperties = () => {
    return shortlist.map((prop) => {
      let score = 0;
      let reasons = [];

      const totalMonthly = (prop.pricing?.monthlyRent || 0) + (prop.pricing?.maintenanceAmount || 0);

      if (prop.category === 'commercial') {
        // --- Commercial Property Evaluation (Max 100 pts) ---

        // 1. Industrial / Commercial Power Infrastructure (Max 20 pts)
        const hp = prop.commercialDetails?.connectedPowerLoadHp || 0;
        if (hp >= 25) {
          score += 20;
          reasons.push(`Heavy-duty power (${hp} HP 3-Phase connected load)`);
        } else if (hp >= 10) {
          score += 14;
          reasons.push(`Commercial 3-Phase load (${hp} HP)`);
        } else {
          score += 8;
        }

        // 2. Road Clearance & Logistics Access (Max 15 pts)
        const roadWidth = prop.commercialDetails?.frontageRoadWidthFt || 0;
        if (roadWidth >= 60) {
          score += 15;
          reasons.push(`Prime wide road frontage (${roadWidth} Ft clearance for logistics)`);
        } else if (roadWidth >= 40) {
          score += 10;
          reasons.push(`Wide approach road (${roadWidth} Ft)`);
        } else {
          score += 5;
        }

        // 3. Legal Compliance & BU Permission (Max 15 pts)
        if (prop.commercialDetails?.buPermissionCertified) {
          score += 15;
          reasons.push('Verified BU Permission Certified (hassle-free trade & GST licensing)');
        } else {
          score += 5;
        }

        // 4. Meter & Direct Utility Cost (Max 15 pts)
        if (prop.utilities?.electricityMeterType === 'direct_govt_pgvcl') {
          score += 15;
          reasons.push('Direct PGVCL Commercial Meter (no private sub-meter surcharges)');
        } else {
          score += 5;
        }

        // 5. Direct Deal & Brokerage Savings (Max 15 pts)
        if (prop.pricing?.brokerageAmount === 0) {
          score += 15;
          reasons.push('Zero brokerage (direct owner transaction)');
        } else {
          score += 4;
        }

        // 6. Security Deposit Terms (Max 10 pts)
        if ((prop.pricing?.depositMonths || 3) <= 3) {
          score += 10;
          reasons.push('Low capital lockup (<= 3 months deposit)');
        } else {
          score += 4;
        }

        // 7. Value & Space Factor (Max 10 pts)
        const spacePerThousand = prop.carpetAreaSqFt && totalMonthly > 0 
          ? (prop.carpetAreaSqFt / (totalMonthly / 1000)) 
          : 40;
        if (aiFocus === 'space') {
          score += Math.min(10, Math.round(spacePerThousand * 0.25));
        } else if (aiFocus === 'budget') {
          score += Math.min(10, Math.max(0, Math.round((70000 - totalMonthly) / 5000)));
        } else {
          score += Math.min(10, Math.round((spacePerThousand * 0.12) + Math.max(0, (70000 - totalMonthly) / 10000)));
        }

      } else {
        // --- Residential Property Evaluation (Max 100 pts) ---

        // 1. Electricity Meter Analysis (Max 25 pts)
        // Direct PGVCL avoids huge sub-meter markups in Gujarat
        if (prop.utilities?.electricityMeterType === 'direct_govt_pgvcl') {
          score += 25;
          reasons.push('Direct PGVCL Govt Meter (avoids ₹10-₹12/unit sub-meter markups)');
        } else {
          score += 8;
        }

        // 2. Water Supply Reliability (Max 20 pts)
        if (prop.utilities?.waterSupplyType === '24_7_continuous') {
          score += 20;
          reasons.push('24/7 continuous municipal Narmada water (no tanker bills)');
        } else if (prop.utilities?.waterSupplyType === 'scheduled_municipal') {
          score += 14;
          reasons.push('Daily scheduled municipal water supply');
        } else {
          score += 6;
        }

        // 3. Brokerage Elimination (Max 20 pts)
        if (prop.pricing?.brokerageAmount === 0) {
          score += 20;
          reasons.push('Zero brokerage (direct owner listing saves up to 1 month rent)');
        } else {
          score += 5;
        }

        // 4. Low Security Deposit (Max 15 pts)
        const depMonths = prop.pricing?.depositMonths || 2;
        if (depMonths <= 1) {
          score += 15;
          reasons.push('Ultra-low 1-month security deposit');
        } else if (depMonths <= 2) {
          score += 12;
          reasons.push('Standard low 2-month security deposit');
        } else {
          score += 5;
        }

        // 5. Space & Budget Optimization (Max 10 pts)
        const spacePerThousand = prop.carpetAreaSqFt && totalMonthly > 0 
          ? (prop.carpetAreaSqFt / (totalMonthly / 1000)) 
          : 50;
        if (aiFocus === 'space') {
          score += Math.min(10, Math.round(spacePerThousand * 0.2));
        } else if (aiFocus === 'budget') {
          score += Math.min(10, Math.max(0, Math.round((35000 - totalMonthly) / 2500)));
        } else {
          score += Math.min(10, Math.round((spacePerThousand * 0.1) + Math.max(0, (35000 - totalMonthly) / 5000)));
        }

        // 6. Ownership & Verification Trust (Max 10 pts)
        if (prop.ownershipVerified || prop.isVerified) {
          score += 10;
          reasons.push('Verified Ownership & Utility Document');
        } else {
          score += 3;
        }
      }

      // Hard clamp strictly within 10 to 100
      const finalScore = Math.min(100, Math.max(10, Math.round(score)));

      return {
        ...prop,
        aiScore: finalScore,
        primaryReason: reasons[0] || 'Good all-round balance',
        keyReasons: reasons,
        totalMonthly
      };
    }).sort((a, b) => b.aiScore - a.aiScore);
  };

  const scoredProperties = evaluateProperties();
  const bestFit = scoredProperties[0];
  const hasCommercial = shortlist.some((p) => p.category === 'commercial');

  const handleShareWhatsApp = () => {
    const listSummary = scoredProperties
      .map((p, idx) => `${idx + 1}. ${p.title} (${p.locality}, ${p.city || 'Gujarat'})\n   Rent: ₹${p.pricing.monthlyRent}/mo | Score: ${p.aiScore}/100\n   Highlight: ${p.primaryReason}`)
      .join('\n\n');

    const msg = encodeURIComponent(
      `🏠 RentNest Property Comparison:\n\n` +
      `⭐ AI Best-Fit: ${bestFit.title} (Score: ${bestFit.aiScore}/100)\n\n` +
      `${listSummary}\n\n` +
      `Compare true living costs (PGVCL meter, water, deposit) directly on RentNest!`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        
        {/* Sticky Modal Header */}
        <div className="bg-slate-900 px-4 sm:px-6 py-3.5 sm:py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="text-base sm:text-lg font-black tracking-tight">Side-by-Side Comparison</span>
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {shortlist.length} {shortlist.length === 1 ? 'Home' : 'Homes'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareWhatsApp}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-sm"
              title="Share comparison summary to WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share to WhatsApp</span>
            </button>
            <button
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-rose-400 font-semibold px-2 sm:px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close Comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* AI Best Fit Recommendation Banner */}
          {shortlist.length >= 2 && bestFit && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold flex items-center space-x-1.5">
                      <span>RentNest AI Verdict: Top Recommended Match</span>
                      <span className="text-[10px] bg-emerald-500 text-white font-black px-1.5 py-0.2 rounded-md uppercase">
                        AI Score {bestFit.aiScore}/100
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Calculated using PGVCL electricity rates, water stability, security deposit & carpet area efficiency.
                    </p>
                  </div>
                </div>

                {/* AI Persona Selector Pills */}
                <div className="flex items-center space-x-1 bg-white/10 p-1 rounded-xl text-[10px] font-bold self-start sm:self-auto">
                  <button
                    onClick={() => setAiFocus('value')}
                    className={`px-2 py-1 rounded-lg transition-colors ${aiFocus === 'value' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                  >
                    Best Overall
                  </button>
                  <button
                    onClick={() => setAiFocus('budget')}
                    className={`px-2 py-1 rounded-lg transition-colors ${aiFocus === 'budget' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                  >
                    Lowest Outflow
                  </button>
                  <button
                    onClick={() => setAiFocus('space')}
                    className={`px-2 py-1 rounded-lg transition-colors ${aiFocus === 'space' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'}`}
                  >
                    Max Space
                  </button>
                </div>
              </div>

              {/* Winner Details & Rationale */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="space-y-1">
                  <div className="font-extrabold text-white text-sm flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Winner: {bestFit.societyName || bestFit.title} ({bestFit.locality})</span>
                  </div>
                  <p className="text-slate-200 text-xs">
                    💡 <strong>Why it wins:</strong> {bestFit.primaryReason}. Total monthly outflow is ₹{bestFit.totalMonthly.toLocaleString()}.
                  </p>
                </div>

                <Link
                  to={`/property/${bestFit.slug || bestFit._id}`}
                  onClick={() => setIsCompareModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 text-center shadow-md shadow-blue-500/30 transition-transform active:scale-95"
                >
                  View Top Pick →
                </Link>
              </div>
            </div>
          )}

          {/* Swipe indicator hint on mobile */}
          <div className="lg:hidden flex items-center justify-center space-x-1.5 text-[11px] font-bold text-slate-400 pb-1">
            <span>← Swipe table horizontally to compare →</span>
          </div>

          {/* Responsive Comparison Table with Horizontal Scroll */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-3 px-3 sm:px-4 w-36 sm:w-48 font-bold text-slate-500 uppercase tracking-wider text-[10px] sm:text-xs">
                    Metric
                  </th>
                  {shortlist.map((prop) => {
                    const scored = scoredProperties.find((p) => p._id === prop._id) || prop;
                    const isWinner = bestFit && bestFit._id === prop._id && shortlist.length >= 2;
                    return (
                      <th key={prop._id} className={`py-3 px-3 sm:px-4 min-w-[210px] sm:min-w-[250px] align-top ${isWinner ? 'bg-blue-50/50' : ''}`}>
                        <div className="relative">
                          {isWinner && (
                            <span className="absolute -top-2 left-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center space-x-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>AI Best Fit</span>
                            </span>
                          )}

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
                            className="w-full h-28 sm:h-32 object-cover rounded-xl mb-2 mt-2"
                          />
                          <div className="flex items-center justify-between gap-1">
                            <div className="font-extrabold text-xs sm:text-sm text-slate-900 line-clamp-1">{prop.societyName || prop.title}</div>
                            <span className="shrink-0 text-[10px] font-black bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md">
                              {scored.aiScore}/100
                            </span>
                          </div>
                          <div className="text-slate-500 text-[10px] sm:text-[11px] font-medium">
                            {prop.locality} • {prop.category === 'commercial' ? `⚡ ${prop.commercialDetails?.connectedPowerLoadHp || 10} HP` : prop.bhk}
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium">
                {/* AI Quality Score */}
                <tr className="bg-indigo-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-extrabold text-indigo-900 bg-indigo-100/60">
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>AI Quality Score</span>
                    </div>
                  </td>
                  {shortlist.map((prop) => {
                    const scored = scoredProperties.find((p) => p._id === prop._id) || prop;
                    const scoreVal = scored.aiScore || 75;
                    return (
                      <td key={prop._id} className="py-2.5 px-3 sm:px-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-black text-indigo-700">
                              {scoreVal}/100
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {scoreVal >= 85 ? 'Excellent' : scoreVal >= 70 ? 'Very Good' : 'Moderate'}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                scoreVal >= 85 ? 'bg-emerald-500' : scoreVal >= 70 ? 'bg-indigo-600' : 'bg-amber-500'
                              }`}
                              style={{ width: `${scoreVal}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Ownership Verification */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50">Verification Status</td>
                  {shortlist.map((prop) => (
                    <td key={prop._id} className="py-2.5 px-3 sm:px-4">
                      {prop.ownershipVerified || prop.isVerified ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px] sm:text-[11px] inline-flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>✓ Verified Property</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px] bg-slate-100 px-2 py-0.5 rounded-md">
                          Self-declared
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                {/* Monthly Rent */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50">Monthly Rent</td>
                  {shortlist.map((prop) => (
                    <td key={prop._id} className="py-2.5 px-3 sm:px-4 font-black text-blue-600 text-xs sm:text-sm">
                      ₹{prop.pricing.monthlyRent.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {/* Security Deposit */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50">Deposit</td>
                  {shortlist.map((prop) => (
                    <td key={prop._id} className="py-2.5 px-3 sm:px-4 text-slate-800 text-[11px] sm:text-xs">
                      ₹{prop.pricing.securityDeposit.toLocaleString()} ({prop.pricing.depositMonths || 2} mos)
                    </td>
                  ))}
                </tr>

                {/* Maintenance Fee */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50">Maintenance</td>
                  {shortlist.map((prop) => (
                    <td key={prop._id} className="py-2.5 px-3 sm:px-4 text-slate-800 text-[11px] sm:text-xs">
                      {prop.pricing.maintenanceAmount ? `₹${prop.pricing.maintenanceAmount}` : 'Included in Rent'}
                    </td>
                  ))}
                </tr>

                {/* Total Monthly Outflow */}
                <tr className="bg-blue-50/40">
                  <td className="py-2.5 px-3 sm:px-4 font-extrabold text-blue-900 bg-blue-100/60">Total Estimated Outflow</td>
                  {shortlist.map((prop) => (
                    <td key={prop._id} className="py-2.5 px-3 sm:px-4 font-extrabold text-blue-900 text-xs sm:text-sm">
                      ₹{(prop.pricing.monthlyRent + (prop.pricing.maintenanceAmount || 0)).toLocaleString()}/mo
                    </td>
                  ))}
                </tr>

                {/* Brokerage */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50">Brokerage</td>
                  {shortlist.map((prop) => (
                    <td key={prop._id} className="py-2.5 px-3 sm:px-4">
                      {prop.pricing.brokerageAmount === 0 ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[10px] sm:text-[11px]">
                          ✓ Zero Brokerage
                        </span>
                      ) : (
                        <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[10px]">
                          ₹{prop.pricing.brokerageAmount}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Electricity Meter */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50">Electricity Meter</td>
                  {shortlist.map((prop) => (
                    <td key={prop._id} className="py-2.5 px-3 sm:px-4">
                      {prop.utilities?.electricityMeterType === 'direct_govt_pgvcl' ? (
                        <span className="text-blue-700 font-bold flex items-center space-x-1 text-[11px]">
                          <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span>Direct PGVCL (Govt Rates)</span>
                        </span>
                      ) : (
                        <span className="text-amber-700 font-bold flex items-center space-x-1 text-[11px]">
                          <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>Sub-meter (₹{prop.utilities?.subMeterUnitRate || 10}/unit)</span>
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Water Supply */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50">Water Supply</td>
                  {shortlist.map((prop) => (
                    <td key={prop._id} className="py-2.5 px-3 sm:px-4">
                      <span className="text-cyan-800 font-semibold flex items-center space-x-1 text-[11px]">
                        <Droplets className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                        <span>{prop.utilities?.waterScheduleHours || '24 Hours'}</span>
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Rules */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50">Rules & Food</td>
                  {shortlist.map((prop) => (
                    <td key={prop._id} className="py-2.5 px-3 sm:px-4 text-[11px]">
                      <div className="font-bold text-slate-800">{prop.rules?.foodPreference}</div>
                      <div className="text-[10px] text-slate-500">{prop.rules?.allowedTenants}</div>
                    </td>
                  ))}
                </tr>

                {/* Furnishing */}
                <tr>
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50">Furnishing & Space</td>
                  {shortlist.map((prop) => (
                    <td key={prop._id} className="py-2.5 px-3 sm:px-4 text-[11px] text-slate-700">
                      <div className="font-bold">{prop.furnishingStatus}</div>
                      <div className="text-[10px] text-slate-500">{prop.carpetAreaSqFt} sq.ft carpet</div>
                    </td>
                  ))}
                </tr>

                {/* Commercial Specifications (shown if comparing commercial properties) */}
                {hasCommercial && (
                  <tr className="bg-amber-50/20">
                    <td className="py-2.5 px-3 sm:px-4 font-bold text-amber-900 bg-amber-100/50">Commercial Specs</td>
                    {shortlist.map((prop) => (
                      <td key={prop._id} className="py-2.5 px-3 sm:px-4 text-[11px]">
                        {prop.category === 'commercial' ? (
                          <div className="space-y-1">
                            <div className="font-bold text-slate-800">
                              ⚡ {prop.commercialDetails?.connectedPowerLoadHp || 10} HP Load
                            </div>
                            <div className="text-slate-600 text-[10px]">
                              🛣️ {prop.commercialDetails?.frontageRoadWidthFt || 30} Ft Road Frontage
                            </div>
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              prop.commercialDetails?.buPermissionCertified 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {prop.commercialDetails?.buPermissionCertified ? '✓ BU Permission Certified' : 'BU Pending'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[10px]">Residential Property</span>
                        )}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Direct Actions */}
                <tr>
                  <td className="py-3 px-3 sm:px-4 font-bold text-slate-700 bg-slate-50">Direct Contact</td>
                  {shortlist.map((prop) => {
                    const num = prop.owner?.phone ? prop.owner.phone.replace(/[^0-9]/g, '') : '919876543202';
                    const msg = encodeURIComponent(`Hi! Inquiring about ${prop.bhk} in ${prop.societyName}, ${prop.locality} on RentNest.`);
                    return (
                      <td key={prop._id} className="py-3 px-3 sm:px-4">
                        <div className="space-y-1.5">
                          <a
                            href={`https://wa.me/${num}?text=${msg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-center flex items-center justify-center space-x-1.5 shadow-xs transition-colors text-[11px]"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                          <Link
                            to={`/property/${prop.slug || prop._id}`}
                            onClick={() => setIsCompareModalOpen(false)}
                            className="block w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-center rounded-xl transition-colors text-[10px]"
                          >
                            Details →
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
    </div>
  );
};

export default CompareModal;