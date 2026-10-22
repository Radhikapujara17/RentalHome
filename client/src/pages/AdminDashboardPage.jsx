import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import toast from 'react-hot-toast';
import { 
  ShieldCheck, 
  Users, 
  Home, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  AlertTriangle,
  FileText,
  Search
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [pendingKyc, setPendingKyc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocUrl, setSelectedDocUrl] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricsRes, kycRes] = await Promise.all([
        api.get('/auth/admin/metrics'),
        api.get('/auth/admin/kyc/pending')
      ]);
      if (metricsRes.data.success) setMetrics(metricsRes.data.metrics);
      if (kycRes.data.success) setPendingKyc(kycRes.data.users);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewKyc = async (userId, status) => {
    try {
      const res = await api.put(`/auth/admin/kyc/${userId}/review`, { status });
      if (res.data.success) {
        toast.success(`Owner verification ${status}!`);
        setPendingKyc(pendingKyc.filter((u) => u._id !== userId));
        fetchAdminData();
      }
    } catch (err) {
      toast.error('Failed to update verification status');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Admin Operations Access Required</h2>
        <p className="text-xs text-slate-500">
          Please click "Login / Demo" in the top navigation and select the <strong>Admin</strong> persona.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Operations & Trust Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            RentNest Admin Operations Desk
          </h1>
        </div>
        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 self-start sm:self-auto"
        >
          Refresh Data
        </button>
      </div>

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{metrics.totalUsers}</div>
            <span className="text-[11px] text-slate-400">Tenants, Owners & Brokers</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Listings</span>
              <Home className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{metrics.totalProperties}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">Gujarat inventory</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Pending KYC</span>
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600">{metrics.pendingKyc}</div>
            <span className="text-[11px] text-slate-400">Electricity bills awaiting review</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Visit Passes</span>
              <Calendar className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{metrics.totalVisits}</div>
            <span className="text-[11px] text-slate-400">Digital visit codes issued</span>
          </div>
        </div>
      )}

      {/* Pending Landlord KYC Approval Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Owner Electricity Bill Verification Queue</span>
            </h2>
            <p className="text-xs text-slate-500">
              Verify proof of ownership before awarding the green "Verified Owner" trust badge.
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-bold text-xs rounded-full">
            {pendingKyc.length} Pending
          </span>
        </div>

        {pendingKyc.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700">Verification queue is clear!</p>
            <p className="text-[11px]">All uploaded landlord documents have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-4">Landlord</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">Uploaded File</th>
                  <th className="py-3 px-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pendingKyc.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[10px] text-slate-400">ID: {u._id}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{u.phone}</td>
                    <td className="py-3 px-4 capitalize font-semibold text-slate-800">
                      {u.kycDocumentType?.replace('_', ' ') || 'Electricity Bill'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedDocUrl(u.kycDocumentUrl)}
                        className="text-blue-600 hover:underline font-bold flex items-center space-x-1"
                      >
                        <span>View Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleReviewKyc(u._id, 'rejected')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleReviewKyc(u._id, 'verified')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
                        >
                          Approve Badge
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Inspector Modal */}
      {selectedDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900">Uploaded KYC Proof</h3>
              <button onClick={() => setSelectedDocUrl(null)} className="p-1 hover:bg-slate-100 rounded-full">
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <img src={selectedDocUrl} alt="KYC Document" className="w-full max-h-[500px] object-contain rounded-xl border" />
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
