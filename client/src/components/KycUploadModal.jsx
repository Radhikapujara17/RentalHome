import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import toast from 'react-hot-toast';
import ImageUploader from './ImageUploader';
import { ShieldCheck, X, FileText, CheckCircle2 } from 'lucide-react';

const KycUploadModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [docType, setDocType] = useState('electricity_bill');
  const [documentUrl, setDocumentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!documentUrl) {
      toast.error('Please upload an electricity bill or tax document first');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/auth/kyc/submit', {
        kycDocumentUrl: documentUrl,
        kycDocumentType: docType
      });

      if (res.data.success) {
        toast.success('Document submitted! RentNest team will verify within 24 hours.');
        setSubmitted(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit document');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <h3 className="text-base font-extrabold">Get "Verified Owner" Badge</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-extrabold text-slate-800">Verification Request Submitted</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Our operations team verifies your bill with PGVCL records to give your listings a 3x higher trust ranking.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct landlords can earn the green <strong>Verified Owner</strong> badge by uploading a recent PGVCL electricity bill or municipal tax receipt.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Document Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDocType('electricity_bill')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      docType === 'electricity_bill'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    PGVCL Electricity Bill
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocType('property_tax')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      docType === 'property_tax'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    RMC Property Tax Slip
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <ImageUploader
                label="Upload Bill Photo or PDF Scan"
                onUploadSuccess={(url) => setDocumentUrl(url)}
              />

              <button
                type="submit"
                disabled={submitting || !documentUrl}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default KycUploadModal;
