import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { useWishlist } from '../context/WishlistContext';
import { 
  Home, 
  PlusCircle, 
  Scale, 
  User, 
  LogOut, 
  FileText, 
  CheckSquare, 
  Calculator,
  Users,
  MessageSquare,
  Shield,
  Search,
  Briefcase,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  Building2,
  Heart,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, setIsAuthModalOpen, setIsChatOpen } = useAuth();
  const { shortlist, setIsCompareModalOpen } = useCompare();
  const { savedCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('rentnest_selected_city') || 'Rajkot';
  });

  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    localStorage.setItem('rentnest_selected_city', newCity);
    if (location.pathname === '/explore') {
      const search = new URLSearchParams(location.search);
      if (newCity === 'All') {
        search.delete('city');
      } else {
        search.set('city', newCity);
      }
      navigate(`/explore?${search.toString()}`);
    } else {
      navigate(newCity === 'All' ? '/explore' : `/explore?city=${newCity}`);
    }
  };

  // Role-specific navigation menus (Only shown when logged in)
  const getNavItems = () => {
    if (!isAuthenticated || !user) return [];

    switch (user.role) {
      case 'owner':
        return [
          { label: 'My Listings & Visits', to: '/dashboard', icon: LayoutDashboard },
          { label: 'Market Explore', to: '/explore', icon: Search },
          // Rental Agreement hidden from menu per configuration; route /tools/rental-agreement remains functional
          // { label: 'Rental Agreement', to: '/tools/rental-agreement', icon: FileText },
          { label: 'Move-in Checklist', to: '/tools/move-in-checklist', icon: CheckSquare },
        ];
      case 'broker':
        return [
          { label: 'Broker Dashboard', to: '/dashboard', icon: Briefcase },
          { label: 'Explore Inventory', to: '/explore', icon: Search },
          // { label: 'Rental Agreement', to: '/tools/rental-agreement', icon: FileText },
        ];
      case 'admin':
        return [
          { label: 'Admin Desk', to: '/admin', icon: Shield, badge: 'Review Desk' },
          { label: 'Operations', to: '/dashboard', icon: LayoutDashboard },
          { label: 'All Listings', to: '/explore', icon: Search },
          // { label: 'Agreements', to: '/tools/rental-agreement', icon: FileText },
        ];
      case 'tenant':
      default:
        return [
          { label: 'Explore Homes', to: '/explore', icon: Search },
          { label: 'Commercial Spaces', to: '/explore?category=commercial', icon: Building2 },
          { label: 'Flatmates', to: '/roommates', icon: Users },
          { label: 'HRA Calculator', to: '/tools/hra-calculator', icon: Calculator },
          // { label: 'Agreement', to: '/tools/rental-agreement', icon: FileText },
          { label: 'Deposit Shield', to: '/tools/move-in-checklist', icon: CheckSquare },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'owner':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'broker':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & City Badge */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Home className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900">
                    Rent<span className="text-blue-600">Nest</span>
                  </span>
                  <div className="relative inline-flex items-center">
                    <select
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold pl-2 pr-5 py-0.5 rounded-full border border-emerald-300 focus:outline-none cursor-pointer appearance-none shadow-xs transition-colors"
                      title="Switch City"
                    >
                      <option value="Rajkot">📍 Rajkot</option>
                      <option value="Ahmedabad">📍 Ahmedabad</option>
                      <option value="Surat">📍 Surat</option>
                      <option value="Vadodara">📍 Vadodara</option>
                      <option value="All">🌐 All Cities</option>
                    </select>
                    <ChevronDown className="w-2.5 h-2.5 text-emerald-700 absolute right-1.5 pointer-events-none" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  Zero Hidden Costs
                </span>
              </div>
            </Link>

            {/* Central Navigation Links: ONLY SHOWN WHEN LOGGED IN & FILTERED BY ROLE */}
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center space-x-1 ml-6 text-sm font-semibold text-slate-600">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                        isActive
                          ? 'text-blue-600 bg-blue-50 font-bold shadow-xs'
                          : 'hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-extrabold uppercase">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* If NOT logged in: Absolutely NO menu, NO chat, NO post buttons. ONLY clean Login / Sign Up button */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Login / Sign Up</span>
              </Link>
            ) : (
              /* When Logged In: Role-Tailored Action CTAs & Profile */
              <>
                {/* Wishlist Quick Access */}
                <Link
                  to="/dashboard"
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-colors relative"
                  title="View Saved Wishlist"
                  aria-label="View Saved Wishlist"
                >
                  <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                  {savedCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-black absolute -top-1 -right-1 ring-2 ring-white">
                      {savedCount}
                    </span>
                  )}
                </Link>

                {/* Live Chat Trigger Button */}
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors relative"
                  title="Open In-App Chat"
                  aria-label="Open In-App Chat"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2 ring-2 ring-white"></span>
                </button>

                {/* Compare Bar Trigger (For Tenants/Seekers) */}
                {shortlist.length > 0 && user?.role === 'tenant' && (
                  <button
                    onClick={() => setIsCompareModalOpen(true)}
                    className="relative flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition-all shadow-sm"
                    title="Compare properties"
                  >
                    <Scale className="w-4 h-4 text-indigo-600" />
                    <span className="hidden md:inline">Compare</span>
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                      {shortlist.length}
                    </span>
                  </button>
                )}

                {/* Post Property CTA: Shown on sm+ screens */}
                {(user?.role === 'owner' || user?.role === 'broker' || user?.role === 'admin') && (
                  <Link
                    to="/post-property"
                    className="hidden sm:flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow-sm transition-transform active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4 text-blue-400" />
                    <span>{user?.role === 'broker' ? 'Post Listing' : 'Post Property'}</span>
                  </Link>
                )}

                {/* User Menu & Avatar */}
                <div className="flex items-center space-x-1 sm:space-x-2 pl-1 sm:pl-2 border-l border-slate-200">
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center space-x-2 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                    title="User Dashboard"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                    />
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{user?.name}</span>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-sm border inline-block w-fit ${getRoleBadgeColor(user?.role)}`}>
                        {user?.role}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    title="Logout"
                    className="hidden sm:flex p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Hamburger Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu: ONLY SHOWN WHEN LOGGED IN */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">{user?.name}</span>
              <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${getRoleBadgeColor(user?.role)}`}>
                {user?.role}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">{user?.phone}</span>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-extrabold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {(user?.role === 'owner' || user?.role === 'broker' || user?.role === 'admin') && (
            <div className="pt-2">
              <Link
                to="/post-property"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{user?.role === 'broker' ? 'Post Listing' : 'Post Property'}</span>
              </Link>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center space-x-2 text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold text-xs py-2 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;