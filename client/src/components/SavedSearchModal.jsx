import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import toast from 'react-hot-toast';
import { Bell, X, Phone, CheckCircle, MessageSquare } from 'lucide-react';

const SavedSearchModal = ({ isOpen, onClose, filters }) => {
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();
  const [whatsapp, setWhatsapp] = useState(user?.phone || '+91 ');
  const [channels, setChannels] = useState({ whatsapp: true, email: true, webPush: true });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast('Please login to set up automated alerts', { icon: '🔑' });
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setSaving(true);
      const res = await api.post('/searches', {
        criteria: filters,
        alertChannels: channels,
        phone: whatsapp
      });

      if (res.data.success) {
        toast.success(res.data.message);
        onClose();
      }
    } catch (err) {
      toast.error('Failed to save search criteria');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col p-4 sm:p-6 space-y-4 sm:space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">Instant WhatsApp Property Alerts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Be the first to know! As soon as an owner lists a property matching your active filters in <strong>{filters.locality || filters.city || 'Gujarat'}</strong>, we'll send a direct WhatsApp message.
        </p>

        {/* Current Active Criteria Chips */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Subscribed Criteria:</span>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[11px]">
              {filters.locality || 'Any Rajkot Locality'}
            </span>
            {filters.bhk && (
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-[11px]">
                {filters.bhk}
              </span>
            )}
            {filters.zeroBrokerage === 'true' && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                Zero Brokerage Only
              </span>
            )}
            {filters.meterType && (
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px]">
                PGVCL Meter
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Mobile Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Phone className="w-4 h-4 text-emerald-600" />
              </span>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={channels.whatsapp}
                onChange={(e) => setChannels({ ...channels, whatsapp: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
              />
              <span>Send instant WhatsApp message alert</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={channels.email}
                onChange={(e) => setChannels({ ...channels, email: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600"
              />
              <span>Send email notification with photos</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Set Instant Alert'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};

export default SavedSearchModal;
