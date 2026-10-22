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
  FileText,
  Building2,
  Users,
  Shield,
  Home
} from 'lucide-react';

const CITY_LOCALITIES = {
  Rajkot: [
    'Kalawad Road',
    '150 Ft Ring Road',
    'University Road',
    'Nana Mava',
    'Raiya Road',
    'Sadhu Vaswani Road'
  ],
  Ahmedabad: [
    'SG Highway',
    'Prahlad Nagar',
    'Bodakdev',
    'Satellite',
    'Bopal',
    'Vastrapur'
  ],
  Surat: [
    'Vesu',
    'Adajan',
    'Pal',
    'Piplod',
    'Ghod Dod Road',
    'Varachha'
  ],
  Vadodara: [
    'Alkapuri',
    'Vasna Road',
    'Gotri',
    'OP Road',
    'Manjalpur',
    'Sayajigunj'
  ]
};

const HomePage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [city, setCity] = useState(() => {
    const saved = localStorage.getItem('rentnest_selected_city');
    return (saved && saved !== 'All') ? saved : 'Rajkot';
  });
  const [category, setCategory] = useState('residential');
  const [locality, setLocality] = useState('');
  const [bhk, setBhk] = useState('');
  const [commercialType, setCommercialType] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const currentLocalities = CITY_LOCALITIES[city] || CITY_LOCALITIES.Rajkot;

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
    if (city && city !== 'All') params.append('city', city);
    if (category) params.append('category', category);
    if (locality) params.append('locality', locality);
    if (category === 'commercial' && commercialType) params.append('commercialType', commercialType);
    if (category === 'residential' && bhk) params.append('bhk', bhk);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-12 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-5 sm:space-y-6">
          
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-blue-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Gujarat's #1 Transparent Living & Commercial Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Find Rental Homes & Commercial Spaces with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Zero Hidden Costs</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Direct owner listings, verified PGVCL government electricity meters, scheduled water reality, and zero broker markups.
          </p>

          {/* Quick Search Box */}
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Category Toggle Tabs */}
            <div className="inline-flex items-center bg-slate-800/80 p-1 rounded-2xl border border-white/10 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setCategory('residential')}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  category === 'residential' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Residential Homes</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('commercial')}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  category === 'commercial' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Commercial Spaces</span>
              </button>
            </div>

            <form
              onSubmit={handleSearch}
              className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/20 text-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
            >
              {/* City Select */}
              <div>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setLocality('');
                    localStorage.setItem('rentnest_selected_city', e.target.value);
                  }}
                  className="w-full px-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="Rajkot">📍 Rajkot</option>
                  <option value="Ahmedabad">📍 Ahmedabad</option>
                  <option value="Surat">📍 Surat</option>
                  <option value="Vadodara">📍 Vadodara</option>
                </select>
              </div>

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
                  <option value="">All {city} Localities</option>
                  {currentLocalities.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Dynamic 3rd Field: BHK vs Commercial Type */}
              <div>
                {category === 'residential' ? (
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
                ) : (
                  <select
                    value={commercialType}
                    onChange={(e) => setCommercialType(e.target.value)}
                    className="w-full px-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option value="">All Commercial Types</option>
                    <option value="retail_shop">Retail Shop</option>
                    <option value="showroom">Showroom</option>
                    <option value="corporate_office">Corporate Office</option>
                    <option value="industrial_shed">Industrial Shed</option>
                    <option value="warehouse_godown">Warehouse / Godown</option>
                    <option value="co_working">Co-Working Space</option>
                  </select>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30 transition-transform active:scale-95"
              >
                <Search className="w-4 h-4" />
                <span>Search {category === 'commercial' ? 'Spaces' : 'Homes'}</span>
              </button>
            </form>
          </div>

          {/* Quick Locality Tags for Selected City */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-semibold text-xs">Popular in {city}:</span>
            {currentLocalities.slice(0, 5).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => navigate(`/explore?city=${encodeURIComponent(city)}&locality=${encodeURIComponent(loc)}`)}
                className="px-2.5 sm:px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 font-medium transition-colors border border-white/10 text-[11px] sm:text-xs"
              >
                {loc}
              </button>
            ))}
          </div>

          {/* Quick Category Navigation Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <Link
              to="/explore?category=commercial"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Commercial Spaces</span>
            </Link>

            <Link
              to="/explore?zeroBrokerage=true"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>0 Brokerage Direct Owner</span>
            </Link>

            <Link
              to="/roommates"
              className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Find Flatmates</span>
            </Link>

            <Link
              to="/tools/move-in-checklist"
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
              <span>Deposit Shield</span>
            </Link>
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
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Verified & Freshly Listed in {city}</span>
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
