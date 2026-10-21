import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, Home, Phone, MapPin, CheckCircle } from 'lucide-react';

const ToLetPosterModal = ({ property, isOpen, onClose }) => {
  const printRef = useRef();

  if (!isOpen || !property) return null;

  const currentUrl = `${window.location.origin}/property/${property.slug || property._id}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Controls Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-base font-extrabold">Printable "TO LET" Gate Poster</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              A4 Format
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Poster</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Poster Canvas */}
        <div ref={printRef} className="p-8 sm:p-12 text-center bg-white space-y-6">
          
          {/* Top Header Badge */}
          <div className="inline-block bg-rose-600 text-white font-black text-2xl sm:text-3xl px-8 py-3 rounded-2xl tracking-widest uppercase shadow-lg transform -rotate-1">
            TO LET / ભાડે આપવાનું છે
          </div>

          {/* Subheading */}
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {property.bhk} Luxury Rental Flat
            </h2>
            <p className="text-lg font-bold text-blue-700 flex items-center justify-center space-x-1.5">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>{property.societyName}, {property.locality}, Rajkot</span>
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-sm font-bold">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs block">Monthly Rent</span>
              <span className="text-xl font-black text-slate-900">₹{property.pricing.monthlyRent.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs block">Security Deposit</span>
              <span className="text-xl font-black text-slate-900">₹{property.pricing.securityDeposit.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs block">Living Preference</span>
              <span className="text-slate-800">{property.rules.foodPreference}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs block">Electricity Meter</span>
              <span className="text-slate-800">
                {property.utilities.electricityMeterType === 'direct_govt_pgvcl' ? 'Govt PGVCL Meter' : 'Sub-meter'}
              </span>
            </div>
          </div>

          {/* Dynamic QR Code Card */}
          <div className="bg-gradient-to-b from-blue-50 to-indigo-50/50 p-6 rounded-3xl border-2 border-dashed border-blue-300 max-w-sm mx-auto space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                <QRCodeSVG
                  value={currentUrl}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900">
                📱 Scan with Phone Camera to View Photos
              </p>
              <p className="text-xs text-slate-500">
                Instant virtual tour, layout plan & verified details
              </p>
            </div>
          </div>

          {/* Contact Box */}
          <div className="pt-2 border-t border-slate-200">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
              Direct Contact / Owner Inquiries
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center space-x-2">
              <Phone className="w-6 h-6 text-emerald-600" />
              <span>{property.owner?.phone || '+91 98765 43202'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Listing ID: <strong>{property.listingNumber}</strong> • Powered by RentNest.in
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ToLetPosterModal;
