import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { 
  ShieldCheck, 
  MapPin, 
  Zap, 
  Droplets, 
  Leaf, 
  MessageCircle, 
  Scale, 
  Check, 
  ExternalLink,
  Building2,
  Calendar
} from 'lucide-react';

const PropertyCard = ({ property, onSelectOnMap }) => {
  const { toggleCompare, isCompared } = useCompare();

  const isZeroBrokerage = property.pricing?.brokerageAmount === 0;
  const isDirectGovtMeter = property.utilities?.electricityMeterType === 'direct_govt_pgvcl';
  const isPureVeg = property.rules?.foodPreference === 'Pure Vegetarian Only';
  const coverPhoto = property.photos?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  // Format WhatsApp lead message
  const whatsappNumber = property.owner?.phone ? property.owner.phone.replace(/[^0-9]/g, '') : '919876543202';
  const whatsappMsg = encodeURIComponent(
    `Hello! I saw your ${property.bhk} rental home at ${property.societyName}, ${property.locality} on RentNest (₹${property.pricing.monthlyRent}/mo). Is it still available for a physical visit?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div 
      onMouseEnter={() => onSelectOnMap && onSelectOnMap(property)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Photo Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={coverPhoto}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isZeroBrokerage ? (
            <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              Direct Owner • Zero Brokerage
            </span>
          ) : (
            <span className="bg-amber-600/95 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              Broker ({property.pricing.brokerageAmount ? `₹${property.pricing.brokerageAmount}` : '15 Days'})
            </span>
          )}

          {property.isVerifiedOwner && (
            <span className="bg-blue-600/95 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-md">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Owner</span>
            </span>
          )}
        </div>

        {/* Compare Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleCompare(property);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
            isCompared(property._id)
              ? 'bg-blue-600 text-white'
              : 'bg-white/80 hover:bg-white text-slate-700'
          }`}
          title={isCompared(property._id) ? 'Remove from comparison' : 'Compare flat'}
        >
          {isCompared(property._id) ? <Check className="w-4 h-4 stroke-[3]" /> : <Scale className="w-4 h-4" />}
        </button>

        {/* Bottom Price Strip on Photo */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent p-3 pt-6 text-white flex items-end justify-between">
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-black tracking-tight">₹{property.pricing.monthlyRent.toLocaleString()}</span>
              <span className="text-xs text-slate-300 font-medium">/ month</span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              Deposit: ₹{property.pricing.securityDeposit.toLocaleString()} ({property.pricing.depositMonths || 2} mos)
            </div>
          </div>
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/30">
            {property.bhk}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        
        {/* Title & Locality */}
        <div>
          <div className="flex items-center space-x-1 text-slate-500 text-xs font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-slate-800 font-bold">{property.societyName}</span>
            <span>•</span>
            <span className="truncate">{property.locality}</span>
          </div>

          <Link to={`/property/${property.slug || property._id}`}>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1 transition-colors">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* Living Reality Transparency Chips */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold pt-1">
          {/* Electricity Meter */}
          <div className={`p-2 rounded-xl flex items-center space-x-1.5 border ${
            isDirectGovtMeter 
              ? 'bg-blue-50/70 border-blue-200 text-blue-900' 
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}>
            <Zap className={`w-3.5 h-3.5 ${isDirectGovtMeter ? 'text-blue-600' : 'text-amber-600'}`} />
            <span className="truncate">
              {isDirectGovtMeter ? 'PGVCL Govt Meter' : `Sub-meter (₹${property.utilities.subMeterUnitRate}/u)`}
            </span>
          </div>

          {/* Water Supply */}
          <div className="p-2 rounded-xl bg-cyan-50/70 border border-cyan-200 text-cyan-900 flex items-center space-x-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-600" />
            <span className="truncate">
              {property.utilities.waterSupplyType === '24_7_continuous' ? '24/7 Continuous' : 'Scheduled Water'}
            </span>
          </div>

          {/* Food Preference */}
          <div className={`p-2 rounded-xl flex items-center space-x-1.5 border ${
            isPureVeg 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <Leaf className={`w-3.5 h-3.5 ${isPureVeg ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span className="truncate">
              {isPureVeg ? 'Pure Veg Only' : property.rules.foodPreference}
            </span>
          </div>

          {/* Area / Furnishing */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center space-x-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{property.carpetAreaSqFt} sq.ft • {property.furnishingStatus}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center space-x-2 border-t border-slate-100">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition-colors active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <Link
            to={`/property/${property.slug || property._id}`}
            className="py-2 px-3 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-colors"
          >
            <span>Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PropertyCard;
