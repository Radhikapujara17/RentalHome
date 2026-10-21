import React from 'react';
import { Search, Filter, RotateCcw, Zap, Droplets, Leaf, Shield } from 'lucide-react';

const LOCALITIES = [
  'All Localities',
  'Kalawad Road',
  '150 Ft Ring Road',
  'University Road',
  'Nana Mava',
  'Raiya Road',
  'Mavdi',
  'Sadhu Vaswani Road',
  'Metoda GIDC'
];

const BHK_OPTIONS = ['All BHK', '1 RK', '1 BHK', '2 BHK', '3 BHK', '4+ BHK'];

const FilterBar = ({ filters, setFilters, onReset }) => {
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
      {/* Search & Main Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Search input */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search society, landmark, or area..."
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
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* BHK Selector */}
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

      {/* Quick Toggle Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        
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
