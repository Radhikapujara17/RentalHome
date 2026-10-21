import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useWishlist } from '../context/WishlistContext';
import ToLetPosterModal from '../components/ToLetPosterModal';
import toast from 'react-hot-toast';
import {
  MapPin,
  ShieldCheck,
  Zap,
  Droplets,
  Leaf,
  Calendar,
  MessageCircle,
  MessageSquare,
  Scale,
  Printer,
  Calculator,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Share2,
  Phone,
  Flame,
  Wifi,
  Sparkles,
  Building2,
  Pencil,
  Heart
} from 'lucide-react';

const PropertyDetailPage = () => {
  const { idOrSlug } = useParams();
  const { user, isAuthenticated, setIsAuthModalOpen, setIsChatOpen } = useAuth();
  const { toggleCompare, isCompared } = useCompare();
  const { toggleWishlist, isSaved } = useWishlist();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isPosterOpen, setIsPosterOpen] = useState(false);

  // Visit Booking Modal State
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitSlot, setVisitSlot] = useState('Evening: 05:00 PM - 07:00 PM');
  const [visitNote, setVisitNote] = useState('');
  const [visitPass, setVisitPass] = useState(null);

  // Living Cost Calculator State
  const [estUnits, setEstUnits] = useState(150); // average units/mo

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/properties/${idOrSlug}`);
        if (res.data.success) {
          setProperty(res.data.property);
        }
      } catch (err) {
        toast.error('Could not load property details');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
        <div className="h-10 bg-slate-200 rounded-xl w-2/3"></div>
        <div className="h-6 bg-slate-200 rounded-xl w-1/3"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Property not found</h2>
        <Link to="/explore" className="text-sm font-bold text-blue-600 hover:underline">
          Return to Explore
        </Link>
      </div>
    );
  }

  const isDirectGovtMeter = property.utilities?.electricityMeterType === 'direct_govt_pgvcl';
  const unitRate = isDirectGovtMeter ? 6.5 : (property.utilities?.subMeterUnitRate || 9);
  const estimatedElectricBill = Math.round(estUnits * unitRate);
  const totalEstimatedOutflow = property.pricing.monthlyRent + (property.pricing.maintenanceAmount || 0) + estimatedElectricBill;

  const isCommercial = property.category === 'commercial';
  const currentUserId = user?._id || user?.id;
  const ownerId = property?.owner?._id || property?.owner;
  const isOwnerOrAdmin = Boolean(
    user && property && (
      (currentUserId && ownerId && currentUserId.toString() === ownerId.toString()) ||
      user.role === 'admin'
    )
  );
  const getCommercialTypeLabel = (type) => {
    switch (type) {
      case 'retail_shop': return 'Retail Shop';
      case 'showroom': return 'Showroom';
      case 'corporate_office': return 'Office Space';
      case 'industrial_shed': return 'Industrial Shed';
      case 'warehouse_godown': return 'Warehouse';
      case 'co_working': return 'Co-Working';
      default: return 'Commercial Space';
    }
  };

  // WhatsApp link
  const whatsappNum = property.owner?.phone ? property.owner.phone.replace(/[^0-9]/g, '') : '919876543202';
  const whatsappMsg = isCommercial
    ? encodeURIComponent(
        `Hello! I saw your commercial property "${property.title}" at ${property.societyName}, ${property.locality} on RentNest (₹${property.pricing.monthlyRent}/mo). Is it available for inspection?`
      )
    : encodeURIComponent(
        `Hello! I saw your ${property.bhk} rental home at ${property.societyName}, ${property.locality} on RentNest (₹${property.pricing.monthlyRent}/mo). Is it available for a visit?`
      );
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${whatsappMsg}`;

  const handleBookVisit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast('Please login or choose a demo persona to book a visit', { icon: '🔑' });
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const res = await api.post('/visits', {
        propertyId: property._id,
        preferredDate: visitDate || new Date(Date.now() + 24 * 60 * 60 * 1000),
        timeSlot: visitSlot,
        tenantNote: visitNote,
      });

      if (res.data.success) {
        setVisitPass(res.data.visit);
        toast.success('Visit pass generated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book visit');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>

        <div className="flex items-center space-x-2">
          {isOwnerOrAdmin && (
            <Link
              to={`/edit-property/${property._id}`}
              className="flex items-center space-x-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              title="Edit Property Listing"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Listing</span>
            </Link>
          )}

          <button
            onClick={() => toggleWishlist(property)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isSaved(property._id)
                ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:border-rose-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved(property._id) ? 'fill-white' : ''}`} />
            <span>{isSaved(property._id) ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => toggleCompare(property)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isCompared(property._id)
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isCompared(property._id) ? 'Shortlisted' : 'Add to Compare'}</span>
          </button>

          <button
            onClick={() => setIsPosterOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print TO LET Poster</span>
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="space-y-3">
        <div className="relative aspect-[21/9] sm:aspect-[21/10] bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <img
            src={property.photos?.[activePhotoIdx]?.url || property.photos?.[0]?.url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20">
            {property.photos?.[activePhotoIdx]?.roomTag || 'Living Room'}
          </div>
        </div>

        {/* Thumbnails */}
        {property.photos && property.photos.length > 1 && (
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            {property.photos.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIdx(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activePhotoIdx === idx ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={photo.url} alt={`Photo ${idx}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] text-center font-semibold truncate px-1">
                  {photo.roomTag}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Details (Left) + Financials & Owner (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header & Badges */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              {isCommercial ? (
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                  🏢 {getCommercialTypeLabel(property.commercialDetails?.commercialType || property.propertyType)}
                </span>
              ) : (
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                  {property.bhk}
                </span>
              )}

              {property.pricing.brokerageAmount === 0 ? (
                <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Zero Brokerage (Direct Owner)
                </span>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  Brokerage Applicable
                </span>
              )}
              {property.isVerifiedOwner && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white flex items-center space-x-1 shadow-sm" title={property.verifiedDocumentDetails?.verificationNote || 'Ownership verified with authentic documents'}>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                  <span>✓ Verified Property & Landlord</span>
                </span>
              )}
              <span className="text-xs text-slate-400 font-mono ml-auto">
                ID: {property.listingNumber}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center space-x-2 text-slate-600 text-sm font-semibold">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{property.societyName}, {property.locality}, Rajkot</span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              Full Address: {property.fullAddress} {property.landmark ? `(Landmark: ${property.landmark})` : ''}
            </p>
          </div>

          {/* Quick Specifications */}
          {isCommercial ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Carpet Area</span>
                <span className="text-base font-extrabold text-slate-900">{property.carpetAreaSqFt} sq.ft</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Power Capacity</span>
                <span className="text-base font-extrabold text-blue-700">
                  ⚡ {property.commercialDetails?.connectedPowerLoadHp || 10} HP
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Road Frontage</span>
                <span className="text-base font-extrabold text-slate-900">
                  🛣️ {property.commercialDetails?.frontageRoadWidthFt || 40} Ft
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Ceiling Clearance</span>
                <span className="text-base font-extrabold text-slate-900">
                  📏 {property.commercialDetails?.ceilingHeightClearFt || 12} Ft Ht
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Carpet Area</span>
                <span className="text-base font-extrabold text-slate-900">{property.carpetAreaSqFt} sq.ft</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Floor Position</span>
                <span className="text-base font-extrabold text-slate-900">
                  {property.floorNumber === 0 ? 'Ground Floor' : `${property.floorNumber}th of ${property.totalFloors}`}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Facing / Vastu</span>
                <span className="text-base font-extrabold text-slate-900">{property.facing} Facing</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 block">Furnishing Level</span>
                <span className="text-base font-extrabold text-slate-900">{property.furnishingStatus}</span>
              </div>
            </div>
          )}

          {/* Commercial Specifications & Industrial Reality Hub */}
          {isCommercial && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>Commercial Specifications & Industrial Reality</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <span>Power Load & Electrical Phase</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    Connected Load: <strong>{property.commercialDetails?.connectedPowerLoadHp || 10} HP</strong><br />
                    Phase Type: <strong>{property.commercialDetails?.electricPhaseType === 'three_phase' ? 'Three-Phase High Capacity' : 'Single-Phase'}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                    <span className="text-sm">🛣️</span>
                    <span>Road Frontage & Vehicle Clearance</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    Road Width: <strong>{property.commercialDetails?.frontageRoadWidthFt || 40} Feet Main Road</strong><br />
                    Clear Ceiling Height: <strong>{property.commercialDetails?.ceilingHeightClearFt || 12} Feet Clear Height</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                    <span className="text-sm">📜</span>
                    <span>Statutory & Compliance Approvals</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    BU Permission: <strong>{property.commercialDetails?.buPermissionCertified ? 'Certified & Approved' : 'In Approval'}</strong><br />
                    Fire Safety NOC: <strong>{property.commercialDetails?.fireNocStatus ? 'Fire NOC Compliant' : 'Standard Norms'}</strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                    <span className="text-sm">💼</span>
                    <span>Commercial Lease Terms</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    Lock-in Period: <strong>{property.commercialDetails?.lockInPeriodMonths || 12} Months</strong><br />
                    Annual Escalation: <strong>{property.commercialDetails?.escalationPercentage || 5}% Yearly</strong>
                    {property.commercialDetails?.gstin && <><br />GSTIN: <span className="font-mono text-[11px] font-bold">{property.commercialDetails.gstin}</span></>}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Living Reality Transparency Hub (Electricity & Water) */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Electricity & Water Supply Reality</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Electricity Meter Card */}
              <div className={`p-4 rounded-2xl border ${isDirectGovtMeter ? 'bg-blue-50/60 border-blue-200' : 'bg-amber-50/60 border-amber-200'} space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Electricity Meter</span>
                  <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${isDirectGovtMeter ? 'bg-blue-600 text-white' : 'bg-amber-600 text-white'}`}>
                    {isDirectGovtMeter ? 'Govt PGVCL Meter' : 'Sub-meter'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {isDirectGovtMeter
                    ? 'Property has an independent PGVCL government meter. You pay official consumer tariff rates directly to PGVCL online.'
                    : `Property runs on a sub-meter connected to main board. Unit billing is charged at ₹${property.utilities.subMeterUnitRate} per unit consumed.`}
                </p>
              </div>

              {/* Water Supply Card */}
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Water Availability</span>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-600 text-white">
                    {property.utilities.waterSupplyType === '24_7_continuous' ? '24/7 Continuous' : 'Scheduled Hours'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong>Schedule:</strong> {property.utilities.waterScheduleHours}.<br />
                  <strong>Source:</strong> {property.utilities.waterSource?.join(', ') || 'Municipal Corporation RMC'}.
                </p>
              </div>
            </div>
          </div>

          {/* Living Cost Breakdown Calculator */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 text-white space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-extrabold">Total Monthly Living Cost Estimator</h3>
              </div>
              <span className="text-xs text-blue-300 font-bold bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-400/30">
                Zero Hidden Surprises
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Calculate your exact expected monthly outflow by adjusting your anticipated electricity consumption.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Estimated Monthly Electricity Units:</span>
                <span className="text-amber-400 font-mono text-sm">{estUnits} kWh (Units)</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={estUnits}
                onChange={(e) => setEstUnits(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>50 units (Light usage)</span>
                <span>200 units (1 AC)</span>
                <span>400+ units (2-3 ACs)</span>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Base Monthly Rent</span>
                <span className="text-sm font-bold">₹{property.pricing.monthlyRent.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Society Maintenance</span>
                <span className="text-sm font-bold">
                  {property.pricing.maintenanceAmount ? `₹${property.pricing.maintenanceAmount}` : 'Included'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Est. Electricity ({isDirectGovtMeter ? 'PGVCL' : 'Sub-meter'})</span>
                <span className="text-sm font-bold text-amber-400">₹{estimatedElectricBill}</span>
              </div>
              <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/40">
                <span className="text-blue-200 block text-[10px] uppercase font-bold">Total Est. Outflow</span>
                <span className="text-base font-black text-white">₹{totalEstimatedOutflow.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* House Rules & Community Guidelines */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span>House Rules & Living Guidelines</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase">Food Culture</span>
                <span className="text-slate-900 font-bold">{property.rules?.foodPreference || 'Any Food Allowed'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase">Allowed Occupants</span>
                <span className="text-slate-900 font-bold">{property.rules?.allowedTenants || 'Any / All Welcome'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase">Gate Access</span>
                <span className="text-slate-900 font-bold">{property.rules?.gateCurfew || '24/7 Open Access'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase">Visitors / Guests</span>
                <span className="text-slate-900 font-bold">{property.rules?.visitorsAllowed ? 'Guests Permitted' : 'Restricted'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase">Pet Policy</span>
                <span className="text-slate-900 font-bold">{property.rules?.petsAllowed ? 'Pets Allowed' : 'No Pets'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase">Lock-in Period</span>
                <span className="text-slate-900 font-bold">
                  {property.commercialDetails?.lockInPeriodMonths || property.pricing?.lockInPeriodMonths || 6} Months
                </span>
              </div>
            </div>
          </div>

          {/* Amenities & Furnishing Checklist */}
          {property.furnishingItems?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Furnished Fixtures & Items</h4>
              <div className="flex flex-wrap gap-2">
                {property.furnishingItems.map((item, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {property.amenities?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Society Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((item, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          
          {/* Booking & Pricing Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-6">
            
            {/* Price Headline */}
            <div className="pb-4 border-b border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  ₹{property.pricing.monthlyRent.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-bold"> / month</span>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Deposit: ₹{property.pricing.securityDeposit.toLocaleString()}
              </span>
            </div>

            {/* Direct Connect Buttons */}
            <div className="space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Owner on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    toast('Please login to chat in app', { icon: '🔑' });
                    setIsAuthModalOpen(true);
                    return;
                  }
                  setIsChatOpen(true);
                }}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Chat in App with Landlord</span>
              </button>

              <button
                onClick={() => setIsVisitModalOpen(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Physical Visit Pass</span>
              </button>
            </div>

            {/* Landlord / Broker Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Listed By</div>
              <div className="flex items-center space-x-3">
                <img
                  src={property.owner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={property.owner?.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{property.owner?.name || 'Jayeshbhai Patel'}</div>
                  <div className="text-[11px] font-semibold text-blue-600 capitalize">
                    {property.owner?.role === 'owner' ? 'Direct Property Owner' : 'Verified Broker'}
                  </div>
                </div>
              </div>

              {property.owner?.phone && (
                <div className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 pt-1 border-t border-slate-200">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{property.owner.phone}</span>
                </div>
              )}
            </div>

            {/* Zero Scam Safety Notice */}
            <div className="text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center space-x-1 text-emerald-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RentNest Trust & Safety Guarantee</span>
              </div>
              <p>Never transfer a token deposit before inspecting the physical home with an issued visit pass.</p>
            </div>

            {/* Report Listing Button */}
            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                onClick={async () => {
                  if (window.confirm('Report this listing to RentNest moderation for fake pricing, misleading photos, or already rented?')) {
                    try {
                      await api.post(`/properties/${property._id}/report`, { reason: 'User flagged' });
                      toast.success('Report submitted. Operations team will investigate.');
                    } catch (err) {
                      toast.error('Failed to report listing');
                    }
                  }
                }}
                className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold transition-colors flex items-center justify-center space-x-1 mx-auto"
              >
                <span>🚩 Report Listing Issue / Flag Scam</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Physical Visit Booking Modal */}
      {isVisitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4 sm:space-y-5">
            <h3 className="text-base font-extrabold text-slate-900">
              Schedule Physical Property Visit
            </h3>

            {visitPass ? (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">Visit Pass Issued!</h4>
                  <div className="text-xl font-mono font-black text-blue-600">{visitPass.visitPassCode}</div>
                  <p className="text-xs text-slate-500">Show this code to the building guard or owner upon arrival.</p>
                </div>
                <button
                  onClick={() => {
                    setIsVisitModalOpen(false);
                    setVisitPass(null);
                  }}
                  className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookVisit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={visitSlot}
                    onChange={(e) => setVisitSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="Morning: 10:00 AM - 12:00 PM">Morning: 10:00 AM - 12:00 PM</option>
                    <option value="Afternoon: 02:00 PM - 04:00 PM">Afternoon: 02:00 PM - 04:00 PM</option>
                    <option value="Evening: 05:00 PM - 07:00 PM">Evening: 05:00 PM - 07:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Note for Landlord (Optional)</label>
                  <textarea
                    rows={2}
                    value={visitNote}
                    onChange={(e) => setVisitNote(e.target.value)}
                    placeholder="e.g. Coming with family on Sunday"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-600 resize-none"
                  ></textarea>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsVisitModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                  >
                    Generate Pass
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Printable TO LET Poster Modal */}
      <ToLetPosterModal
        property={property}
        isOpen={isPosterOpen}
        onClose={() => setIsPosterOpen(false)}
      />

    </div>
  );
};

export default PropertyDetailPage;
