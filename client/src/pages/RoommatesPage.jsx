import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { 
  Users, 
  MapPin, 
  IndianRupee, 
  ShieldCheck, 
  MessageCircle, 
  PlusCircle, 
  Filter, 
  GraduationCap, 
  Briefcase,
  Wifi,
  Sparkles
} from 'lucide-react';

const RoommatesPage = () => {
  const [roommatesList, setRoommatesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState('All'); // 'All', 'Female Only', 'Male Only'
  const [localityFilter, setLocalityFilter] = useState('All');

  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        setLoading(true);
        // Query properties that are shared_room or pg_coliving
        const res = await api.get('/properties?propertyType=shared_room');
        if (res.data.success) {
          setRoommatesList(res.data.properties);
        }
      } catch (err) {
        console.error('Failed to load roommate vacancies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoommates();
  }, []);

  const filteredList = roommatesList.filter((item) => {
    if (genderFilter === 'Female Only' && item.rules?.allowedTenants !== 'Bachelors (Female)') return false;
    if (genderFilter === 'Male Only' && item.rules?.allowedTenants !== 'Bachelors (Male)') return false;
    if (localityFilter !== 'All' && item.locality !== localityFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-3 max-w-xl z-10 text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Students & Young Working Professionals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Find Flatmates & Shared Rooms in Rajkot
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Split rent and bills safely. Browse verified room vacancies near Saurashtra University, AIIMS, and 150 Ft Ring Road.
          </p>
        </div>

        <Link
          to="/post-property"
          className="z-10 px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center space-x-2 shadow-lg transition-transform active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>Post Flatmate Vacancy</span>
        </Link>

        {/* Decorative circle */}
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        
        {/* Gender Filters */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Looking For:</span>
          {['All', 'Female Only', 'Male Only'].map((g) => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                genderFilter === g
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Locality Quick Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Locality:</span>
          <select
            value={localityFilter}
            onChange={(e) => setLocalityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white cursor-pointer"
          >
            <option value="All">All Localities</option>
            <option value="University Road">University Road (Students)</option>
            <option value="150 Ft Ring Road">150 Ft Ring Road</option>
            <option value="Kalawad Road">Kalawad Road</option>
            <option value="Nana Mava">Nana Mava</option>
          </select>
        </div>

      </div>

      {/* Vacancy Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-extrabold text-slate-800">No flatmate vacancies match this filter</h3>
          <p className="text-xs text-slate-500">Try switching to "All" or be the first to post a room vacancy.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((room) => {
            const isFemale = room.rules?.allowedTenants === 'Bachelors (Female)';
            const whatsappNum = room.owner?.phone ? room.owner.phone.replace(/[^0-9]/g, '') : '919876543201';
            const whatsappMsg = encodeURIComponent(
              `Hello! I saw your Flatmate Vacancy in ${room.societyName}, ${room.locality} on RentNest (₹${room.pricing.monthlyRent}/month). Is it still open?`
            );

            return (
              <div
                key={room._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Gender Badge */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={room.photos?.[0]?.url || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white shadow-md ${
                        isFemale ? 'bg-pink-600' : 'bg-blue-600'
                      }`}>
                        {isFemale ? 'Female Flatmate' : 'Male Flatmate'}
                      </span>
                      <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        {room.rules?.foodPreference || 'Pure Veg'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md">
                      <span className="text-base font-black text-slate-900">₹{room.pricing.monthlyRent.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 font-bold"> /bed /mo</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-slate-800 font-bold">{room.societyName}</span>
                      <span>•</span>
                      <span>{room.locality}</span>
                    </div>

                    <Link to={`/property/${room.slug || room._id}`}>
                      <h3 className="text-sm font-extrabold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {room.title}
                      </h3>
                    </Link>

                    {/* Furnishing & Amenities */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {room.furnishingItems?.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {item}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                        {room.furnishingStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <a
                    href={`https://wa.me/${whatsappNum}?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-md shadow-emerald-500/20 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Flatmate</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default RoommatesPage;
