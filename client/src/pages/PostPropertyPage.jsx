import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Home,
  Droplets,
  Leaf,
  Plus,
  X,
  Check,
  Save,
  Edit3,
  Loader2,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

const CITY_LOCALITIES = {
  Rajkot: [
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
    'SG Highway',
    'Prahlad Nagar',
    'Bodakdev',
    'Satellite',
    'Bopal',
    'Vastrapur',
    'Sanand GIDC'
  ],
  Surat: [
    'Vesu',
    'Adajan',
    'Pal',
    'Piplod',
    'Ghod Dod Road',
    'Varachha',
    'Sachin GIDC'
  ],
  Vadodara: [
    'Alkapuri',
    'Vasna Road',
    'Gotri',
    'OP Road',
    'Manjalpur',
    'Sayajigunj',
    'Makarpura GIDC'
  ]
};

const LOCALITIES = CITY_LOCALITIES.Rajkot;

const RESIDENTIAL_FIXTURES = [
  'Modular Kitchen',
  'Geyser',
  'Fans & Lights',
  'Split AC',
  'Wardrobe in Bedroom',
  'Sofa Set',
  'Double Bed with Mattress',
  'RO Water Purifier',
  'Washing Machine',
  'Dining Table',
  'Refrigerator',
  'Curtains & Blinds',
  'Chimney',
  'TV Unit'
];

const COMMERCIAL_FIXTURES = [
  'Toughened Glass Facade Frontage',
  'Motorized Rolling Shutter',
  'Private MD Cabins',
  'Ergonomic Workstations',
  'Conference Room Setup',
  'Equipped Pantry with RO',
  'Heavy Trimix Concrete Flooring',
  'LED Track Lights',
  'Central AC Ducting',
  'Attached Washrooms'
];

const RESIDENTIAL_AMENITIES = [
  'Covered 4W Parking',
  'Lift with Backup',
  '24/7 CCTV Security',
  'Security Guard at Gate',
  'Piped Natural Gas (PNG)',
  'Clubhouse & Gym',
  'Children Play Area',
  'Borewell & Municipal Water',
  'Visitor Parking',
  'Rainwater Harvesting'
];

const COMMERCIAL_AMENITIES = [
  'Heavy Container Loading Dock',
  'Basement Customer Parking (10+ Cars)',
  'Dual High Speed Elevators',
  'Goods Elevator',
  '100% DG Power Backup',
  'Fire Sprinkler & Alarm System',
  'High Speed Optical Fiber Ready',
  '24/7 Security & Guard Room',
  'Wide Truck Turnaround Area'
];

const PostPropertyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user, isAuthenticated, demoLogin, setIsAuthModalOpen } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [loadingListing, setLoadingListing] = useState(isEdit);

  // Form State
  const [formData, setFormData] = useState({
    category: 'residential', // 'residential' | 'commercial'
    title: '',
    propertyType: 'flat',
    bhk: '2 BHK',
    carpetAreaSqFt: 1100,
    floorNumber: 3,
    totalFloors: 10,
    facing: 'East',
    city: 'Rajkot',
    locality: 'Kalawad Road',
    societyName: '',
    fullAddress: '',
    landmark: '',
    coordinates: { lat: 22.2885, lng: 70.7681 },
    commercialDetails: {
      commercialType: 'retail_shop',
      connectedPowerLoadHp: 15,
      electricPhaseType: 'three_phase',
      frontageRoadWidthFt: 60,
      ceilingHeightClearFt: 12,
      buPermissionCertified: true,
      fireNocStatus: false,
      escalationPercentage: 5,
      lockInPeriodMonths: 12,
      gstin: ''
    },
    pricing: {
      monthlyRent: 15000,
      securityDeposit: 30000,
      depositMonths: 2,
      maintenanceAmount: 1200,
      isMaintenanceIncluded: false,
      brokerageAmount: 0,
      lockInPeriodMonths: 6,
      noticePeriodDays: 30
    },
    utilities: {
      electricityMeterType: 'direct_govt_pgvcl',
      subMeterUnitRate: 0,
      waterSupplyType: '24_7_continuous',
      waterScheduleHours: '24 Hours Continuous',
      waterSource: ['Municipal RMC/Narmada'],
      drinkingWaterRo: true,
      pipedGasAvailable: true,
      fiberInternetPreWired: true
    },
    rules: {
      allowedTenants: 'Family Only',
      foodPreference: 'Pure Vegetarian Only',
      gateCurfew: '24/7 Open / Self-Key Access',
      visitorsAllowed: true,
      petsAllowed: false
    },
    furnishingStatus: 'Semi-Furnished',
    furnishingItems: ['Modular Kitchen', 'Geyser', 'Fans & Lights'],
    amenities: ['Covered 4W Parking', 'Lift with Backup', 'CCTV Security'],
    photoUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    ownershipDocumentUrl: '',
    ownershipDocumentType: 'electricity_bill',
    consumerName: '',
    consumerNumber: '',
    ownershipDocumentVerified: false,
    isVerifiedOwner: false
  });

  // Load existing property data if in Edit Mode
  useEffect(() => {
    if (!id) return;
    const loadPropertyToEdit = async () => {
      try {
        setLoadingListing(true);
        const res = await api.get(`/properties/${id}`);
        if (res.data.success && res.data.property) {
          const p = res.data.property;
          const ownerId = p.owner?._id || p.owner;
          const currentUserId = user?._id || user?.id;
          if (user && ownerId && currentUserId && currentUserId.toString() !== ownerId.toString() && user.role !== 'admin') {
            toast.error('You do not have permission to edit this property listing');
            navigate('/dashboard');
            return;
          }

          setFormData({
            category: p.category || 'residential',
            title: p.title || '',
            propertyType: p.propertyType || (p.category === 'commercial' ? (p.commercialDetails?.commercialType || 'retail_shop') : 'flat'),
            bhk: p.bhk || (p.category === 'commercial' ? 'N/A' : '2 BHK'),
            carpetAreaSqFt: p.carpetAreaSqFt || 1000,
            floorNumber: p.floorNumber ?? 0,
            totalFloors: p.totalFloors ?? 1,
            facing: p.facing || 'East',
            city: p.city || 'Rajkot',
            locality: p.locality || 'Kalawad Road',
            societyName: p.societyName || '',
            fullAddress: p.fullAddress || '',
            landmark: p.landmark || '',
            coordinates: p.coordinates || { lat: 22.2885, lng: 70.7681 },
            commercialDetails: {
              commercialType: p.commercialDetails?.commercialType || 'retail_shop',
              connectedPowerLoadHp: p.commercialDetails?.connectedPowerLoadHp ?? 15,
              electricPhaseType: p.commercialDetails?.electricPhaseType || 'three_phase',
              frontageRoadWidthFt: p.commercialDetails?.frontageRoadWidthFt ?? 60,
              ceilingHeightClearFt: p.commercialDetails?.ceilingHeightClearFt ?? 12,
              buPermissionCertified: p.commercialDetails?.buPermissionCertified ?? true,
              fireNocStatus: p.commercialDetails?.fireNocStatus ?? false,
              escalationPercentage: p.commercialDetails?.escalationPercentage ?? 5,
              lockInPeriodMonths: p.commercialDetails?.lockInPeriodMonths ?? 12,
              gstin: p.commercialDetails?.gstin || ''
            },
            pricing: {
              monthlyRent: p.pricing?.monthlyRent ?? 15000,
              securityDeposit: p.pricing?.securityDeposit ?? 30000,
              depositMonths: p.pricing?.depositMonths ?? 2,
              maintenanceAmount: p.pricing?.maintenanceAmount ?? 0,
              isMaintenanceIncluded: p.pricing?.isMaintenanceIncluded ?? false,
              brokerageAmount: p.pricing?.brokerageAmount ?? 0,
              lockInPeriodMonths: p.pricing?.lockInPeriodMonths ?? 6,
              noticePeriodDays: p.pricing?.noticePeriodDays ?? 30
            },
            utilities: {
              electricityMeterType: p.utilities?.electricityMeterType || 'direct_govt_pgvcl',
              subMeterUnitRate: p.utilities?.subMeterUnitRate ?? 0,
              waterSupplyType: p.utilities?.waterSupplyType || '24_7_continuous',
              waterScheduleHours: p.utilities?.waterScheduleHours || '24 Hours Continuous',
              waterSource: p.utilities?.waterSource || ['Municipal RMC/Narmada'],
              drinkingWaterRo: p.utilities?.drinkingWaterRo ?? true,
              pipedGasAvailable: p.utilities?.pipedGasAvailable ?? true,
              fiberInternetPreWired: p.utilities?.fiberInternetPreWired ?? true
            },
            rules: {
              allowedTenants: p.rules?.allowedTenants || 'Family Only',
              foodPreference: p.rules?.foodPreference || 'Pure Vegetarian Only',
              gateCurfew: p.rules?.gateCurfew || '24/7 Open / Self-Key Access',
              visitorsAllowed: p.rules?.visitorsAllowed ?? true,
              petsAllowed: p.rules?.petsAllowed ?? false
            },
            furnishingStatus: p.furnishingStatus || 'Semi-Furnished',
            furnishingItems: p.furnishingItems || [],
            amenities: p.amenities || [],
            photoUrl: p.photos?.[0]?.url || '',
            ownershipDocumentUrl: p.ownershipDocumentUrl || '',
            ownershipDocumentType: p.ownershipDocumentType || 'electricity_bill',
            consumerName: p.verifiedDocumentDetails?.consumerName || '',
            consumerNumber: p.verifiedDocumentDetails?.consumerNumber || '',
            ownershipDocumentVerified: Boolean(p.ownershipDocumentVerified),
            isVerifiedOwner: Boolean(p.isVerifiedOwner)
          });
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load property details');
        navigate('/dashboard');
      } finally {
        setLoadingListing(false);
      }
    };

    loadPropertyToEdit();
  }, [id, user]);

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const [customFixture, setCustomFixture] = useState('');
  const [customAmenity, setCustomAmenity] = useState('');

  const toggleArrayItem = (field, item) => {
    setFormData((prev) => {
      const currentList = prev[field] || [];
      const exists = currentList.includes(item);
      return {
        ...prev,
        [field]: exists ? currentList.filter((i) => i !== item) : [...currentList, item]
      };
    });
  };

  const handleAddCustomItem = (field, value, clearFn) => {
    if (!value || !value.trim()) return;
    const trimmed = value.trim();
    setFormData((prev) => {
      const currentList = prev[field] || [];
      if (currentList.includes(trimmed)) return prev;
      return { ...prev, [field]: [...currentList, trimmed] };
    });
    clearFn('');
  };

  const removeArrayItem = (field, item) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((i) => i !== item)
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isAuthenticated) {
      toast('Please login as Owner to proceed', { icon: '🔑' });
      await demoLogin('owner');
    }

    try {
      setSubmitting(true);
      const isCommercial = formData.category === 'commercial';
      const payload = {
        ...formData,
        bhk: isCommercial ? 'N/A' : formData.bhk,
        propertyType: isCommercial ? formData.commercialDetails.commercialType : formData.propertyType,
      };

      if (formData.photoUrl) {
        payload.photos = [
          {
            url: formData.photoUrl,
            roomTag: isCommercial ? 'Commercial Frontage' : 'Living Room',
            isCoverPhoto: true
          }
        ];
      }

      if (isEdit) {
        const res = await api.put(`/properties/${id}`, payload);
        if (res.data.success) {
          toast.success(isCommercial ? 'Commercial listing updated successfully!' : 'Property listing updated successfully!');
          navigate(`/property/${res.data.property?.slug || id}`);
        }
      } else {
        const res = await api.post('/properties', payload);
        if (res.data.success) {
          toast.success(isCommercial ? 'Commercial listing published successfully!' : 'Property posted successfully on RentNest!');
          navigate(`/property/${res.data.property.slug || res.data.property._id}`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'post'} property`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingListing) {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
        <Loader2 className="w-10 h-10 mx-auto text-blue-600 animate-spin" />
        <h2 className="text-lg font-bold text-slate-800">Loading Property Details...</h2>
        <p className="text-xs text-slate-500">Fetching listing data for editing.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Building2 className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">Sign in to Post Your Property</h2>
          <p className="text-xs text-slate-500 font-medium">
            Join Rajkot landlords and brokers saving 100% on brokerage fees with verified direct listings.
          </p>
        </div>
        <div className="space-y-3 pt-2">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
          >
            Sign In with Phone OTP
          </button>
          <button
            onClick={() => demoLogin('owner')}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all"
          >
            Quick 1-Click Demo (Owner Account)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          {isEdit ? <Edit3 className="w-3.5 h-3.5 text-amber-600" /> : <Home className="w-3.5 h-3.5" />}
          <span>{isEdit ? 'Edit Property Listing' : 'Post Verified Rental Property'}</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {isEdit ? 'Update Your Property Listing' : 'List Your Property on RentNest'}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {isEdit 
            ? 'Update rent, deposit, furnishing fixtures, society amenities, commercial specs, or photos.' 
            : 'Zero brokerage, transparent PGVCL electricity meter declaration & direct WhatsApp inquiries.'}
        </p>
        {isEdit && (
          <div className="pt-1">
            <Link to="/dashboard" className="text-xs font-bold text-blue-600 hover:underline">
              ← Return to Dashboard
            </Link>
          </div>
        )}
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between relative px-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex flex-col items-center z-10">
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !formData.title && s > 1) {
                  toast.error('Please enter a listing title');
                  return;
                }
                setStep(s);
              }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                step >= s ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {s}
            </button>
            <span className="text-[10px] font-bold text-slate-500 mt-1 hidden sm:block">
              {s === 1 ? 'Basics' : s === 2 ? 'Location' : s === 3 ? 'Pricing' : s === 4 ? 'Utilities' : 'Rules & Photos'}
            </span>
          </div>
        ))}
        <div className="absolute top-4 inset-x-8 h-0.5 bg-slate-200 -z-0"></div>
      </div>

      {/* Wizard Card Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* STEP 1: BASICS */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Step 1: Category & Property Specifications</span>
            </h3>

            {/* Category Selector Tabs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Property Category</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, category: 'residential' }))}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center space-x-3 ${
                    formData.category === 'residential'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Home className={`w-6 h-6 ${formData.category === 'residential' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-extrabold">🏠 Residential Home</div>
                    <div className="text-[10px] text-slate-500">Flat, Villa, Row House, PG</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, category: 'commercial' }))}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all flex items-center space-x-3 ${
                    formData.category === 'commercial'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Building2 className={`w-6 h-6 ${formData.category === 'commercial' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="text-xs font-extrabold">🏢 Commercial Space</div>
                    <div className="text-[10px] text-slate-500">Retail Shop, Office, Showroom, Shed</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Listing Headline</label>
              <input
                type="text"
                placeholder={
                  formData.category === 'commercial'
                    ? "e.g. 1,850 Sq.Ft Ground Floor Showroom on 150 Ft Ring Road"
                    : "e.g. Spacious 2 BHK Flat with Garden View in Radhika Heights"
                }
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
              />
            </div>

            {formData.category === 'residential' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">BHK Configuration</label>
                    <select
                      value={formData.bhk}
                      onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white"
                    >
                      <option value="1 RK">1 RK</option>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4+ BHK">4+ BHK</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Carpet Area (Sq.Ft)</label>
                    <input
                      type="number"
                      value={formData.carpetAreaSqFt}
                      onChange={(e) => setFormData({ ...formData, carpetAreaSqFt: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Floor Number</label>
                    <input
                      type="number"
                      value={formData.floorNumber}
                      onChange={(e) => setFormData({ ...formData, floorNumber: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Facing / Vastu</label>
                    <select
                      value={formData.facing}
                      onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white"
                    >
                      <option value="East">East</option>
                      <option value="North-East">North-East</option>
                      <option value="North">North</option>
                      <option value="West">West</option>
                      <option value="South">South</option>
                    </select>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Commercial Property Type</label>
                    <select
                      value={formData.commercialDetails.commercialType}
                      onChange={(e) => handleNestedChange('commercialDetails', 'commercialType', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white"
                    >
                      <option value="retail_shop">Retail Shop</option>
                      <option value="showroom">Showroom</option>
                      <option value="corporate_office">Corporate Office</option>
                      <option value="industrial_shed">Industrial Shed / Factory</option>
                      <option value="warehouse_godown">Warehouse / Godown</option>
                      <option value="co_working">Co-Working Space</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Carpet Area (Sq.Ft)</label>
                    <input
                      type="number"
                      value={formData.carpetAreaSqFt}
                      onChange={(e) => setFormData({ ...formData, carpetAreaSqFt: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Connected Power Load (HP)</label>
                    <input
                      type="number"
                      value={formData.commercialDetails.connectedPowerLoadHp}
                      onChange={(e) => handleNestedChange('commercialDetails', 'connectedPowerLoadHp', Number(e.target.value))}
                      placeholder="e.g. 15 HP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Power Phase Type</label>
                    <select
                      value={formData.commercialDetails.electricPhaseType}
                      onChange={(e) => handleNestedChange('commercialDetails', 'electricPhaseType', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white"
                    >
                      <option value="three_phase">3-Phase Industrial / Commercial</option>
                      <option value="single_phase">Single-Phase Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Road Frontage Width (Ft)</label>
                    <input
                      type="number"
                      value={formData.commercialDetails.frontageRoadWidthFt}
                      onChange={(e) => handleNestedChange('commercialDetails', 'frontageRoadWidthFt', Number(e.target.value))}
                      placeholder="e.g. 60 or 150"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Clear Ceiling Height (Ft)</label>
                    <input
                      type="number"
                      value={formData.commercialDetails.ceilingHeightClearFt}
                      onChange={(e) => handleNestedChange('commercialDetails', 'ceilingHeightClearFt', Number(e.target.value))}
                      placeholder="e.g. 12 or 24"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="buCert"
                      checked={formData.commercialDetails.buPermissionCertified}
                      onChange={(e) => handleNestedChange('commercialDetails', 'buPermissionCertified', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <label htmlFor="buCert" className="text-xs font-bold text-slate-700 cursor-pointer">
                      BU Permission Certified
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="fireNoc"
                      checked={formData.commercialDetails.fireNocStatus}
                      onChange={(e) => handleNestedChange('commercialDetails', 'fireNocStatus', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <label htmlFor="fireNoc" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Fire NOC Certified
                    </label>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Step 2: City & Locality in Gujarat</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City in Gujarat</label>
                <select
                  value={formData.city || 'Rajkot'}
                  onChange={(e) => {
                    const c = e.target.value;
                    const defaultLoc = (CITY_LOCALITIES[c] && CITY_LOCALITIES[c][0]) || 'Kalawad Road';
                    setFormData({ ...formData, city: c, locality: defaultLoc });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white cursor-pointer"
                >
                  <option value="Rajkot">Rajkot</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Surat">Surat</option>
                  <option value="Vadodara">Vadodara</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Zone</label>
                <select
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white cursor-pointer"
                >
                  {(CITY_LOCALITIES[formData.city || 'Rajkot'] || CITY_LOCALITIES['Rajkot']).map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Society / Building Name</label>
              <input
                type="text"
                placeholder="e.g. Radhika Heights or Orchid Harmony"
                value={formData.societyName}
                onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label>
              <textarea
                rows={2}
                placeholder="e.g. Flat 402, 4th Floor, Opposite Cosmoplex Cinema, Kalawad Road"
                value={formData.fullAddress}
                onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nearby Landmark</label>
              <input
                type="text"
                placeholder="e.g. Opposite Crystal Mall"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: PRICING */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              <span>Step 3: Transparent Pricing & Deposit</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={formData.pricing.monthlyRent}
                  onChange={(e) => handleNestedChange('pricing', 'monthlyRent', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold text-blue-600 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={formData.pricing.securityDeposit}
                  onChange={(e) => handleNestedChange('pricing', 'securityDeposit', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Society Maintenance (₹/month)</label>
                <input
                  type="number"
                  value={formData.pricing.maintenanceAmount}
                  onChange={(e) => handleNestedChange('pricing', 'maintenanceAmount', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brokerage Amount (₹)</label>
                <input
                  type="number"
                  value={formData.pricing.brokerageAmount}
                  onChange={(e) => handleNestedChange('pricing', 'brokerageAmount', Number(e.target.value))}
                  placeholder="0 for direct owner"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
                />
                <span className="text-[10px] text-slate-400">Leave 0 if you are direct landlord</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: UTILITIES */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Step 4: Electricity & Water Reality</span>
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">Electricity Meter Setup</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleNestedChange('utilities', 'electricityMeterType', 'direct_govt_pgvcl')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.utilities.electricityMeterType === 'direct_govt_pgvcl'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs">Direct Govt PGVCL Meter</div>
                  <div className="text-[10px] font-normal text-slate-500 mt-1">Tenant pays official PGVCL bill</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleNestedChange('utilities', 'electricityMeterType', 'sub_meter')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    formData.utilities.electricityMeterType === 'sub_meter'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs">Sub-meter</div>
                  <div className="text-[10px] font-normal text-slate-500 mt-1">Pay per unit consumed</div>
                </button>
              </div>

              {formData.utilities.electricityMeterType === 'sub_meter' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sub-meter Unit Rate (₹/kWh unit)</label>
                  <input
                    type="number"
                    value={formData.utilities.subMeterUnitRate}
                    onChange={(e) => handleNestedChange('utilities', 'subMeterUnitRate', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-amber-800"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">Water Supply Reality</label>
              <select
                value={formData.utilities.waterSupplyType}
                onChange={(e) => handleNestedChange('utilities', 'waterSupplyType', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white"
              >
                <option value="24_7_continuous">24/7 Continuous Water Supply</option>
                <option value="scheduled_municipal">Scheduled Municipal Supply (1-2 Hours/day)</option>
                <option value="tanker_dependent">Tanker Dependent</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 5: RULES & PHOTOS */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span>Step 5: Living Culture & Photos</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Food Preference</label>
                <select
                  value={formData.rules.foodPreference}
                  onChange={(e) => handleNestedChange('rules', 'foodPreference', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white"
                >
                  <option value="Pure Vegetarian Only">Pure Vegetarian Only</option>
                  <option value="Vegetarian / Jain Preferred">Vegetarian / Jain Preferred</option>
                  <option value="Non-Veg Allowed">Non-Veg Allowed</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tenant Category</label>
                <select
                  value={formData.rules.allowedTenants}
                  onChange={(e) => handleNestedChange('rules', 'allowedTenants', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white"
                >
                  <option value="Family Only">Family Only</option>
                  <option value="Working Professionals Only">Working Professionals Only</option>
                  <option value="Bachelors (Male)">Bachelors (Male)</option>
                  <option value="Bachelors (Female)">Bachelors (Female)</option>
                  <option value="Any">Any</option>
                </select>
              </div>
            </div>

            {/* Furnishing Status */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">Furnishing Level</label>
              <div className="grid grid-cols-3 gap-2">
                {['Semi-Furnished', 'Fully Furnished', 'Unfurnished'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setFormData({ ...formData, furnishingStatus: status })}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.furnishingStatus === status
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Furnished Fixtures & Items (Dynamic Selector) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Furnished Fixtures & Items ({formData.furnishingItems?.length || 0} selected)
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">Tap to select or deselect</span>
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-1.5">
                {(formData.category === 'commercial' ? COMMERCIAL_FIXTURES : RESIDENTIAL_FIXTURES).map((fixture) => {
                  const isSelected = formData.furnishingItems?.includes(fixture);
                  return (
                    <button
                      key={fixture}
                      type="button"
                      onClick={() => toggleArrayItem('furnishingItems', fixture)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{fixture}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Fixture Input */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom fixture (e.g. Italian Wardrobe, Inverter, Microwave)..."
                  value={customFixture}
                  onChange={(e) => setCustomFixture(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomItem('furnishingItems', customFixture, setCustomFixture);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomItem('furnishingItems', customFixture, setCustomFixture)}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                >
                  + Add
                </button>
              </div>

              {/* Display Selected Custom Items if not in presets */}
              {formData.furnishingItems?.filter(item => !(formData.category === 'commercial' ? COMMERCIAL_FIXTURES : RESIDENTIAL_FIXTURES).includes(item)).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.furnishingItems
                    .filter(item => !(formData.category === 'commercial' ? COMMERCIAL_FIXTURES : RESIDENTIAL_FIXTURES).includes(item))
                    .map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-bold flex items-center space-x-1"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('furnishingItems', item)}
                          className="hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Society & Building Amenities (Dynamic Selector) */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Society & Building Amenities ({formData.amenities?.length || 0} selected)
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">Tap to select or deselect</span>
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-1.5">
                {(formData.category === 'commercial' ? COMMERCIAL_AMENITIES : RESIDENTIAL_AMENITIES).map((amenity) => {
                  const isSelected = formData.amenities?.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleArrayItem('amenities', amenity)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amenity Input */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom amenity (e.g. EV Car Charger, Swimming Pool, Squash Court)..."
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomItem('amenities', customAmenity, setCustomAmenity);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomItem('amenities', customAmenity, setCustomAmenity)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                >
                  + Add
                </button>
              </div>

              {/* Display Selected Custom Amenities if not in presets */}
              {formData.amenities?.filter(item => !(formData.category === 'commercial' ? COMMERCIAL_AMENITIES : RESIDENTIAL_AMENITIES).includes(item)).length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.amenities
                    .filter(item => !(formData.category === 'commercial' ? COMMERCIAL_AMENITIES : RESIDENTIAL_AMENITIES).includes(item))
                    .map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center space-x-1"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => removeArrayItem('amenities', item)}
                          className="hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <ImageUploader
                label="Upload Property Photo (From Computer / Mobile)"
                onUploadSuccess={(url) => {
                  setFormData((prev) => ({ ...prev, photoUrl: url }));
                  toast.success('Photo uploaded and ready for listing!');
                }}
              />

              {formData.photoUrl && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center space-x-3">
                  <img
                    src={formData.photoUrl}
                    alt="Uploaded Property Preview"
                    className="w-16 h-14 object-cover rounded-xl border border-emerald-300"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-800 flex items-center space-x-1">
                      <span>✓ Photo Attached to Listing</span>
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-xs">
                      {formData.photoUrl}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Or Paste Direct Image URL</label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
                />
              </div>

              {/* Ownership Proof & Bill Verification */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className={`w-5 h-5 ${formData.ownershipDocumentVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-900">
                      Ownership Document Verification (Earn "✓ Verified Property" Tag)
                    </span>
                  </div>
                  {formData.ownershipDocumentVerified ? (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ✓ Verified Tag Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                      Optional
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upload your PGVCL/DISCOM electricity bill, municipal tax receipt, or property document. If the name matches your landlord profile (<strong>{user?.name}</strong>), your listing is instantly awarded the green <strong>"✓ Verified Property"</strong> badge.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Document Type</label>
                    <select
                      value={formData.ownershipDocumentType}
                      onChange={(e) => setFormData({ ...formData, ownershipDocumentType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                    >
                      <option value="electricity_bill">PGVCL / DISCOM Electricity Bill</option>
                      <option value="property_tax_receipt">Municipal Property Tax Slip</option>
                      <option value="index_2_deed">Sub-Registrar Index-2 Deed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Consumer / Owner Name on Document</label>
                    <input
                      type="text"
                      value={formData.consumerName}
                      onChange={(e) => setFormData({ ...formData, consumerName: e.target.value })}
                      placeholder={user?.name || "e.g. Jayesh Patel"}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <ImageUploader
                  label="Upload Property Bill / Ownership Proof"
                  onUploadSuccess={(url) => {
                    setFormData((prev) => ({ ...prev, ownershipDocumentUrl: url }));
                    toast.success('Ownership document uploaded!');
                  }}
                />

                {formData.ownershipDocumentUrl && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200">
                    <span className="text-[11px] text-slate-500 truncate max-w-xs">
                      📄 {formData.ownershipDocumentUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nameToCheck = formData.consumerName || user?.name || '';
                        const clean = (s) => (s || '').toLowerCase().replace(/\b(mr|mrs|shri|smt|dr|bhai|ben|kumar|lal|das|ji)\b/g, '').replace(/[^a-z0-9\s]/g, '').trim();
                        const uClean = clean(user?.name);
                        const dClean = clean(nameToCheck);
                        const isMatch = uClean === dClean || uClean.split(' ').some(t => dClean.includes(t)) || dClean.split(' ').some(t => uClean.includes(t));
                        if (isMatch) {
                          setFormData((prev) => ({
                            ...prev,
                            ownershipDocumentVerified: true,
                            isVerifiedOwner: true
                          }));
                          toast.success(`✓ Document verified! Belongs to ${user?.name}. Verified Property tag active!`);
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            ownershipDocumentVerified: false
                          }));
                          toast.error(`⚠️ Document name ("${nameToCheck}") does not match profile name ("${user?.name}").`);
                        }
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Verify Document & Add Badge
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
          ) : <div></div>}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !formData.title) {
                  toast.error('Please enter a listing title');
                  return;
                }
                setStep(step + 1);
              }}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-6 py-2.5 ${isEdit ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'} text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all`}
            >
              {isEdit ? <Save className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              <span>{submitting ? (isEdit ? 'Saving Changes...' : 'Publishing...') : (isEdit ? 'Save & Update Listing' : 'Publish Listing')}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default PostPropertyPage;
