import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Seo from '../components/Seo';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  Users,
  Home,
  Calendar,
  CheckCircle2,
  XCircle,
  ExternalLink,
  FileText,
  Search,
  BarChart3,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  TrendingUp,
  LayoutDashboard,
  Building2,
  X
} from 'lucide-react';

const CITIES = ['Rajkot', 'Ahmedabad', 'Surat', 'Vadodara'];

const EMPTY_USER_FORM = {
  name: '',
  phone: '',
  email: '',
  password: '',
  role: 'tenant',
  city: 'Rajkot',
  verificationStatus: 'unverified',
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = ['overview', 'analytics', 'users'].includes(searchParams.get('tab'))
    ? searchParams.get('tab')
    : 'overview';

  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [pendingKyc, setPendingKyc] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState(null);

  // Users CRUD Filters & Modal State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('active');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState(EMPTY_USER_FORM);
  const [savingUser, setSavingUser] = useState(false);

  const switchTab = (tab) => {
    if (tab === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [metricsRes, kycRes, analyticsRes] = await Promise.all([
        api.get('/auth/admin/metrics'),
        api.get('/auth/admin/kyc/pending'),
        api.get('/auth/admin/analytics'),
      ]);
      if (metricsRes.data.success) setMetrics(metricsRes.data.metrics);
      if (kycRes.data.success) setPendingKyc(kycRes.data.users);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.analytics);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const params = new URLSearchParams();
      if (userRoleFilter !== 'all') params.set('role', userRoleFilter);
      if (userStatusFilter) params.set('status', userStatusFilter);
      if (userSearch.trim()) params.set('search', userSearch.trim());
      const res = await api.get(`/auth/admin/users?${params.toString()}`);
      if (res.data.success) {
        setUsersList(res.data.users);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    if (user?.role === 'admin' && activeTab === 'users') {
      fetchUsers();
    }
  }, [user?.role, activeTab, userRoleFilter, userStatusFilter]);

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

  const openCreateUserModal = () => {
    setEditingUser(null);
    setUserForm(EMPTY_USER_FORM);
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (target) => {
    setEditingUser(target);
    setUserForm({
      name: target.name || '',
      phone: target.phone || '',
      email: target.email || '',
      password: '',
      role: target.role || 'tenant',
      city: target.city || 'Rajkot',
      verificationStatus: target.verificationStatus || 'unverified',
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      setSavingUser(true);
      if (editingUser) {
        const res = await api.put(`/auth/admin/users/${editingUser._id}`, {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          city: userForm.city,
          verificationStatus: userForm.verificationStatus,
        });
        if (res.data.success) {
          toast.success('User updated successfully');
          setIsUserModalOpen(false);
          fetchUsers();
          fetchAdminData();
        }
      } else {
        const res = await api.post('/auth/admin/users', userForm);
        if (res.data.success) {
          toast.success('User created successfully');
          setIsUserModalOpen(false);
          fetchUsers();
          fetchAdminData();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user');
    } finally {
      setSavingUser(false);
    }
  };

  const handleSoftDeleteUser = async (target) => {
    if (!window.confirm(`Soft-delete user "${target.name}" and unlist their active listings?`)) return;
    try {
      const res = await api.delete(`/auth/admin/users/${target._id}`);
      if (res.data.success) {
        toast.success('User soft deleted');
        fetchUsers();
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to soft delete user');
    }
  };

  const handleRestoreUser = async (target) => {
    try {
      const res = await api.put(`/auth/admin/users/${target._id}`, { restore: true });
      if (res.data.success) {
        toast.success('User account restored');
        fetchUsers();
        fetchAdminData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to restore user');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Seo noIndex title="Admin Access Required | RentNest" />
        <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Admin Operations Access Required</h2>
        <p className="text-xs text-slate-500">
          Please sign in with an <strong>Admin</strong> account to view analytics, manage users, and approve KYC.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Seo noIndex title="Admin Operations Desk | RentNest" />

      {/* Title & Quick Redirection Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Operations &amp; Trust Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            RentNest Admin Operations Desk
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/dashboard"
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
            <span>My Operations</span>
          </Link>
          <Link
            to="/explore"
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>All Listings</span>
          </Link>
          <Link
            to="/post-property"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Listing</span>
          </Link>
          <button
            onClick={() => {
              fetchAdminData();
              if (activeTab === 'users') fetchUsers();
            }}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Admin Sub-Menu Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => switchTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${activeTab === 'overview'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>KYC &amp; Overview</span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${activeTab === 'analytics'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Platform Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => switchTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all ${activeTab === 'users'
            ? 'bg-purple-600 text-white shadow-sm'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
        >
          <Users className="w-4 h-4" />
          <span>Users Management (CRUD)</span>
        </button>
      </div>

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Users</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{metrics.totalUsers}</div>
            <span className="text-[11px] text-slate-400">Tenants, Owners &amp; Brokers</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Listings</span>
              <Home className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{metrics.totalProperties}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">Live Gujarat inventory</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Pending KYC</span>
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-600">{metrics.pendingKyc}</div>
            <span className="text-[11px] text-slate-400">Bills awaiting review</span>
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

      {/* TAB 1: Overview & KYC Queue */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Owner Electricity Bill Verification Queue</span>
              </h2>
              <p className="text-xs text-slate-500">
                Verify proof of ownership before awarding the green &quot;Verified Owner&quot; trust badge.
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
      )}

      {/* TAB 2: Platform Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {loading || !analytics ? (
            <div className="h-48 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ) : (
            <>
              {/* Role & Inventory Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                  <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Users Breakdown by Role</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                      <span className="text-[10px] font-bold uppercase text-blue-700 block">Tenants</span>
                      <span className="text-xl font-black text-blue-900">{analytics.usersByRole.tenant}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 block">Owners</span>
                      <span className="text-xl font-black text-emerald-900">{analytics.usersByRole.owner}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                      <span className="text-[10px] font-bold uppercase text-amber-700 block">Brokers</span>
                      <span className="text-xl font-black text-amber-900">{analytics.usersByRole.broker}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                      <span className="text-[10px] font-bold uppercase text-purple-700 block">Admins</span>
                      <span className="text-xl font-black text-purple-900">{analytics.usersByRole.admin}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 col-span-2 sm:col-span-2">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Soft-Deleted Accounts</span>
                      <span className="text-xl font-black text-slate-800">{analytics.deletedUsersCount}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                  <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Inventory &amp; Visit Funnel</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Residential</span>
                      <span className="text-lg font-black text-slate-900">{analytics.propertiesByCategory.residential}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200">
                      <span className="text-[10px] font-bold uppercase text-indigo-700 block">Commercial</span>
                      <span className="text-lg font-black text-indigo-900">{analytics.propertiesByCategory.commercial}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                      <span className="text-[10px] font-bold uppercase text-rose-700 block">Quarantined</span>
                      <span className="text-lg font-black text-rose-900">{analytics.quarantinedCount}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Soft Deleted</span>
                      <span className="text-lg font-black text-slate-800">{analytics.softDeletedPropertiesCount}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-[11px]">
                    {Object.entries(analytics.visitsByStatus).map(([st, cnt]) => (
                      <span key={st} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold capitalize">
                        {st}: {cnt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* City & Top Localities Analytics */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>City &amp; Locality Rent Benchmarks</span>
                  </h2>
                  <span className="text-[11px] font-semibold text-slate-500">
                    GA4 Measurement ID: <span className="font-mono font-bold text-slate-700">G-LLWCM48NRV</span>
                  </span>
                </div>

                {analytics.propertiesByCity.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {analytics.propertiesByCity.map((c) => (
                      <div key={c._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <div className="text-xs font-extrabold text-slate-900">{c._id}</div>
                        <div className="text-sm font-black text-blue-600 mt-0.5">
                          ₹{Math.round(c.avgRent || 0).toLocaleString()}/mo avg
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {c.count} active • {c.verifiedCount} verified
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                        <th className="py-2.5 px-3">Locality</th>
                        <th className="py-2.5 px-3">City</th>
                        <th className="py-2.5 px-3">Active Listings</th>
                        <th className="py-2.5 px-3">Avg Rent</th>
                        <th className="py-2.5 px-3">Rent Range</th>
                        <th className="py-2.5 px-3">Verified</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {analytics.topLocalities.map((loc) => (
                        <tr key={`${loc.city}-${loc._id}`} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{loc._id}</td>
                          <td className="py-2.5 px-3 text-slate-600">{loc.city}</td>
                          <td className="py-2.5 px-3 font-bold text-blue-600">{loc.count}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800">₹{Math.round(loc.avgRent).toLocaleString()}</td>
                          <td className="py-2.5 px-3 text-slate-500">
                            ₹{loc.minRent.toLocaleString()} – ₹{loc.maxRent.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-emerald-700 font-bold">{loc.verifiedCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 3: Users Management (CRUD with Soft Delete & Restore) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Platform Users Directory (CRUD &amp; Soft Delete)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Create users, update roles or KYC verification badges, soft-delete accounts, or restore deactivated users.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateUserModal}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchUsers();
              }}
              className="flex-1 flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search name, phone, email, or city..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-purple-600"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
              >
                Search
              </button>
            </form>

            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50"
            >
              <option value="all">All Roles</option>
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
              <option value="broker">Broker</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={userStatusFilter}
              onChange={(e) => setUserStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50"
            >
              <option value="active">Active Users</option>
              <option value="deleted">Soft Deleted</option>
              <option value="all">All Statuses</option>
            </select>
          </div>

          {/* Users Table */}
          {usersLoading ? (
            <div className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ) : usersList.length === 0 ? (
            <div className="p-10 text-center text-xs font-bold text-slate-500">
              No matching users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                    <th className="py-3 px-3">User</th>
                    <th className="py-3 px-3">Phone &amp; Email</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">City</th>
                    <th className="py-3 px-3">Verification</th>
                    <th className="py-3 px-3">State</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {usersList.map((u) => (
                    <tr key={u._id} className={`hover:bg-slate-50 ${u.isDeleted ? 'opacity-60 bg-rose-50/30' : ''}`}>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u._id}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-800">{u.phone}</div>
                        {u.email && <div className="text-[11px] text-slate-500">{u.email}</div>}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-50 text-blue-800 border border-blue-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{u.city || 'Rajkot'}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${u.verificationStatus === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : u.verificationStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                            }`}
                        >
                          {u.verificationStatus || 'unverified'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {u.isDeleted ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Soft Deleted
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => openEditUserModal(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700"
                            title="Edit User"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          {u.isDeleted ? (
                            <button
                              type="button"
                              onClick={() => handleRestoreUser(u)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                              title="Restore Soft-Deleted User"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            u._id !== user._id && (
                              <button
                                type="button"
                                onClick={() => handleSoftDeleteUser(u)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                                title="Soft Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

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

      {/* Create / Edit User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">
                {editingUser ? 'Edit User Account' : 'Create New User'}
              </h3>
              <button onClick={() => setIsUserModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                />
              </div>

              {!editingUser && (
                <>
                  <div>
                    <label className="block text-slate-700 mb-1">10-Digit Mobile Phone</label>
                    <input
                      type="text"
                      required
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Password (6+ chars, letters + numbers)</label>
                    <input
                      type="password"
                      required
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-700 mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-purple-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1">Role</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="tenant">Tenant</option>
                    <option value="owner">Owner</option>
                    <option value="broker">Broker</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">City</label>
                  <select
                    value={userForm.city}
                    onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">KYC Verification Status</label>
                <select
                  value={userForm.verificationStatus}
                  onChange={(e) => setUserForm({ ...userForm, verificationStatus: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="unverified">Unverified</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  {savingUser ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
