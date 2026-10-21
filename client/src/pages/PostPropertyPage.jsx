import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Leaf
} from 'lucide-react';

const LOCALITIES = [
  'Kalawad Road',
  '150 Ft Ring Road',
  'University Road',
  'Nana Mava',
  'Raiya Road',
  'Mavdi',
  'Sadhu Vaswani Road',
  'Metoda GIDC'
];

const PostPropertyPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, demoLogin, setIsAuthModalOpen } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    propertyType: 'flat',
    bhk: '2 BHK',
    carpetAreaSqFt: 1100,
    floorNumber: 3,
    totalFloors: 10,
    facing: 'East',
    locality: 'Kalawad Road',
    societyName: '',
    fullAddress: '',
    landmark: '',
    coordinates: { lat: 22.2885, lng: 70.7681 },
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
    photoUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'
  });

  const handleNestedChange = (category, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast('Please login as Owner to post listing', { icon: '🔑' });
      await demoLogin('owner');
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        photos: [
          {
            url: formData.photoUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
            roomTag: 'Living Room',
            isCoverPhoto: true
          }
        ]
      };

      const res = await api.post('/properties', payload);
      if (res.data.success) {
        toast.success('Property posted successfully on RentNest!');
        navigate(`/property/${res.data.property.slug || res.data.property._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post property');
    } finally {
      setSubmitting(false);
    }
  };

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
          <Home className="w-3.5 h-3.5" />
          <span>Post Verified Rental Property</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          List Your Property on RentNest
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Zero brokerage, transparent PGVCL electricity meter declaration & direct WhatsApp inquiries.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between relative px-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex flex-col items-center z-10">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-colors ${
                step >= s ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {s}
            </div>
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
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>Step 1: Property Type & Basic Specs</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Listing Headline</label>
              <input
                type="text"
                placeholder="e.g. Spacious 2 BHK Flat with Garden View in Radhika Heights"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-blue-600 outline-none"
              />
            </div>

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
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Step 2: Locality & Society in Rajkot</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Rajkot Locality / Zone</label>
              <select
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 outline-none bg-white cursor-pointer"
              >
                {LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
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
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish Listing'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default PostPropertyPage;
