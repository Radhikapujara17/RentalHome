import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import toast from 'react-hot-toast';
import { X, Phone, KeyRound, Shield, UserCheck, Home, Briefcase, Lock } from 'lucide-react';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, demoLogin, verifyOtp, loading } = useAuth();
  const [phone, setPhone] = useState('+919876543201');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [otpSentHint, setOtpSentHint] = useState('');
  const [role, setRole] = useState('tenant');
  const [name, setName] = useState('Priya Mehta');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      const res = await api.post('/auth/send-otp', { phone });
      if (res.data.success) {
        toast.success(res.data.message);
        if (res.data.devOtp) {
          setOtpSentHint(res.data.devOtp);
          setOtp(res.data.devOtp); // Auto-fill for developer convenience
        }
        setStep('otp');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(phone, otp, role, name);
    } catch (err) {
      // Handled in context
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold">Welcome to RentNest</h3>
            <p className="text-xs text-blue-100">Zero-brokerage rental discovery in Rajkot</p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Quick Demo 1-Click Login Section */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Instant 1-Click Demo Login</span>
              </span>
              <span className="text-[10px] bg-blue-200/80 text-blue-900 font-bold px-2 py-0.5 rounded-full">
                Try Any Role
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => demoLogin('tenant')}
                disabled={loading}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 font-bold text-slate-800 transition-all text-left shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="leading-tight">Tenant</div>
                  <div className="text-[10px] text-slate-400 font-medium">Home Seeker</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => demoLogin('owner')}
                disabled={loading}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 font-bold text-slate-800 transition-all text-left shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <div className="leading-tight">Direct Owner</div>
                  <div className="text-[10px] text-slate-400 font-medium">Verified Landlord</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => demoLogin('broker')}
                disabled={loading}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 font-bold text-slate-800 transition-all text-left shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="leading-tight">Broker / Agent</div>
                  <div className="text-[10px] text-slate-400 font-medium">Transparent Terms</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => demoLogin('admin')}
                disabled={loading}
                className="flex items-center space-x-2 p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 font-bold text-slate-800 transition-all text-left shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="leading-tight">Admin</div>
                  <div className="text-[10px] text-slate-400 font-medium">Operations Desk</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">Or Login with Phone OTP</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Standard Phone OTP Form */}
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {['tenant', 'owner', 'broker'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all ${role === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Send 6-Digit OTP</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Enter Verification Code</label>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm tracking-widest text-center font-bold focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                {otpSentHint && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center space-x-1">
                    <span>💡 Dev OTP auto-filled: <strong>{otpSentHint}</strong></span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>Verify & Continue</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
