import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  Home, 
  User, 
  Building2, 
  Briefcase, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CITIES = ['Rajkot', 'Ahmedabad', 'Surat', 'Vadodara'];

// Phone validation helper (accepts 10-digit Indian standard)
const validatePhone = (rawPhone) => {
  if (!rawPhone) return { isValid: false, message: 'Phone number is required' };
  const cleaned = rawPhone.replace(/[\s\-\(\)\.]/g, '');
  const digits = cleaned.startsWith('+91')
    ? cleaned.slice(3)
    : (cleaned.startsWith('91') && cleaned.length === 12)
      ? cleaned.slice(2)
      : (cleaned.startsWith('0') && cleaned.length === 11)
        ? cleaned.slice(1)
        : cleaned;
  const isValid = /^[6-9]\d{9}$/.test(digits);
  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9'
  };
};

// Password strength & requirement checker
const getPasswordStrength = (pw) => {
  if (!pw) {
    return {
      score: 0,
      label: 'Required',
      color: 'bg-slate-200',
      hasLength: false,
      hasLetter: false,
      hasNumber: false,
      isValid: false
    };
  }
  const hasLength = pw.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9]/.test(pw);

  let score = 0;
  if (hasLength) score++;
  if (hasLetter && hasNumber) score++;
  if (pw.length >= 8 && hasSpecial) score++;

  let label = 'Weak';
  let color = 'bg-rose-500';
  if (score === 2) {
    label = 'Medium';
    color = 'bg-amber-500';
  } else if (score >= 3) {
    label = 'Strong';
    color = 'bg-emerald-500';
  }

  return {
    score,
    label,
    color,
    hasLength,
    hasLetter,
    hasNumber,
    isValid: hasLength && hasLetter && hasNumber
  };
};

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, login, demoLogin, isAuthenticated, loading } = useAuth();

  // If URL is /register default to register tab, else login tab
  const [activeTab, setActiveTab] = useState(
    location.pathname === '/register' ? 'register' : 'login'
  );

  // Login Form State
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: '',
  });

  // Registration Form State
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'tenant', // 'tenant' | 'owner' | 'broker'
    city: 'Rajkot',
    agencyName: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const phoneValidation = validatePhone(registerData.phone);
  const passwordStrength = getPasswordStrength(registerData.password);
  const isPasswordMatch = registerData.password && confirmPassword && registerData.password === confirmPassword;

  // If already authenticated, redirect to explore properties
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/explore', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.identifier.trim()) {
      toast.error('Please enter your phone number or email');
      return;
    }
    if (!loginData.password || loginData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    setSubmitting(true);
    const res = await login(loginData.identifier, loginData.password);
    setSubmitting(false);
    if (res.success) {
      navigate('/explore', { replace: true });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerData.name.trim() || registerData.name.trim().length < 2) {
      toast.error('Please provide your full name (minimum 2 characters)');
      return;
    }
    const phoneVal = validatePhone(registerData.phone);
    if (!phoneVal.isValid) {
      toast.error(phoneVal.message);
      return;
    }
    if (registerData.email && registerData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerData.email.trim())) {
        toast.error('Please provide a valid email address');
        return;
      }
    }
    if (registerData.role === 'broker' && (!registerData.agencyName || !registerData.agencyName.trim())) {
      toast.error('Please enter your registered real estate agency name');
      return;
    }
    const pwVal = getPasswordStrength(registerData.password);
    if (!pwVal.isValid) {
      toast.error('Password must be at least 6 characters long and contain both letters and numbers');
      return;
    }
    if (registerData.password !== confirmPassword) {
      toast.error('Passwords do not match. Please retype confirm password.');
      return;
    }

    setSubmitting(true);
    const res = await register(registerData);
    setSubmitting(false);
    if (res.success) {
      navigate('/explore', { replace: true });
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
        
        {/* Left Branding Banner (Modern NYC Aesthetic) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            <Link to="/" className="inline-flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Rent<span className="text-blue-400">Nest</span>
              </span>
            </Link>

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rajkot Rental Marketplace</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
                Zero Hidden Costs. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200">
                  100% Verified Homes.
                </span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Join over 2,500+ Rajkot tenants, verified landlords, and registered brokers moving seamlessly with digital agreements and transparent bills.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span><strong>Direct PGVCL Meter</strong> declarations prevent inflated utility charges</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span><strong>Role-Tailored Dashboards</strong> for Flatseekers, Landlords & Brokers</span>
              </div>
              <div className="flex items-start space-x-3 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span><strong>Digital KYC & Move-in Shield</strong> to safeguard deposits</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Persona Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Instant 1-Click Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => demoLogin('tenant')}
                className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-slate-200 transition-colors text-left"
              >
                👤 Tenant
              </button>
              <button
                type="button"
                onClick={() => demoLogin('owner')}
                className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-slate-200 transition-colors text-left"
              >
                🏠 Owner
              </button>
              <button
                type="button"
                onClick={() => demoLogin('broker')}
                className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-slate-200 transition-colors text-left"
              >
                💼 Broker
              </button>
              <button
                type="button"
                onClick={() => demoLogin('admin')}
                className="py-1.5 px-2.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-[11px] font-semibold text-purple-200 transition-colors text-left"
              >
                🛡️ Admin
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Tabs: Sign In / Create Account */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* -------------------- TAB 1: SIGN IN FORM -------------------- */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">Welcome Back</h3>
                <p className="text-xs text-slate-500">
                  Enter your credentials to manage listings, visits, or rental agreements.
                </p>
              </div>

              {/* Identifier (Phone or Email) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone Number or Email</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="+919876543201 or user@example.com"
                    value={loginData.identifier}
                    onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs font-medium outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  <span className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs font-medium outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Authenticating...' : 'Sign In to RentNest'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  New to RentNest?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Create an account here
                  </button>
                </span>
              </div>
            </form>
          ) : (
            /* -------------------- TAB 2: REGISTRATION FORM -------------------- */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">Create Your RentNest Account</h3>
                <p className="text-xs text-slate-500">
                  Select your primary role and fill in your details to get started.
                </p>
              </div>

              {/* Role Selection Cards */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Your Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'tenant', label: 'Tenant', icon: User, desc: 'Seeking Home' },
                    { id: 'owner', label: 'Owner', icon: Building2, desc: 'Landlord' },
                    { id: 'broker', label: 'Broker', icon: Briefcase, desc: 'Agent' },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = registerData.role === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRegisterData({ ...registerData, role: r.id })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        <div className="text-xs font-bold text-slate-800">{r.label}</div>
                        <div className="text-[10px] text-slate-400">{r.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Mehta or Jayeshbhai Patel"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs font-medium outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone & Email (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Phone Number</label>
                    {registerData.phone && (
                      <span className={`text-[10px] font-bold ${phoneValidation.isValid ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {phoneValidation.isValid ? '✓ Valid' : 'Invalid'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value.replace(/[^\d+ -]/g, '') })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                        registerData.phone && !phoneValidation.isValid
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                          : registerData.phone && phoneValidation.isValid
                          ? 'border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                  </div>
                  {registerData.phone && !phoneValidation.isValid && (
                    <p className="text-[10px] text-rose-500 font-semibold mt-0.5">
                      {phoneValidation.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs font-medium outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* City Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Operational City</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <select
                    value={registerData.city}
                    onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-xs font-medium outline-none transition-all bg-white"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* If Broker Selected: Agency Name */}
              {registerData.role === 'broker' && (
                <div className="space-y-1 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                  <label className="text-xs font-bold text-amber-900">Real Estate Agency Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajkot Prime Realty Pvt Ltd"
                    value={registerData.agencyName}
                    onChange={(e) => setRegisterData({ ...registerData, agencyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs font-medium outline-none"
                  />
                </div>
              )}

              {/* Password & Confirm Password (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    {registerData.password && (
                      <span className={`text-[10px] font-bold ${
                        passwordStrength.score >= 3 ? 'text-emerald-600' :
                        passwordStrength.score === 2 ? 'text-amber-600' : 'text-rose-500'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 chars (letters & numbers)"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                        registerData.password && !passwordStrength.isValid
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                          : registerData.password && passwordStrength.isValid
                          ? 'border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {registerData.password && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex gap-1 h-1.5 w-full">
                        <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-200'} transition-all duration-300`}></div>
                        <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-200'} transition-all duration-300`}></div>
                        <div className={`h-full flex-1 rounded-full ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-200'} transition-all duration-300`}></div>
                      </div>
                      <div className="flex flex-wrap gap-x-2 text-[10px] text-slate-500">
                        <span className={passwordStrength.hasLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                          {passwordStrength.hasLength ? '✓' : '•'} 6+ chars
                        </span>
                        <span className={passwordStrength.hasLetter ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                          {passwordStrength.hasLetter ? '✓' : '•'} Letters
                        </span>
                        <span className={passwordStrength.hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                          {passwordStrength.hasNumber ? '✓' : '•'} Numbers
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Confirm Password</label>
                    {confirmPassword && (
                      <span className={`text-[10px] font-bold ${
                        isPasswordMatch ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        {isPasswordMatch ? '✓ Passwords match' : 'Passwords do not match'}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                        confirmPassword && !isPasswordMatch
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                          : confirmPassword && isPasswordMatch
                          ? 'border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && !isPasswordMatch && (
                    <p className="text-[10px] text-rose-500 font-semibold mt-0.5">
                      Must match the password entered above
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Registration */}
              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{submitting ? 'Saving in MongoDB...' : 'Complete Registration & Save'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Sign in here
                  </button>
                </span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthPage;