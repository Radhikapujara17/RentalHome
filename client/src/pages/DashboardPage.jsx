import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/client';
import toast from 'react-hot-toast';
import KycUploadModal from '../components/KycUploadModal';
import { 
  User, 
  Home, 
  Calendar, 
  ShieldCheck, 
  PlusCircle, 
  ExternalLink, 
  Trash2, 
  Clock,
  CheckCircle2,
  Phone,
  FileCheck
} from 'lucide-react';

const DashboardPage = () => {
  const { user, demoLogin } = useAuth();
  const [properties, setProperties] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [propsRes, visitsRes] = await Promise.all([
          api.get('/properties/my/listings').catch(() => ({ data: { properties: [] } })),
          api.get('/visits/my').catch(() => ({ data: { visits: [] } }))
        ]);
        if (propsRes.data.properties) setProperties(propsRes.data.properties);
        if (visitsRes.data.visits) setVisits(visitsRes.data.visits);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Please login to access dashboard</h2>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => demoLogin('tenant')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Demo Tenant
          </button>
          <button
            onClick={() => demoLogin('owner')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Demo Owner
          </button>
        </div>
      </div>
    );
  }

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter((p) => p._id !== id));
      toast.success('Listing removed successfully');
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      
      {/* User Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-500/20"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900">{user.name}</h1>
              {user.verificationStatus === 'verified' && (
                <span className="p-1 rounded-full bg-blue-50 text-blue-600" title="Verified Owner">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500 font-semibold flex flex-wrap items-center gap-2 mt-1">
              <span className="font-mono text-slate-700">{user.phone}</span>
              {user.email && (
                <>
                  <span>•</span>
                  <span className="text-slate-600">{user.email}</span>
                </>
              )}
              <span>•</span>
              <span className="text-slate-600 font-medium">📍 {user.city || 'Rajkot'}</span>
              <span>•</span>
              <span className="capitalize px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                {user.role}
              </span>
              {user.role === 'owner' && (
                user.verificationStatus === 'verified' ? (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    ✓ Verified Landlord
                  </span>
                ) : (
                  <button
                    onClick={() => setIsKycModalOpen(true)}
                    className="px-2 py-0.5 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-800 text-[10px] font-bold transition-colors"
                  >
                    + Verify with Electricity Bill
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Quick Role Switcher for Developer / Reviewer convenience */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Switch Persona:</span>
          {['tenant', 'owner', 'broker', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => demoLogin(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                user.role === r ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: My Properties & My Scheduled Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: My Listed Properties (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Home className="w-5 h-5 text-blue-600" />
              <span>My Properties ({properties.length})</span>
            </h2>
            <Link
              to="/post-property"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add New</span>
            </Link>
          </div>

          {loading ? (
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>
          ) : properties.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
              <p className="text-xs font-bold text-slate-600">No properties listed under this account yet.</p>
              <Link to="/post-property" className="text-xs font-bold text-blue-600 hover:underline block">
                Post your first property listing
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map((prop) => (
                <div
                  key={prop._id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={prop.photos?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80'}
                      alt={prop.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">{prop.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{prop.societyName}, {prop.locality} • {prop.bhk}</p>
                      <span className="text-xs font-black text-blue-600">₹{prop.pricing.monthlyRent.toLocaleString()}/mo</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/property/${prop.slug || prop._id}`}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteProperty(prop._id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Scheduled Visits (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span>Scheduled Physical Visits ({visits.length})</span>
          </h2>

          {visits.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No active physical visit passes</p>
              <p className="text-[11px] text-slate-400">Book visits on any listing to receive your visit pass code.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visits.map((v) => (
                <div key={v._id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                      {v.visitPassCode}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {v.status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-800 line-clamp-1">
                    {v.property?.societyName || 'Rental Flat'}, {v.property?.locality}
                  </div>

                  <div className="text-[11px] text-slate-500 font-medium">
                    📅 {new Date(v.preferredDate).toLocaleDateString()} • {v.timeSlot}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Owner KYC Verification Modal */}
      <KycUploadModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
      />

    </div>
  );
};

export default DashboardPage;
