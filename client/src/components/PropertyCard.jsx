import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { useWishlist } from '../context/WishlistContext';
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
  Calendar,
  Heart
} from 'lucide-react';

const PropertyCard = ({ property, onSelectOnMap, onHover, onLeave }) => {
  const { toggleCompare, isCompared } = useCompare();
  const { toggleWishlist, isSaved } = useWishlist();

  const isZeroBrokerage = property.pricing?.brokerageAmount === 0;
  const isDirectGovtMeter = property.utilities?.electricityMeterType === 'direct_govt_pgvcl';
  const isPureVeg = property.rules?.foodPreference === 'Pure Vegetarian Only';
  const isCommercial = property.category === 'commercial';
  const coverPhoto = property.photos?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80';

  const getCommercialTypeLabel = (type) => {
    switch (type) {
      case 'retail_shop': return 'Retail Shop';
      case 'showroom': return 'Showroom';
      case 'corporate_office': return 'Office Space';
      case 'industrial_shed': return 'Industrial Shed';
      case 'warehouse_godown': return 'Warehouse';
      case 'co_working': return 'Co-Working';
      default: return 'Commercial';
    }
  };

  // Format WhatsApp lead message
  const whatsappNumber = property.owner?.phone ? property.owner.phone.replace(/[^0-9]/g, '') : '919876543202';
  const whatsappMsg = isCommercial
    ? encodeURIComponent(
        `Hello! I saw your commercial property (${property.title}) at ${property.societyName}, ${property.locality} on RentNest (₹${property.pricing.monthlyRent}/mo). Is it still available for inspection?`
      )
    : encodeURIComponent(
        `Hello! I saw your ${property.bhk} rental home at ${property.societyName}, ${property.locality} on RentNest (₹${property.pricing.monthlyRent}/mo). Is it still available for a physical visit?`
      );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

  return (
    <div 
      onMouseEnter={() => onHover && onHover(property._id)}
      onMouseLeave={() => onLeave && onLeave()}
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
          {isCommercial ? (
            <span className="bg-indigo-700/95 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              🏢 {getCommercialTypeLabel(property.commercialDetails?.commercialType || property.propertyType)}
            </span>
          ) : null}

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
            <span className="bg-emerald-600/95 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow-md">
              <ShieldCheck className="w-3 h-3 text-emerald-200" />
              <span>✓ Verified Property</span>
            </span>
          )}
        </div>

        {/* Top Right Actions: Wishlist + Compare */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(property);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              isSaved(property._id)
                ? 'bg-rose-500 text-white'
                : 'bg-white/85 hover:bg-white text-slate-700 hover:text-rose-500'
            }`}
            title={isSaved(property._id) ? 'Remove from saved wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isSaved(property._id) ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(property);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-md ${
              isCompared(property._id)
                ? 'bg-blue-600 text-white'
                : 'bg-white/85 hover:bg-white text-slate-700 hover:text-blue-600'
            }`}
            title={isCompared(property._id) ? 'Remove from comparison' : 'Compare property'}
          >
            {isCompared(property._id) ? <Check className="w-4 h-4 stroke-[3]" /> : <Scale className="w-4 h-4" />}
          </button>
        </div>

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
            {isCommercial 
              ? `⚡ ${property.commercialDetails?.connectedPowerLoadHp || 5} HP` 
              : property.bhk}
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
            {property.city && property.city !== 'Rajkot' && (
              <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[9px] font-bold">
                {property.city}
              </span>
            )}
          </div>

          <Link to={`/property/${property.slug || property._id}`}>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1 transition-colors">
              {property.title}
            </h3>
          </Link>
        </div>

        {/* Reality Transparency Chips: Commercial vs Residential */}
        {isCommercial ? (
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold pt-1">
            {/* Connected Power HP & Phase */}
            <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">
                {property.commercialDetails?.connectedPowerLoadHp || 5} HP ({property.commercialDetails?.electricPhaseType === 'three_phase' ? '3-Phase' : '1-Phase'})
              </span>
            </div>

            {/* Frontage Road Width */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center space-x-1.5">
              <span className="text-xs">🛣️</span>
              <span className="truncate">
                {property.commercialDetails?.frontageRoadWidthFt || 40} Ft Main Road
              </span>
            </div>

            {/* Carpet Area & Ceiling Height */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">
                {property.carpetAreaSqFt} sq.ft • {property.commercialDetails?.ceilingHeightClearFt || 12} Ft Ht
              </span>
            </div>

            {/* Compliance (BU / Fire NOC) */}
            <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 flex items-center space-x-1.5">
              <span className="text-xs">📜</span>
              <span className="truncate">
                {property.commercialDetails?.buPermissionCertified ? 'BU Certified' : 'In Approval'}
                {property.commercialDetails?.fireNocStatus ? ' • Fire NOC' : ''}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold pt-1">
            {/* Electricity Meter */}
            <div className={`p-2 rounded-xl flex items-center space-x-1.5 border ${
              isDirectGovtMeter 
                ? 'bg-blue-50/70 border-blue-200 text-blue-900' 
                : 'bg-amber-50/70 border-amber-200 text-amber-900'
            }`}>
              <Zap className={`w-3.5 h-3.5 ${isDirectGovtMeter ? 'text-blue-600' : 'text-amber-600'} shrink-0`} />
              <span className="truncate">
                {isDirectGovtMeter ? 'PGVCL Govt Meter' : `Sub-meter (₹${property.utilities.subMeterUnitRate}/u)`}
              </span>
            </div>

            {/* Water Supply */}
            <div className="p-2 rounded-xl bg-cyan-50/70 border border-cyan-200 text-cyan-900 flex items-center space-x-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
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
              <Leaf className={`w-3.5 h-3.5 ${isPureVeg ? 'text-emerald-600' : 'text-slate-500'} shrink-0`} />
              <span className="truncate">
                {isPureVeg ? 'Pure Veg Only' : property.rules.foodPreference}
              </span>
            </div>

            {/* Area / Furnishing */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{property.carpetAreaSqFt} sq.ft • {property.furnishingStatus}</span>
            </div>
          </div>
        )}

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
