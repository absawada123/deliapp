import { X, MapPin, Navigation, AlertTriangle, Zap, TrendingUp, Clock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Order } from '../App';

interface DeliveryMapProps {
  order: Order;
  onClose: () => void;
  isDarkMode: boolean;
}

export function DeliveryMap({ order, onClose, isDarkMode }: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [showTraffic, setShowTraffic] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const routeLayersRef = useRef<any[]>([]);

  const isPickedUp = ['picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status);

  // Mock coordinates for Metro Manila
  const pickupCoords = { lat: 14.5547, lng: 121.0244 }; // Makati
  const deliveryCoords = { lat: 14.6091, lng: 121.0223 }; // Mandaluyong

  // Multiple route options
  const routes = [
    {
      name: 'Via EDSA',
      duration: '18 mins',
      durationInTraffic: '25 mins',
      distance: '8.5 km',
      traffic: 'moderate',
      waypoints: [
        [14.5547, 121.0244],
        [14.5650, 121.0250],
        [14.5750, 121.0245],
        [14.5850, 121.0240],
        [14.5950, 121.0235],
        [14.6091, 121.0223]
      ] as [number, number][],
      color: '#003D7A'
    },
    {
      name: 'Via C-5 Road',
      duration: '22 mins',
      durationInTraffic: '28 mins',
      distance: '10.2 km',
      traffic: 'light',
      waypoints: [
        [14.5547, 121.0244],
        [14.5620, 121.0320],
        [14.5720, 121.0360],
        [14.5850, 121.0340],
        [14.6000, 121.0290],
        [14.6091, 121.0223]
      ] as [number, number][],
      color: '#10b981'
    },
    {
      name: 'Via Ortigas Ave',
      duration: '20 mins',
      durationInTraffic: '32 mins',
      distance: '9.1 km',
      traffic: 'heavy',
      waypoints: [
        [14.5547, 121.0244],
        [14.5600, 121.0180],
        [14.5700, 121.0160],
        [14.5850, 121.0170],
        [14.5980, 121.0200],
        [14.6091, 121.0223]
      ] as [number, number][],
      color: '#ef4444'
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
      }).setView(
        [
          (pickupCoords.lat + deliveryCoords.lat) / 2,
          (pickupCoords.lng + deliveryCoords.lng) / 2
        ],
        12
      );

      // Add tile layer with custom styling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      leafletMapRef.current = map;

      // Custom pickup icon with animation
      const pickupIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="absolute inset-0 ${!isPickedUp ? 'animate-ping' : ''}" style="width: 50px; height: 50px; background: rgba(16, 185, 129, 0.4); border-radius: 50%; top: -5px; left: -5px;"></div>
            <div style="background: linear-gradient(135deg, #10b981, #059669); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid white; box-shadow: 0 8px 16px rgba(0,0,0,0.3); position: relative; z-index: 10;">
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

      // Custom delivery icon with animation
      const deliveryIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="absolute inset-0 ${isPickedUp ? 'animate-ping' : ''}" style="width: 50px; height: 50px; background: rgba(239, 68, 68, 0.4); border-radius: 50%; top: -5px; left: -5px;"></div>
            <div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 4px solid white; box-shadow: 0 8px 16px rgba(0,0,0,0.3); position: relative; z-index: 10;">
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

      // Add markers
      const pickupMarker = L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <div style="font-weight: bold; color: #10b981; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#10b981">
                <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
              </svg>
              Pickup Location
            </div>
            <div style="color: #374151; font-size: 13px;">${order.pickupAddress}</div>
          </div>
        `);

      const deliveryMarker = L.marker([deliveryCoords.lat, deliveryCoords.lng], { icon: deliveryIcon })
        .addTo(map)
        .bindPopup(`
          <div style="padding: 8px; min-width: 200px;">
            <div style="font-weight: bold; color: #ef4444; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Delivery Location
            </div>
            <div style="color: #374151; font-size: 13px;">${order.deliveryAddress}</div>
          </div>
        `);

      // Draw all routes
      routes.forEach((route, index) => {
        const polyline = L.polyline(route.waypoints, {
          color: index === selectedRoute ? route.color : '#94a3b8',
          weight: index === selectedRoute ? 7 : 4,
          opacity: index === selectedRoute ? 0.9 : 0.5,
          dashArray: index === selectedRoute ? '' : '10, 10',
          lineJoin: 'round',
          lineCap: 'round'
        }).addTo(map);

        routeLayersRef.current.push(polyline);
      });

      // Fit bounds to show all markers with padding
      const bounds = L.latLngBounds([
        [pickupCoords.lat, pickupCoords.lng],
        [deliveryCoords.lat, deliveryCoords.lng]
      ]);
      map.fitBounds(bounds, { padding: [100, 100] });

      // Open active location popup
      setTimeout(() => {
        if (isPickedUp) {
          deliveryMarker.openPopup();
        } else {
          pickupMarker.openPopup();
        }
      }, 500);

      setIsMapLoaded(true);

      // Cleanup
      return () => {
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
        routeLayersRef.current = [];
      };
    });
  }, [order, isPickedUp]);

  const switchRoute = (index: number) => {
    setSelectedRoute(index);
    if (routeLayersRef.current.length > 0) {
      routeLayersRef.current.forEach((layer, i) => {
        layer.setStyle({
          color: i === index ? routes[i].color : '#94a3b8',
          weight: i === index ? 7 : 4,
          opacity: i === index ? 0.9 : 0.5,
          dashArray: i === index ? '' : '10, 10'
        });
        
        // Bring selected route to front
        routeLayersRef.current[index].bringToFront();
      });
    }
  };

  const getTrafficColor = (traffic: string) => {
    switch (traffic) {
      case 'light': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'heavy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrafficIcon = (traffic: string) => {
    switch (traffic) {
      case 'light': return <Zap className="text-green-500" size={16} />;
      case 'moderate': return <TrendingUp className="text-yellow-500" size={16} />;
      case 'heavy': return <AlertTriangle className="text-red-500" size={16} />;
      default: return null;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Header with Gradient */}
        <div className="text-white p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A1E3E, #003D7A, #0A1E3E)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)' 
            }}></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-xl">Delivery Routes</h2>
                  <p className="text-blue-100 text-sm">{order.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all active:scale-95"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div 
          ref={mapRef}
          className="w-full h-[calc(100vh-400px)]"
          style={{ background: '#f0f0f0' }}
        />

        {/* Floating Route Cards */}
        <div className="absolute top-24 left-4 right-4 z-10">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {routes.map((route, index) => (
              <button
                key={index}
                onClick={() => switchRoute(index)}
                className={`flex-shrink-0 rounded-2xl p-4 transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[180px] shadow-lg backdrop-blur-md ${
                  selectedRoute === index
                    ? 'bg-white border-2'
                    : 'bg-white/90 border-2 border-transparent'
                }`}
                style={{
                  borderColor: selectedRoute === index ? route.color : 'transparent'
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  {getTrafficIcon(route.traffic)}
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: selectedRoute === index ? route.color : '#374151' }}
                  >
                    {route.name}
                  </span>
                </div>
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-600">Time:</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">
                      {showTraffic ? route.durationInTraffic : route.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-500" />
                      <span className="text-xs text-gray-600">Distance:</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{route.distance}</span>
                  </div>
                </div>
                {showTraffic && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getTrafficColor(route.traffic)}`}></div>
                      <span className="text-xs text-gray-600 capitalize">{route.traffic} traffic</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Panel */}
        <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {/* Location Status Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Pickup */}
            <div className={`rounded-2xl p-4 transition-all duration-300 ${
              isPickedUp 
                ? isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                : 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 shadow-lg'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isPickedUp ? 'bg-green-100' : 'bg-green-500'
                }`}>
                  <MapPin size={20} className={isPickedUp ? 'text-green-600' : 'text-white'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${
                      isPickedUp ? 'bg-green-500' : 'bg-green-600 animate-pulse'
                    }`}></div>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Pickup</span>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    {order.pickupAddress.split(',')[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className={`rounded-2xl p-4 transition-all duration-300 ${
              isPickedUp 
                ? 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500 shadow-lg'
                : isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isPickedUp ? 'bg-red-500' : 'bg-red-100'
                }`}>
                  <MapPin size={20} className={isPickedUp ? 'text-white' : 'text-red-600'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${
                      isPickedUp ? 'bg-red-600 animate-pulse' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Delivery</span>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                    {order.deliveryAddress.split(',')[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button 
              onClick={() => setShowTraffic(!showTraffic)}
              className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                showTraffic 
                  ? 'bg-green-600 text-white shadow-lg' 
                  : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <AlertTriangle size={18} />
              Traffic {showTraffic ? 'ON' : 'OFF'}
            </button>

            <button className="text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95" style={{ background: 'linear-gradient(135deg, #0A1E3E, #003D7A)' }}>
              <Navigation size={18} />
              Navigate
            </button>
          </div>

          {/* Route Stats */}
          <div className={`rounded-2xl p-4 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50'
          }`}>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Selected Route Stats
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="mb-1">
                  <MapPin className={`mx-auto ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
                </div>
                <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Distance</p>
                <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {routes[selectedRoute].distance}
                </p>
              </div>
              <div className="text-center">
                <div className="mb-1">
                  <Clock className={`mx-auto ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} size={20} />
                </div>
                <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Normal</p>
                <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {routes[selectedRoute].duration}
                </p>
              </div>
              <div className="text-center">
                <div className="mb-1">
                  <AlertTriangle className={`mx-auto ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} size={20} />
                </div>
                <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>W/ Traffic</p>
                <p className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {routes[selectedRoute].durationInTraffic}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}