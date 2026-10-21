import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShieldCheck, Heart, MapPin, Zap, Droplets, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">Rent<span className="text-blue-400">Nest</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rajkot’s transparent rental housing marketplace. Eliminating ghost broker ads, hidden sub-meter surcharges, and deposit disputes with verified direct owner listings.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Verified Electricity & Water Reality</span>
            </div>
          </div>

          {/* Top Rajkot Localities */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Popular Localities</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/explore?locality=Kalawad+Road" className="hover:text-white transition-colors">Flats in Kalawad Road (Crystal Mall)</Link></li>
              <li><Link to="/explore?locality=150+Ft+Ring+Road" className="hover:text-white transition-colors">Flats on 150 Ft Ring Road</Link></li>
              <li><Link to="/explore?locality=University+Road" className="hover:text-white transition-colors">Homes near Saurashtra University</Link></li>
              <li><Link to="/explore?locality=Nana+Mava" className="hover:text-white transition-colors">Apartments in Nana Mava & Speedwell</Link></li>
              <li><Link to="/explore?locality=Raiya+Road" className="hover:text-white transition-colors">Flats near Aalap Green City, Raiya Road</Link></li>
              <li><Link to="/explore?locality=Sadhu+Vaswani+Road" className="hover:text-white transition-colors">Bungalows on Sadhu Vaswani Road</Link></li>
            </ul>
          </div>

          {/* Tenant Legal & Cost Tools */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free Tenant Tools</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/tools/hra-calculator" className="hover:text-white transition-colors">HRA Rent Receipt Generator (Sec 10/13A)</Link></li>
              <li><Link to="/tools/rental-agreement" className="hover:text-white transition-colors">Gujarat 11-Month Rental Agreement</Link></li>
              <li><Link to="/tools/move-in-checklist" className="hover:text-white transition-colors">Move-in Photo Inspection (Deposit Shield)</Link></li>
              <li><Link to="/explore?zeroBrokerage=true" className="hover:text-white transition-colors">Direct Owner (Zero Brokerage) Flats</Link></li>
              <li><Link to="/explore?meterType=direct_govt_pgvcl" className="hover:text-white transition-colors">Independent PGVCL Meter Homes</Link></li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">The RentNest Promise</h4>
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                <span>Zero Electricity Markup</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Landlords must declare exact PGVCL meter status or fixed sub-meter unit rates upfront before listing.
              </p>
              <div className="flex items-center space-x-2 text-cyan-400 font-semibold pt-1">
                <Droplets className="w-3.5 h-3.5" />
                <span>Water Supply Reality</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Clear timings: 24/7 continuous or municipal scheduled supply. No move-in surprises.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <p>© 2026 RentNest Technologies. Crafted for Gujarat's fastest-growing urban rental markets.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>in Rajkot</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
