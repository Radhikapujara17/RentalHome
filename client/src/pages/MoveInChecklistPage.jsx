import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckSquare, ShieldCheck, Camera, Save, Printer, CheckCircle } from 'lucide-react';

const INITIAL_ROOMS = [
  {
    roomName: 'Living Room',
    items: [
      { name: 'Wall Paint & Plaster', status: 'Good', remarks: 'Freshly painted, no marks' },
      { name: 'Flooring / Vitrified Tiles', status: 'Excellent', remarks: 'No cracks or stains' },
      { name: 'Electrical Switches & Fans', status: 'Good', remarks: 'All ceiling fans working' }
    ]
  },
  {
    roomName: 'Kitchen & Utility',
    items: [
      { name: 'Granite Countertop & Sink', status: 'Good', remarks: 'Clean, no water leakage' },
      { name: 'Gas Pipeline / PNG valve', status: 'Excellent', remarks: 'Gujarat Gas meter working' },
      { name: 'Modular Cabinets & Trolleys', status: 'Good', remarks: 'Smooth sliding drawers' }
    ]
  },
  {
    roomName: 'Master Bedroom',
    items: [
      { name: 'Wooden Wardrobe & Keys', status: 'Good', remarks: '2 keys handed over' },
      { name: 'Window Mesh & Curtains', status: 'Good', remarks: 'Intact' },
      { name: 'Air Conditioner Cooling', status: 'Excellent', remarks: 'AC remote tested' }
    ]
  },
  {
    roomName: 'Bathrooms',
    items: [
      { name: 'Water Geyser & Taps', status: 'Good', remarks: 'Instant hot water working' },
      { name: 'Sanitary Ware & Flush', status: 'Excellent', remarks: 'Proper water pressure' }
    ]
  }
];

const MoveInChecklistPage = () => {
  const [propertyTitle, setPropertyTitle] = useState('Flat 402, Radhika Heights, Kalawad Road, Rajkot');
  const [tenantName, setTenantName] = useState('Priya Mehta');
  const [ownerName, setOwnerName] = useState('Jayeshbhai Patel');
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [saved, setSaved] = useState(false);

  const handleStatusChange = (roomIdx, itemIdx, newStatus) => {
    const updated = [...rooms];
    updated[roomIdx].items[itemIdx].status = newStatus;
    setRooms(updated);
  };

  const handleRemarksChange = (roomIdx, itemIdx, remarks) => {
    const updated = [...rooms];
    updated[roomIdx].items[itemIdx].remarks = remarks;
    setRooms(updated);
  };

  const handleSave = () => {
    setSaved(true);
    toast.success('Move-in Condition Checklist digitally verified & saved!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Security Deposit Shield</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Digital Move-in Condition Inspection
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-lg mx-auto">
          Record room-by-room condition on day 1 with tenant and landlord mutual sign-off to prevent unfair deposit deductions at move-out.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Basic Property Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-6 border-b border-slate-100 text-xs font-semibold">
          <div>
            <label className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Rented Premises</label>
            <input
              type="text"
              value={propertyTitle}
              onChange={(e) => setPropertyTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Tenant Name</label>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
            />
          </div>
          <div>
            <label className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Landlord Name</label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
            />
          </div>
        </div>

        {/* Room By Room List */}
        <div className="space-y-6">
          {rooms.map((room, roomIdx) => (
            <div key={roomIdx} className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>{room.roomName}</span>
              </h3>

              <div className="space-y-2">
                {room.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="font-bold text-slate-800 min-w-[200px]">
                      {item.name}
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      {['Excellent', 'Good', 'Scratched/Stained', 'Damaged'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStatusChange(roomIdx, itemIdx, status)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            item.status === status
                              ? status === 'Damaged'
                                ? 'bg-rose-600 text-white'
                                : status === 'Scratched/Stained'
                                ? 'bg-amber-600 text-white'
                                : 'bg-emerald-600 text-white'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Remarks / noted blemishes..."
                      value={item.remarks}
                      onChange={(e) => handleRemarksChange(roomIdx, itemIdx, e.target.value)}
                      className="w-full sm:w-60 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Signature & Actions */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Inspection Date: {new Date().toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Checklist</span>
            </button>

            <button
              onClick={handleSave}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saved ? 'Inspection Saved' : 'Lock & Save Sign-off'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MoveInChecklistPage;
