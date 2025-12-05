import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Navigation, MapPin, Clock, Phone, AlertCircle, ZoomIn, ZoomOut, Maximize2, AlertTriangle, Radio, Zap } from 'lucide-react';
import type { Order } from '../App';

interface LiveDeliveryMapLeafletProps {
  order: Order;
  onBack: () => void;
  isDarkMode: boolean;
}

export function LiveDeliveryMapLeaflet({ order, onBack, isDarkMode }: LiveDeliveryMapLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const riderMarkerRef = useRef<any>(null);
  const routeLineRef = useRef<any>(null);
  
  const [remainingTime, setRemainingTime] = useState(15);
  const [remainingDistance, setRemainingDistance] = useState(3.2);
  const [currentStreet, setCurrentStreet] = useState('EDSA Avenue');
  const [riderPosition, setRiderPosition] = useState({ lat: 14.5547, lng: 121.0244 });
  const [showTraffic, setShowTraffic] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(0);

  const isPickedUp = ['picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status);

  // Coordinates for Metro Manila
  const pickupCoords = { lat: 14.5547, lng: 121.0244 }; // Makati
  const deliveryCoords = { lat: 14.6091, lng: 121.0223 }; // Mandaluyong
  const targetCoords = isPickedUp ? deliveryCoords : pickupCoords;

  const routes = [
    { 
      name: 'Via EDSA', 
      duration: '18 mins', 
      traffic: 'moderate', 
      color: '#f59e0b',
      waypoints: [
        [14.5547, 121.0244],
        [14.5650, 121.0250],
        [14.5750, 121.0245],
        [14.5850, 121.0240],
        [14.5950, 121.0235],
        [14.6091, 121.0223]
      ] as [number, number][]
    },
    { 
      name: 'Via C-5', 
      duration: '22 mins', 
      traffic: 'light', 
      color: '#10b981',
      waypoints: [
        [14.5547, 121.0244],
        [14.5620, 121.0320],
        [14.5720, 121.0360],
        [14.5850, 121.0340],
        [14.6000, 121.0290],
        [14.6091, 121.0223]
      ] as [number, number][]
    }
  ];

  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      if (!mapRef.current || leafletMapRef.current) return;

      // Initialize map
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([riderPosition.lat, riderPosition.lng], 14);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      leafletMapRef.current = map;

      // Pickup marker
      const pickupIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="absolute inset-0 ${!isPickedUp ? 'animate-ping' : ''}" style="width: 56px; height: 56px; background: rgba(16, 185, 129, 0.4); border-radius: 50%; top: -8px; left: -8px;"></div>
            <div style="background: linear-gradient(135deg, #10b981, #059669); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid white; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4); position: relative; z-index: 10;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
            </div>
          </div>
        `,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon })
        .addTo(map)
        .bindPopup('<b style="color: #10b981;">Pickup Location</b>');

      // Delivery marker
      const deliveryIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="absolute inset-0 ${isPickedUp ? 'animate-ping' : ''}" style="width: 56px; height: 56px; background: rgba(239, 68, 68, 0.4); border-radius: 50%; top: -8px; left: -8px;"></div>
            <div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid white; box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4); position: relative; z-index: 10;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      L.marker([deliveryCoords.lat, deliveryCoords.lng], { icon: deliveryIcon })
        .addTo(map)
        .bindPopup('<b style="color: #ef4444;">Delivery Location</b>');

      // Rider marker with pulsing effect
      const riderIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="absolute inset-0" style="width: 70px; height: 70px; background: rgba(0, 61, 122, 0.2); border-radius: 50%; top: -15px; left: -15px; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div class="absolute inset-0" style="width: 60px; height: 60px; background: rgba(0, 61, 122, 0.3); border-radius: 50%; top: -10px; left: -10px; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; animation-delay: 0.5s;"></div>
            <div style="background: linear-gradient(135deg, #003D7A, #0A1E3E); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid white; box-shadow: 0 8px 20px rgba(0, 61, 122, 0.5); position: relative; z-index: 10;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
                <polygon points="3,11 12,2 21,11 12,8"/>
              </svg>
            </div>
          </div>
        `,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const riderMarker = L.marker([riderPosition.lat, riderPosition.lng], { 
        icon: riderIcon,
        zIndexOffset: 1000
      }).addTo(map);

      riderMarkerRef.current = riderMarker;

      // Draw active route
      const selectedRouteData = routes[selectedRoute];
      const routeLine = L.polyline(
        selectedRouteData.waypoints,
        {
          color: selectedRouteData.color,
          weight: 6,
          opacity: 0.8,
          dashArray: '15, 10',
          lineJoin: 'round',
          lineCap: 'round'
        }
      ).addTo(map);

      routeLineRef.current = routeLine;

      // Fit bounds
      const bounds = L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [deliveryCoords.lat, deliveryCoords.lng]
      ]);
      map.fitBounds(bounds, { padding: [80, 80] });

      setIsMapLoaded(true);

      // Add custom CSS for animations
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);

      // Cleanup
      return () => {
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
        document.head.removeChild(style);
      };
    });
  }, []);

  // Update route when selection changes
  useEffect(() => {
    if (routeLineRef.current && leafletMapRef.current) {
      const selectedRouteData = routes[selectedRoute];
      routeLineRef.current.setLatLngs(selectedRouteData.waypoints);
      routeLineRef.current.setStyle({
        color: selectedRouteData.color,
        weight: 6,
        opacity: 0.8
      });
    }
  }, [selectedRoute]);

  // Simulate rider movement
  useEffect(() => {
    const interval = setInterval(() => {
      setRiderPosition(prev => {
        const dx = targetCoords.lat - prev.lat;
        const dy = targetCoords.lng - prev.lng;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 0.0001) return prev;
        
        const newPos = {
          lat: prev.lat + (dx / distance) * 0.0005,
          lng: prev.lng + (dy / distance) * 0.0005
        };

        // Update marker position
        if (riderMarkerRef.current && leafletMapRef.current) {
          riderMarkerRef.current.setLatLng([newPos.lat, newPos.lng]);
          
          // Update route line
          if (routeLineRef.current) {
            routeLineRef.current.setLatLngs([
              [newPos.lat, newPos.lng],
              [targetCoords.lat, targetCoords.lng]
            ]);
          }

          // Keep rider in view
          leafletMapRef.current.setView([newPos.lat, newPos.lng], leafletMapRef.current.getZoom());
        }

        return newPos;
      });

      setRemainingTime(prev => Math.max(0, prev - 0.1));
      setRemainingDistance(prev => Math.max(0, prev - 0.02));
    }, 100);

    return () => clearInterval(interval);
  }, [targetCoords]);

  // Update current street
  useEffect(() => {
    const streets = ['EDSA Avenue', 'Ayala Avenue', 'Makati Avenue', 'Gil Puyat Avenue', 'Chino Roces Avenue'];
    const index = Math.floor((riderPosition.lat - pickupCoords.lat) / 0.01) % streets.length;
    setCurrentStreet(streets[Math.abs(index)]);
  }, [riderPosition]);

  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([riderPosition.lat, riderPosition.lng], 15);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="text-white sticky top-0 z-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A1E3E, #003D7A, #0A1E3E)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)' 
          }}></div>
        </div>
        <div className="relative z-10 p-4">
          <div className="flex items-center gap-4 mb-2">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Radio size={20} className="animate-pulse" />
                <h1 className="text-xl">Live Navigation</h1>
              </div>
              <p className="text-blue-100 text-sm">{order.id}</p>
            </div>
            <button className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95">
              <Phone size={24} />
            </button>
          </div>
          
          {/* Live status bar */}
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Live Tracking Active</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{Math.ceil(remainingTime)} min</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{remainingDistance.toFixed(1)} km</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[55vh]">
        {/* Loading State */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-gray-600">Loading navigation...</p>
            </div>
          </div>
        )}

        <div 
          ref={mapRef}
          className="w-full h-full"
          style={{ background: '#f0f0f0' }}
        />

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <button 
            onClick={handleZoomIn}
            className="bg-white p-3 rounded-xl shadow-lg hover:bg-gray-50 transition-all active:scale-95"
          >
            <ZoomIn size={20} className="text-gray-700" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="bg-white p-3 rounded-xl shadow-lg hover:bg-gray-50 transition-all active:scale-95"
          >
            <ZoomOut size={20} className="text-gray-700" />
          </button>
          <button 
            onClick={handleRecenter}
            className="bg-white p-3 rounded-xl shadow-lg hover:bg-gray-50 transition-all active:scale-95"
          >
            <Maximize2 size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Current Street Overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="bg-white rounded-2xl shadow-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 rounded-xl">
                <Navigation size={24} className="text-white transform rotate-45" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-xs mb-1">Currently on</p>
                <p className="text-gray-900 font-semibold text-lg">{currentStreet}</p>
              </div>
              <button 
                onClick={() => setShowTraffic(!showTraffic)}
                className={`p-2 rounded-xl transition-all ${
                  showTraffic ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <AlertTriangle size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Info Panel */}
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Alternative Routes */}
        {routes.length > 1 && (
          <div className="mb-4">
            <p className={`text-sm mb-2 font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Alternative routes
            </p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {routes.map((route, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedRoute(index)}
                  className={`flex-shrink-0 rounded-xl p-3 border-2 transition-all min-w-[140px] ${
                    selectedRoute === index
                      ? 'bg-white shadow-lg'
                      : isDarkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                  }`}
                  style={{
                    borderColor: selectedRoute === index ? route.color : undefined
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: route.color }}
                    ></div>
                    <p 
                      className="text-sm font-semibold"
                      style={{ 
                        color: selectedRoute === index ? route.color : isDarkMode ? '#d1d5db' : '#374151' 
                      }}
                    >
                      {route.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time:</span>
                      <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {route.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Traffic:</span>
                      <span className="text-xs capitalize" style={{ color: route.color }}>
                        {route.traffic}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Next Direction Card */}
        <div className="rounded-2xl p-5 mb-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #003D7A, #0A1E3E)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Navigation size={36} className="text-white transform rotate-45" />
              </div>
              <div className="flex-1">
                <p className="text-blue-200 text-sm mb-1">Next Direction</p>
                <p className="text-white text-lg mb-2">
                  {isPickedUp 
                    ? 'Continue straight on EDSA Avenue'
                    : 'Head to pickup location'
                  }
                </p>
                <div className="flex items-center gap-3 text-blue-100 text-sm">
                  <span>in {remainingDistance.toFixed(1)} km</span>
                  <span>•</span>
                  <span>{Math.ceil(remainingTime)} minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <Clock className={`mx-auto mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ETA</p>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{Math.ceil(remainingTime)}m</p>
          </div>
          
          <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
            <MapPin className={`mx-auto mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} size={20} />
            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Distance</p>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{remainingDistance.toFixed(1)}km</p>
          </div>
          
          <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <Zap className={`mx-auto mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} size={20} />
            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Speed</p>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>45 km/h</p>
          </div>

          <div className={`rounded-xl p-3 text-center ${isDarkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
            <AlertTriangle className={`mx-auto mb-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} size={20} />
            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Traffic</p>
            <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Light</p>
          </div>
        </div>

        {/* Destination Card */}
        <div className={`rounded-2xl p-4 mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
          <div className="flex items-start gap-3">
            <div className={`${isPickedUp ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} p-3 rounded-xl`}>
              <MapPin size={24} />
            </div>
            <div className="flex-1">
              <p className={`mb-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isPickedUp ? 'Delivering to' : 'Picking up from'}
              </p>
              <p className={`mb-3 font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {isPickedUp ? order.deliveryAddress : order.pickupAddress}
              </p>
              {order.specialInstructions && (
                <div className="flex items-start gap-2 bg-blue-50 p-2 rounded-lg">
                  <AlertCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-700">{order.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg" style={{ background: 'linear-gradient(135deg, #003D7A, #0A1E3E)' }}>
            <Navigation size={20} />
            Navigate
          </button>
          <button className="bg-gradient-to-br from-green-600 to-green-700 text-white py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg">
            <Phone size={20} />
            Call
          </button>
        </div>
      </div>
    </div>
  );
}