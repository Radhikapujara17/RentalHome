import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically re-center map
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

const createPriceIcon = (rent, isSelected) => {
  const formattedRent = rent >= 1000 ? `₹${(rent / 1000).toFixed(1)}k` : `₹${rent}`;
  return L.divIcon({
    className: 'custom-price-pin',
    html: `
      <div style="
        background-color: ${isSelected ? '#2563eb' : '#0f172a'};
        color: #ffffff;
        font-weight: 800;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 9999px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        border: 2px solid #ffffff;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        transform: translate(-50%, -50%);
        cursor: pointer;
      ">
        ${formattedRent}
      </div>
    `,
    iconSize: [40, 24],
    iconAnchor: [20, 12],
  });
};

const SplitMap = ({ properties = [], selectedProperty, onMarkerClick }) => {
  // Default to Rajkot center
  const defaultCenter = [22.2900, 70.7800];
  const activeCenter = selectedProperty?.coordinates?.lat
    ? [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng]
    : defaultCenter;

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <ChangeView center={activeCenter} zoom={selectedProperty ? 15 : 12} />
        
        {/* OpenStreetMap Tile Layer - 100% Free with zero API keys required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((prop) => {
          if (!prop.coordinates?.lat || !prop.coordinates?.lng) return null;
          const isSelected = selectedProperty?._id === prop._id;

          return (
            <Marker
              key={prop._id}
              position={[prop.coordinates.lat, prop.coordinates.lng]}
              icon={createPriceIcon(prop.pricing?.monthlyRent || 0, isSelected)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(prop),
              }}
            >
              <Popup>
                <div className="w-56 p-0 overflow-hidden font-sans">
                  <img
                    src={prop.photos?.[0]?.url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                    alt={prop.title}
                    className="w-full h-28 object-cover"
                  />
                  <div className="p-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-extrabold text-blue-600">
                        ₹{prop.pricing.monthlyRent.toLocaleString()}<span className="text-[10px] text-slate-500 font-normal">/mo</span>
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {prop.bhk}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 truncate">{prop.societyName}</p>
                    <p className="text-[10px] text-slate-500 truncate mb-2">{prop.locality}</p>
                    <Link
                      to={`/property/${prop.slug || prop._id}`}
                      className="block text-center py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default SplitMap;
