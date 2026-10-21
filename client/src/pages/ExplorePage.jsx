import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import PropertyCard from '../components/PropertyCard';
import SplitMap from '../components/SplitMap';
import FilterBar from '../components/FilterBar';
import SavedSearchModal from '../components/SavedSearchModal';
import { Map, List, Home, AlertCircle, Bell } from 'lucide-react';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'map' for mobile
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    locality: searchParams.get('locality') || '',
    bhk: searchParams.get('bhk') || '',
    zeroBrokerage: searchParams.get('zeroBrokerage') || '',
    meterType: searchParams.get('meterType') || '',
    waterType: searchParams.get('waterType') || '',
    foodPreference: searchParams.get('foodPreference') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    const fetchFilteredProperties = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, val]) => {
          if (val) queryParams.append(key, val);
        });

        // Update URL
        setSearchParams(queryParams, { replace: true });

        const res = await api.get(`/properties?${queryParams.toString()}`);
        if (res.data.success) {
          setProperties(res.data.properties);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      locality: '',
      bhk: '',
      zeroBrokerage: '',
      meterType: '',
      waterType: '',
      foodPreference: '',
      sort: 'newest',
      search: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header and Mobile View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Rental Properties in Rajkot, Gujarat
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Showing {properties.length} transparent homes with verified electricity & water reality
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Save Search & Alert Button */}
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-600" />
            <span>Save Search & Alert Me</span>
          </button>

          {/* Mobile View Toggle */}
          <div className="flex md:hidden items-center space-x-1 bg-slate-100 p-1 rounded-xl self-start">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
      />

      {/* Split-Screen Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        
        {/* Left Side: Interactive Map (Desktop 5 cols) */}
        <div className={`lg:col-span-5 h-[550px] lg:h-[750px] sticky top-20 rounded-2xl overflow-hidden shadow-sm ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
          <SplitMap
            properties={properties}
            selectedProperty={selectedProperty}
            onMarkerClick={(p) => setSelectedProperty(p)}
          />
        </div>

        {/* Right Side: Properties Scrollable Grid (Desktop 7 cols) */}
        <div className={`lg:col-span-7 space-y-4 ${viewMode === 'map' ? 'hidden md:block' : 'block'}`}>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">No properties match your exact filters</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting some filters or selecting "All Localities"</p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {properties.map((prop) => (
                <PropertyCard
                  key={prop._id}
                  property={prop}
                  onSelectOnMap={(p) => setSelectedProperty(p)}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Saved Search WhatsApp Alert Modal */}
      <SavedSearchModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        filters={filters}
      />

    </div>
  );
};

export default ExplorePage;
