import React from 'react';
import { Search, RotateCcw, Zap, Droplets, Leaf, Shield, Building2, Flame, Award, MapPin } from 'lucide-react';

const CITY_LOCALITIES = {
  Rajkot: [
    'All Localities',
    'Kalawad Road',
    '150 Ft Ring Road',
    'University Road',
    'Nana Mava',
    'Raiya Road',
    'Mavdi',
    'Sadhu Vaswani Road',
    'Metoda GIDC'
  ],
  Ahmedabad: [
    'All Localities',
    'SG Highway',
    'Prahlad Nagar',
    'Bodakdev',
    'Satellite',
    'Bopal',
    'Vastrapur',
    'Sanand GIDC'
  ],
  Surat: [
    'All Localities',
    'Vesu',
    'Adajan',
    'Pal',
    'Piplod',
    'Ghod Dod Road',
    'Varachha',
    'Sachin GIDC'
  ],
  Vadodara: [
    'All Localities',
    'Alkapuri',
    'Vasna Road',
    'Gotri',
    'OP Road',
    'Manjalpur',
    'Sayajigunj',
    'Makarpura GIDC'
  ]
};

const BHK_OPTIONS = ['All BHK', '1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

const COMMERCIAL_TYPES = [
  { label: 'All Commercial Types', value: '' },
  { label: 'Retail Shop', value: 'retail_shop' },
  { label: 'Showroom', value: 'showroom' },
  { label: 'Corporate Office', value: 'corporate_office' },
  { label: 'Industrial Shed', value: 'industrial_shed' },
  { label: 'Warehouse / Godown', value: 'warehouse_godown' },
  { label: 'Co-Working Space', value: 'co_working' }
];

const POWER_LOAD_OPTIONS = [
  { label: 'All Power Loads', value: '' },
  { label: '⚡ Min 5 HP', value: '5' },
  { label: '⚡ Min 15 HP', value: '15' },
  { label: '⚡ Min 25 HP', value: '25' },
  { label: '⚡ Min 50 HP (Industrial)', value: '50' }
];

const ROAD_WIDTH_OPTIONS = [
  { label: 'All Road Widths', value: '' },
  { label: '🛣️ 40+ Ft Road', value: '40' },
  { label: '🛣️ 60+ Ft Road', value: '60' },
  { label: '🛣️ 80+ Ft Road', value: '80' },
  { label: '🛣️ 150 Ft Ring Road', value: '150' }
];

const FilterBar = ({ filters, setFilters, onReset }) => {
  const isCommercial = filters.category === 'commercial';
  const activeCity = filters.city || 'Rajkot';
  const currentLocalities = CITY_LOCALITIES[activeCity] || [
    'All Localities',
    'Kalawad Road',
    '150 Ft Ring Road',
    'SG Highway',
    'Prahlad Nagar',
    'Vesu',
    'Alkapuri'
  ];

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
      {/* Search & Main Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* City Selector */}
        <div>
          <select
            value={filters.city || 'All'}
            onChange={(e) => {
              const val = e.target.value === 'All' ? '' : e.target.value;
              localStorage.setItem('rentnest_selected_city', e.target.value);
              setFilters((prev) => ({ ...prev, city: val, locality: '' }));
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none bg-white cursor-pointer"
          >
            <option value="Rajkot">📍 Rajkot</option>
            <option value="Ahmedabad">📍 Ahmedabad</option>
            <option value="Surat">📍 Surat</option>
            <option value="Vadodara">📍 Vadodara</option>
            <option value="All">🌐 All Cities</option>
          </select>
        </div>

        {/* Search input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder={isCommercial ? "Search commercial center..." : "Search society, area..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* Locality Selector */}
        <div>
          <select
            value={filters.locality || 'All Localities'}
            onChange={(e) => handleChange('locality', e.target.value === 'All Localities' ? '' : e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none bg-white cursor-pointer"
          >
            {currentLocalities.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Dynamic Selector 3: BHK (Residential) OR Commercial Type (Commercial) */}
        {!isCommercial ? (
          <div>
            <select
              value={filters.bhk || 'All BHK'}
              onChange={(e) => handleChange('bhk', e.target.value === 'All BHK' ? '' : e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none bg-white cursor-pointer"
            >
              {BHK_OPTIONS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <select
              value={filters.commercialType || ''}
              onChange={(e) => handleChange('commercialType', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-blue-200 text-xs font-bold text-blue-900 bg-blue-50/50 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
            >
              {COMMERCIAL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sort */}
        <div>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none bg-white cursor-pointer"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Viewed</option>
            <option value="verified">Verified Owners First</option>
          </select>
        </div>

      </div>

      {/* Commercial Secondary Selectors (Road & Power) if Commercial is Active */}
      {isCommercial && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Minimum Connected Power (HP):</label>
            <select
              value={filters.minPowerLoadHp || ''}
              onChange={(e) => handleChange('minPowerLoadHp', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:border-blue-600 outline-none bg-white cursor-pointer"
            >
              {POWER_LOAD_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Minimum Road Width Frontage:</label>
            <select
              value={filters.minRoadWidthFt || ''}
              onChange={(e) => handleChange('minRoadWidthFt', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:border-blue-600 outline-none bg-white cursor-pointer"
            >
              {ROAD_WIDTH_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Quick Toggle Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
        
        {/* Zero Brokerage (Direct Owner) */}
        <button
          type="button"
          onClick={() => handleChange('zeroBrokerage', filters.zeroBrokerage === 'true' ? '' : 'true')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
            filters.zeroBrokerage === 'true'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Direct Owner (0 Brokerage)</span>
        </button>

        {!isCommercial ? (
          <>
            {/* PGVCL Govt Meter */}
            <button
              type="button"
              onClick={() => handleChange('meterType', filters.meterType === 'direct_govt_pgvcl' ? '' : 'direct_govt_pgvcl')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                filters.meterType === 'direct_govt_pgvcl'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>PGVCL Govt Meter Only</span>
            </button>

            {/* Pure Veg Only */}
            <button
              type="button"
              onClick={() => handleChange('foodPreference', filters.foodPreference === 'Pure Vegetarian Only' ? '' : 'Pure Vegetarian Only')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                filters.foodPreference === 'Pure Vegetarian Only'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Pure Veg Only</span>
            </button>

            {/* 24/7 Water */}
            <button
              type="button"
              onClick={() => handleChange('waterType', filters.waterType === '24_7_continuous' ? '' : '24_7_continuous')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                filters.waterType === '24_7_continuous'
                  ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>24/7 Continuous Water</span>
            </button>
          </>
        ) : (
          <>
            {/* 3-Phase Power */}
            <button
              type="button"
              onClick={() => handleChange('electricPhaseType', filters.electricPhaseType === 'three_phase' ? '' : 'three_phase')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                filters.electricPhaseType === 'three_phase'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>3-Phase Electric Connection</span>
            </button>

            {/* BU Permission Certified */}
            <button
              type="button"
              onClick={() => handleChange('buPermissionCertified', filters.buPermissionCertified === 'true' ? '' : 'true')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                filters.buPermissionCertified === 'true'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>BU Certified</span>
            </button>

            {/* Fire NOC Certified */}
            <button
              type="button"
              onClick={() => handleChange('fireNocStatus', filters.fireNocStatus === 'true' ? '' : 'true')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                filters.fireNocStatus === 'true'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Fire NOC Certified</span>
            </button>
          </>
        )}

        {/* Reset button */}
        <button
          type="button"
          onClick={onReset}
          className="ml-auto px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

      </div>
    </div>
  );
};

export default FilterBar;
