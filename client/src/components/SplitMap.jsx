import React, { useState, useEffect } from 'react';
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

// Component to dynamically manage scroll wheel zoom based on cursor hover
function MapScrollController({ isCursorOverMap }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (isCursorOverMap) {
      map.scrollWheelZoom.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
  }, [isCursorOverMap, map]);

  return null;
}

// Component to re-center map only when explicitly requested
function ChangeView({ center, zoom, shouldPan }) {
  const map = useMap();
  useEffect(() => {
    if (shouldPan && center && center[0] && center[1]) {
      map.setView(center, zoom || 14, { animate: true });
    }
  }, [center, zoom, shouldPan, map]);
  return null;
}

const CITY_COORDINATES = {
  Rajkot: [22.2900, 70.7800],
  Ahmedabad: [23.0225, 72.5714],
  Surat: [21.1702, 72.7850],
  Vadodara: [22.3072, 73.1812],
  All: [22.5, 71.8]
};

function ChangeCityView({ city }) {
  const map = useMap();
  useEffect(() => {
    if (city && CITY_COORDINATES[city]) {
      const zoom = city === 'All' ? 8 : 12;
      map.setView(CITY_COORDINATES[city], zoom, { animate: true });
    }
  }, [city, map]);
  return null;
}

const createPriceIcon = (rent, isSelected, isHovered) => {
  const formattedRent = rent >= 1000 ? `₹${(rent / 1000).toFixed(1)}k` : `₹${rent}`;
  const isHighlighted = isSelected || isHovered;
  return L.divIcon({
    className: 'custom-price-pin',
    html: `
      <div style="
        background-color: ${isHighlighted ? '#2563eb' : '#0f172a'};
        color: #ffffff;
        font-weight: 800;
        font-size: ${isHighlighted ? '12px' : '11px'};
        padding: 4px 8px;
        border-radius: 9999px;
        box-shadow: ${isHighlighted ? '0 0 0 3px rgba(37, 99, 235, 0.4), 0 4px 14px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.25)'};
        border: 2px solid #ffffff;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        transform: translate(-50%, -50%) ${isHighlighted ? 'scale(1.15)' : 'scale(1)'};
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        z-index: ${isHighlighted ? 999 : 1};
      ">
        ${formattedRent}
      </div>
    `,
    iconSize: [42, 26],
    iconAnchor: [21, 13],
  });
};

const SplitMap = ({ properties = [], selectedProperty, hoveredPropertyId, onMarkerClick, city = 'Rajkot' }) => {
  const [isCursorOverMap, setIsCursorOverMap] = useState(false);

  // Default coordinates based on active city
  const defaultCenter = (city && CITY_COORDINATES[city]) || [22.2900, 70.7800];
  const activeCenter = selectedProperty?.coordinates?.lat
    ? [selectedProperty.coordinates.lat, selectedProperty.coordinates.lng]
    : defaultCenter;

  return (
    <div 
      onMouseEnter={() => setIsCursorOverMap(true)}
      onMouseLeave={() => setIsCursorOverMap(false)}
      className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner group"
    >
      {/* Visual Cursor Indicator Badge */}
      <div className={`absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 pointer-events-none flex items-center space-x-1.5 ${
        isCursorOverMap 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-100' 
          : 'bg-white/90 backdrop-blur-sm text-slate-600 border border-slate-200 shadow-sm opacity-80'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isCursorOverMap ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
        <span>{isCursorOverMap ? 'Scroll to zoom inside map' : 'Hover cursor on map to zoom'}</span>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={city === 'All' ? 8 : 12}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <MapScrollController isCursorOverMap={isCursorOverMap} />
        <ChangeCityView city={city} />
        <ChangeView center={activeCenter} zoom={selectedProperty ? 14 : (city === 'All' ? 8 : 12)} shouldPan={!!selectedProperty} />
        
        {/* OpenStreetMap Tile Layer - 100% Free with zero API keys required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((prop) => {
          if (!prop.coordinates?.lat || !prop.coordinates?.lng) return null;
          const isSelected = selectedProperty?._id === prop._id;
          const isHovered = hoveredPropertyId === prop._id;

          return (
            <Marker
              key={prop._id}
              position={[prop.coordinates.lat, prop.coordinates.lng]}
              icon={createPriceIcon(prop.pricing?.monthlyRent || 0, isSelected, isHovered)}
              zIndexOffset={isHovered || isSelected ? 1000 : 0}
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
                        {prop.category === 'commercial' ? `⚡ ${prop.commercialDetails?.connectedPowerLoadHp || 10} HP` : prop.bhk}
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
