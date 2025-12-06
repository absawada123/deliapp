import { ArrowLeft, MapPin, Phone, User, Package, FileText, Navigation, CheckCircle, Circle, Clock, Truck, PackageCheck, ShieldCheck, Wallet, Trophy, ChevronDown, ChevronUp, QrCode } from 'lucide-react';
import type { Order } from '../App';
import { useState } from 'react';
import QRCode from 'react-qr-code';

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  onStartDelivery: () => void;
  onViewMap: () => void;
  isDarkMode: boolean;
}

export function OrderDetails({ order, onBack, onStartDelivery, onViewMap, isDarkMode }: OrderDetailsProps) {
  const [isOrderItemsOpen, setIsOrderItemsOpen] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="text-white top-0 z-10" style={{ background: 'linear-gradient(to right, #0A1E3E, #003D7A)' }}>
        <div className="flex items-center gap-4 p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="mb-1">Order Details</h1>
            <p className="text-blue-100">{order.id}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`backdrop-blur-md rounded-3xl p-6 relative overflow-hidden transition-all duration-500 ${
          order.status === 'completed' ? 'bg-gradient-to-br from-green-600/40 to-emerald-600/40 border-2 border-green-400/60' :
          order.status === 'payment_collected' ? 'bg-gradient-to-br from-green-600/40 to-teal-600/40 border-2 border-green-400/60' :
          order.status === 'verified' ? 'bg-gradient-to-br from-green-600/40 to-blue-600/40 border-2 border-green-400/60' :
          order.status === 'picked_up' ? 'bg-gradient-to-br from-emerald-600/40 to-cyan-600/40 border-2 border-emerald-400/60' :
          ['en_route_delivery', 'arrived_delivery'].includes(order.status) ? 'bg-gradient-to-br from-blue-600/40 to-indigo-600/40 border-2 border-blue-400/60' :
          ['en_route_pickup', 'arrived_pickup'].includes(order.status) ? 'bg-gradient-to-br from-blue-600/40 to-purple-600/40 border-2 border-blue-400/60' :
          order.status === 'accepted' ? 'bg-gradient-to-br from-blue-600/40 to-sky-600/40 border-2 border-blue-400/60' :
          'bg-white/20 border-2 border-white/30'
        }`}>
          
          {/* Animated Background Circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/5 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Content */}
          <div className="relative z-10">
            <p className="text-blue-50 mb-4 text-sm tracking-wide uppercase">Current Status</p>
            
            <div className="flex items-center gap-5">
              {/* Large Animated Status Icon */}
              <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center transform transition-all duration-500 ${
                order.status === 'completed' ? 'bg-green-500 shadow-2xl shadow-green-500/60 scale-100' :
                order.status === 'payment_collected' ? 'bg-green-500 shadow-2xl shadow-green-500/60 animate-bounce' :
                order.status === 'verified' ? 'bg-green-500 shadow-2xl shadow-green-500/60 animate-pulse' :
                order.status === 'picked_up' ? 'bg-emerald-500 shadow-2xl shadow-emerald-500/60 animate-pulse' :
                ['en_route_delivery', 'arrived_delivery'].includes(order.status) ? 'bg-blue-500 shadow-2xl shadow-blue-500/70 animate-pulse' :
                ['en_route_pickup', 'arrived_pickup'].includes(order.status) ? 'bg-blue-500 shadow-2xl shadow-blue-500/70 animate-pulse' :
                order.status === 'accepted' ? 'bg-blue-500 shadow-2xl shadow-blue-500/60 animate-pulse' :
                'bg-white/30 shadow-lg'
              }`}>
                {/* Rotating Ring Animation for Active Statuses */}
                {['en_route_delivery', 'arrived_delivery', 'en_route_pickup', 'arrived_pickup'].includes(order.status) && (
                  <div className="absolute inset-0 rounded-2xl border-4 border-white/40 border-t-white animate-spin"></div>
                )}
                
                {/* Pulsing Ring for Payment Collected */}
                {order.status === 'payment_collected' && (
                  <div className="absolute inset-0 rounded-2xl border-4 border-white/60 animate-ping"></div>
                )}
                
                {/* Icons */}
                {order.status === 'completed' && <Trophy className="text-white relative z-10" size={40} />}
                {order.status === 'payment_collected' && <Wallet className="text-white relative z-10" size={40} />}
                {order.status === 'verified' && <ShieldCheck className="text-white relative z-10" size={40} />}
                {['en_route_delivery', 'arrived_delivery'].includes(order.status) && <Navigation className="text-white relative z-10" size={40} />}
                {order.status === 'picked_up' && <PackageCheck className="text-white relative z-10" size={40} />}
                {['en_route_pickup', 'arrived_pickup'].includes(order.status) && <Truck className="text-white relative z-10" size={40} />}
                {order.status === 'accepted' && <Package className="text-white relative z-10" size={40} />}
              </div>
              
              {/* Status Text */}
              <div className="flex-1">
                <h2 className="text-white text-2xl mb-2 capitalize tracking-wide animate-fade-in">
                  {order.status.replace(/_/g, ' ')}
                </h2>
                <p className="text-blue-50 leading-relaxed">
                  {order.status === 'completed' && '🎉 Order successfully delivered'}
                  {order.status === 'payment_collected' && '⏳ Waiting for final confirmation'}
                  {order.status === 'verified' && '💳 Processing payment'}
                  {['en_route_delivery', 'arrived_delivery'].includes(order.status) && '🚀 Heading to customer location'}
                  {order.status === 'picked_up' && '📦 Package secured, ready to deliver'}
                  {['en_route_pickup', 'arrived_pickup'].includes(order.status) && '🛣️ Going to pickup location'}
                  {order.status === 'accepted' && '✨ Preparing for pickup'}
                </p>
              </div>
            </div>

            {/* Progress Indicator Bar */}
            <div className="mt-6 relative">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    order.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                    order.status === 'payment_collected' ? 'bg-gradient-to-r from-green-400 to-teal-500' :
                    order.status === 'verified' ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                    order.status === 'picked_up' ? 'bg-gradient-to-r from-emerald-400 to-cyan-500' :
                    ['en_route_delivery', 'arrived_delivery'].includes(order.status) ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
                    ['en_route_pickup', 'arrived_pickup'].includes(order.status) ? 'bg-gradient-to-r from-blue-400 to-purple-500' :
                    'bg-gradient-to-r from-blue-400 to-sky-500'
                  }`}
                  style={{
                    width: order.status === 'completed' ? '100%' :
                           order.status === 'payment_collected' ? '85%' :
                           order.status === 'verified' ? '70%' :
                           order.status === 'picked_up' ? '55%' :
                           ['en_route_delivery', 'arrived_delivery'].includes(order.status) ? '40%' :
                           ['en_route_pickup', 'arrived_pickup'].includes(order.status) ? '25%' :
                           order.status === 'accepted' ? '10%' : '0%'
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-blue-100">
                <span>Start</span>
                <span>
                  {order.status === 'completed' ? '100%' :
                   order.status === 'payment_collected' ? '85%' :
                   order.status === 'verified' ? '70%' :
                   order.status === 'picked_up' ? '55%' :
                   ['en_route_delivery', 'arrived_delivery'].includes(order.status) ? '40%' :
                   ['en_route_pickup', 'arrived_pickup'].includes(order.status) ? '25%' :
                   order.status === 'accepted' ? '10%' : '0%'}
                </span>
                <span>Complete</span>
              </div>
            </div>
          </div>

          {/* Order Information Grid */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-blue-100 text-xs mb-1">Distance</p>
                <p className="text-white">{order.distance}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Est. Time</p>
                <p className="text-white">{order.estimatedTime}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">Barcode</p>
                <p className="text-white">{order.barcode}</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs mb-1">OTP Code</p>
                <p className="text-white">{order.otp}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Customer Information */}
        <div className={`rounded-2xl p-4 shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <User className="text-blue-600" size={20} />
            <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Customer Information</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className={`mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Name</p>
              <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{order.customerName}</p>
            </div>
            <div>
              <p className={`mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Phone Number</p>
              <div className="flex items-center justify-between">
                <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{order.customerPhone}</p>
                <a 
                  href={`tel:${order.customerPhone}`}
                  className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Phone size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className={`rounded-2xl p-4 shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-blue-600" size={20} />
            <h2 className="text-gray-800">Locations</h2>
            <button 
              onClick={onViewMap}
              className="ml-auto text-blue-600 hover:underline flex items-center gap-1"
            >
              <Navigation size={16} />
              View Map
            </button>
          </div>

          {/* Pickup */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-100 text-green-600 px-2 py-1 rounded-lg">
                Pickup
              </div>
            </div>
            <p className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{order.pickupAddress}</p>
          </div>

          <div className={`border-t my-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>

          {/* Delivery */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-red-100 text-red-600 px-2 py-1 rounded-lg">
                Delivery
              </div>
            </div>
            <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{order.deliveryAddress}</p>
            <button 
              onClick={onViewMap}
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <Navigation size={16} />
              Preview Full Route
            </button>
          </div>
        </div>

        {/* Order Items */}
        <div className={`rounded-2xl p-4 shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <Package className="text-blue-600" size={20} />
            <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Order Items</h2>
            <button
              onClick={() => setIsOrderItemsOpen(!isOrderItemsOpen)}
              className="ml-auto text-blue-600 hover:underline flex items-center gap-1"
            >
              {isOrderItemsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {isOrderItemsOpen && (
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>{item.name}</p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Quantity: {item.quantity}</p>
                  </div>
                  <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>₱{item.price.toFixed(2)}</p>
                </div>
              ))}
              
              <div className={`border-t pt-3 mt-3 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex justify-between items-center">
                  <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>Total Amount</p>
                  <p className="text-blue-600 text-xl">₱{order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className={`rounded-2xl p-4 shadow-sm ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-blue-600" size={20} />
              <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Special Instructions</h2>
            </div>
            
            <div className={`border rounded-xl p-3 ${
              isDarkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'
            }`}>
              <p className={isDarkMode ? 'text-amber-300' : 'text-amber-900'}>{order.specialInstructions}</p>
            </div>
          </div>
        )}

        {/* Package QR Code - NEW SECTION */}
        <div className={`rounded-2xl p-4 shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="text-blue-600" size={20} />
            <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Package QR Code</h2>
          </div>
          <div className="flex justify-center">
            <QRCode 
              value={order.barcode}
              size={200}
              bgColor={isDarkMode ? '#1F2937' : '#FFFFFF'}
              fgColor={isDarkMode ? '#FFFFFF' : '#000000'}
              level="H"
            />
          </div>
          <p className={`text-sm text-center mt-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Scan this code at pickup to verify the package
          </p>
        </div>

        {/* Transaction Status */}
        <div className={`rounded-2xl p-4 shadow-sm ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-blue-600" size={20} />
            <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Transaction Status</h2>
          </div>
          
          {/* Vertical Timeline */}
          <div className="relative pl-8">
            {/* Vertical Progress Line */}
            <div className={`absolute left-[15px] top-0 bottom-0 w-0.5 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            
            {/* Dynamic Progress Line Overlay */}
            <div 
              className="absolute left-[15px] top-0 w-0.5 bg-gradient-to-b from-green-600 to-green-400 transition-all duration-500"
              style={{
                height: order.status === 'completed' ? '100%' :
                        order.status === 'payment_collected' ? '85.7%' :
                        ['verified', 'arrived_delivery', 'en_route_delivery'].includes(order.status) ? '71.4%' :
                        order.status === 'picked_up' ? '57.1%' :
                        ['arrived_pickup', 'en_route_pickup'].includes(order.status) ? '42.8%' :
                        order.status === 'accepted' ? '14.2%' : '0%'
              }}
            ></div>

            {/* Step 1: Order Accepted */}
            <div className="relative mb-6">
              <div className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                ['accepted', 'en_route_pickup', 'arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status)
                  ? 'bg-green-600 border-green-600 shadow-lg shadow-green-600/30'
                  : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}>
                {['accepted', 'en_route_pickup', 'arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status) ? (
                  <CheckCircle size={16} className="text-white" />
                ) : (
                  <Package size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                )}
              </div>
              <div className="ml-1">
                <h3 className={`font-semibold mb-1 ${
                  ['accepted', 'en_route_pickup', 'arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status)
                    ? isDarkMode ? 'text-green-400' : 'text-green-700'
                    : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>Order Accepted</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Parcel ready for pickup</p>
              </div>
            </div>

            {/* Step 2: En Route to Pickup */}
            <div className="relative mb-6">
              <div className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                ['en_route_pickup', 'arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status)
                  ? 'bg-green-600 border-green-600 shadow-lg shadow-green-600/30'
                  : order.status === 'accepted'
                    ? 'bg-blue-600 border-blue-600 animate-pulse shadow-lg shadow-blue-600/50'
                    : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}>
                {['en_route_pickup', 'arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status) ? (
                  <CheckCircle size={16} className="text-white" />
                ) : order.status === 'accepted' ? (
                  <Truck size={14} className="text-white" />
                ) : (
                  <Truck size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                )}
              </div>
              <div className="ml-1">
                <h3 className={`font-semibold mb-1 ${
                  ['en_route_pickup', 'arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status)
                    ? isDarkMode ? 'text-green-400' : 'text-green-700'
                    : order.status === 'accepted'
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>En Route to Pickup</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rider heading to pickup location</p>
              </div>
            </div>

            {/* Step 3: Order Picked Up */}
            <div className="relative mb-6">
              <div className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                ['picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status)
                  ? 'bg-green-600 border-green-600 shadow-lg shadow-green-600/30'
                  : ['en_route_pickup', 'arrived_pickup'].includes(order.status)
                    ? 'bg-blue-600 border-blue-600 animate-pulse shadow-lg shadow-blue-600/50'
                    : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}>
                {['picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status) ? (
                  <CheckCircle size={16} className="text-white" />
                ) : ['en_route_pickup', 'arrived_pickup'].includes(order.status) ? (
                  <PackageCheck size={14} className="text-white" />
                ) : (
                  <PackageCheck size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                )}
              </div>
              <div className="ml-1">
                <h3 className={`font-semibold mb-1 ${
                  ['picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status)
                    ? isDarkMode ? 'text-green-400' : 'text-green-700'
                    : ['en_route_pickup', 'arrived_pickup'].includes(order.status)
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>Order Picked Up</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Barcode scanned successfully</p>
              </div>
            </div>

            {/* Step 4: En Route to Customer */}
            <div className="relative mb-6">
              <div className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                ['en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status)
                  ? 'bg-green-600 border-green-600 shadow-lg shadow-green-600/30'
                  : order.status === 'picked_up'
                    ? 'bg-blue-600 border-blue-600 animate-pulse shadow-lg shadow-blue-600/50'
                    : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}>
                {['en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status) ? (
                  <CheckCircle size={16} className="text-white" />
                ) : order.status === 'picked_up' ? (
                  <Navigation size={14} className="text-white" />
                ) : (
                  <Navigation size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                )}
              </div>
              <div className="ml-1">
                <h3 className={`font-semibold mb-1 ${
                  ['en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected', 'completed'].includes(order.status)
                    ? isDarkMode ? 'text-green-400' : 'text-green-700'
                    : order.status === 'picked_up'
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>En Route to Customer</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Delivering to customer address</p>
              </div>
            </div>

            {/* Step 5: Customer Verified */}
            <div className="relative mb-6">
              <div className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                ['verified', 'payment_collected', 'completed'].includes(order.status)
                  ? 'bg-green-600 border-green-600 shadow-lg shadow-green-600/30'
                  : ['en_route_delivery', 'arrived_delivery'].includes(order.status)
                    ? 'bg-blue-600 border-blue-600 animate-pulse shadow-lg shadow-blue-600/50'
                    : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}>
                {['verified', 'payment_collected', 'completed'].includes(order.status) ? (
                  <CheckCircle size={16} className="text-white" />
                ) : ['en_route_delivery', 'arrived_delivery'].includes(order.status) ? (
                  <ShieldCheck size={14} className="text-white" />
                ) : (
                  <ShieldCheck size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                )}
              </div>
              <div className="ml-1">
                <h3 className={`font-semibold mb-1 ${
                  ['verified', 'payment_collected', 'completed'].includes(order.status)
                    ? isDarkMode ? 'text-green-400' : 'text-green-700'
                    : ['en_route_delivery', 'arrived_delivery'].includes(order.status)
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>Customer Verified</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>OTP/QR code confirmed</p>
              </div>
            </div>

            {/* Step 6: Payment Collected */}
            <div className="relative mb-6">
              <div className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                ['payment_collected', 'completed'].includes(order.status)
                  ? 'bg-green-600 border-green-600 shadow-lg shadow-green-600/30'
                  : order.status === 'verified'
                    ? 'bg-blue-600 border-blue-600 animate-pulse shadow-lg shadow-blue-600/50'
                    : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}>
                {['payment_collected', 'completed'].includes(order.status) ? (
                  <CheckCircle size={16} className="text-white" />
                ) : order.status === 'verified' ? (
                  <Wallet size={14} className="text-white" />
                ) : (
                  <Wallet size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                )}
              </div>
              <div className="ml-1">
                <h3 className={`font-semibold mb-1 ${
                  ['payment_collected', 'completed'].includes(order.status)
                    ? isDarkMode ? 'text-green-400' : 'text-green-700'
                    : order.status === 'verified'
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>Payment Collected</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>₱{order.totalAmount.toFixed(2)} received</p>
              </div>
            </div>

            {/* Step 7: Delivery Completed */}
            <div className="relative">
              <div className={`absolute -left-8 w-8 h-8 rounded-full flex items-center justify-center border-4 ${
                order.status === 'completed'
                  ? 'bg-green-600 border-green-600 shadow-lg shadow-green-600/30'
                  : order.status === 'payment_collected'
                    ? 'bg-blue-600 border-blue-600 animate-pulse shadow-lg shadow-blue-600/50'
                    : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}>
                {order.status === 'completed' ? (
                  <CheckCircle size={16} className="text-white" />
                ) : order.status === 'payment_collected' ? (
                  <Trophy size={14} className="text-white" />
                ) : (
                  <Trophy size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                )}
              </div>
              <div className="ml-1">
                <h3 className={`font-semibold mb-1 ${
                  order.status === 'completed'
                    ? isDarkMode ? 'text-green-400' : 'text-green-700'
                    : order.status === 'payment_collected'
                      ? 'text-blue-600'
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>Delivery Completed</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Proof of delivery submitted</p>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Action Button */}
        <div className={`fixed bottom-0 left-0 right-0 border-t p-4 ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={onStartDelivery}
            className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <Navigation size={20} />
            Start Delivery
          </button>
        </div>
      </div>
    </div>
  );
}
