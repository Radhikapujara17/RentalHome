import React, { useState, useRef } from 'react';
import api from '../api/client';
import toast from 'react-hot-toast';
import { UploadCloud, Image as ImageIcon, Loader2, X, Check } from 'lucide-react';

const ImageUploader = ({ onUploadSuccess, label = "Upload Property Photo" }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP)');
      return;
    }

    // Set local preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/tools/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        toast.success('Photo uploaded to Cloudinary CDN!');
        onUploadSuccess(res.data.url);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload photo');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-700">{label}</label>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
          preview ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="py-4 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-xs font-bold text-slate-600">Uploading to Cloudinary CDN...</span>
          </div>
        ) : preview ? (
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-3">
              <img src={preview} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-slate-200" />
              <div className="text-left">
                <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Uploaded Successfully</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Click to replace photo</span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onUploadSuccess('');
              }}
              className="p-1 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">
                Click or drag & drop to upload photo
              </p>
              <p className="text-[10px] text-slate-400">
                PNG, JPG or WEBP up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
