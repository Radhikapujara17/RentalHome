import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import PropertyCard from '../components/PropertyCard';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Droplets, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  PlusCircle,
  CheckCircle,
  FileText
} from 'lucide-react';

const POPULAR_LOCALITIES = [
  'Kalawad Road',
  '150 Ft Ring Road',
  'University Road',
  'Nana Mava',
  'Raiya Road',
  'Sadhu Vaswani Road'
];

const HomePage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [propsRes, statsRes] = await Promise.all([
          api.get('/properties?limit=6&sort=newest'),
          api.get('/properties/analytics/localities')
        ]);
        if (propsRes.data.success) {
          setProperties(propsRes.data.properties);
        }
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locality) params.append('locality', locality);
    if (bhk) params.append('bhk', bhk);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Built Specifically for Rajkot Urban Rental Market</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Find Rental Homes in Rajkot with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Zero Hidden Costs</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Direct owner listings, verified PGVCL government electricity meters, scheduled water reality, and zero ghost broker advertisements.
          </p>

          {/* Quick Search Box */}
          <form
            onSubmit={handleSearch}
            className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/20 max-w-3xl mx-auto text-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {/* Locality Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <MapPin className="w-4 h-4 text-blue-600" />
              </span>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="">Select Rajkot Locality</option>
                {POPULAR_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* BHK Select */}
            <div>
              <select
                value={bhk}
                onChange={(e) => setBhk(e.target.value)}
                className="w-full px-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="">Any BHK Configuration</option>
                <option value="1 RK">1 RK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4+ BHK">4+ BHK / Penthouse</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Search Homes</span>
            </button>
          </form>

          {/* Quick Locality Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-semibold">Popular:</span>
            {POPULAR_LOCALITIES.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => navigate(`/explore?locality=${encodeURIComponent(loc)}`)}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 font-medium transition-colors border border-white/10"
              >
                {loc}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3 Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">PGVCL Meter Transparency</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Know upfront if the flat has an independent government PGVCL meter or a sub-meter with fixed ₹/unit rate. Zero inflated electric bill shocks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Water Supply Reality</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Never get misled on water availability. Listings explicitly state 24/7 continuous supply vs scheduled municipal corporation timings.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Direct Landlords & Zero Brokerage</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Over 70% of homes listed by verified direct owners. Save 1 month's hard-earned rent on middleman commissions.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Freshly Listed in Rajkot</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Verified Rental Homes
            </h2>
          </div>
          <Link
            to="/explore"
            className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-4 py-2.5 rounded-xl transition-colors self-start sm:self-auto"
          >
            <span>View All Properties on Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* Locality Market Price Index */}
      {stats && stats.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Rajkot Rental Market Insights (Live Benchmarks)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.slice(0, 4).map((s) => (
                <div key={s._id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <div className="text-xs text-slate-400 font-bold mb-1 truncate">{s._id}</div>
                  <div className="text-lg font-black text-blue-400">
                    ₹{Math.round(s.avgRent).toLocaleString()}
                    <span className="text-[10px] text-slate-400 font-normal"> /mo avg</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                    {s.count} Available • {s.verifiedCount} Verified
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Owner Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Are you a Property Owner in Rajkot?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
              List your flat or bungalow for free. Receive inquiries directly on WhatsApp from verified tenants, and download an automated printable "TO LET" gate poster with dynamic QR code.
            </p>
          </div>
          <Link
            to="/post-property"
            className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center space-x-2 shadow-lg transition-transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>List Free Property Ad</span>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
