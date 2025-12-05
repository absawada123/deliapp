import { ArrowLeft, CheckCircle, Circle, MapPin, Package, Navigation, QrCode, CreditCard, Truck } from 'lucide-react';
import type { Order } from '../App';

interface DeliveryTrackingProps {
  order: Order;
  onBack: () => void;
  isDarkMode: boolean;
}

export function DeliveryTracking({ order, onBack, isDarkMode }: DeliveryTrackingProps) {
  const timeline = [
    {
      status: 'accepted',
      label: 'Order Accepted',
      description: 'You accepted the delivery order',
      icon: CheckCircle,
      time: '10:30 AM',
      completed: true
    },
    {
      status: 'en_route_pickup',
      label: 'En Route to Pickup',
      description: 'Heading to pickup location',
      icon: Navigation,
      time: '10:35 AM',
      completed: ['en_route_pickup', 'arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status)
    },
    {
      status: 'arrived_pickup',
      label: 'Arrived at Pickup',
      description: order.pickupAddress,
      icon: MapPin,
      time: '10:50 AM',
      completed: ['arrived_pickup', 'picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status)
    },
    {
      status: 'picked_up',
      label: 'Package Scanned',
      description: 'Barcode verified and package picked up',
      icon: QrCode,
      time: '10:52 AM',
      completed: ['picked_up', 'en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status)
    },
    {
      status: 'en_route_delivery',
      label: 'En Route to Customer',
      description: 'Delivering package to customer',
      icon: Truck,
      time: '10:55 AM',
      completed: ['en_route_delivery', 'arrived_delivery', 'verified', 'payment_collected'].includes(order.status)
    },
    {
      status: 'arrived_delivery',
      label: 'Arrived at Delivery',
      description: order.deliveryAddress,
      icon: MapPin,
      time: '11:15 AM',
      completed: ['arrived_delivery', 'verified', 'payment_collected'].includes(order.status)
    },
    {
      status: 'verified',
      label: 'Delivery Verified',
      description: 'Customer verified with OTP/QR code',
      icon: CheckCircle,
      time: '11:18 AM',
      completed: ['verified', 'payment_collected'].includes(order.status)
    },
    {
      status: 'payment_collected',
      label: 'Payment Collected',
      description: `₱${order.totalAmount.toFixed(2)} received`,
      icon: CreditCard,
      time: '11:20 AM',
      completed: ['payment_collected'].includes(order.status)
    }
  ];

  const currentStepIndex = timeline.findIndex(step => step.status === order.status);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="text-white sticky top-0 z-10" style={{ background: 'linear-gradient(to right, #0A1E3E, #003D7A)' }}>
        <div className="flex items-center gap-4 p-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="mb-1">Delivery Timeline</h1>
            <p className="text-blue-100">{order.id}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="px-4 pb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100">Progress</p>
              <p className="text-white">{currentStepIndex + 1} / {timeline.length}</p>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${((currentStepIndex + 1) / timeline.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div 
              className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-blue-600 to-purple-600 transition-all duration-500"
              style={{ height: `${(currentStepIndex / (timeline.length - 1)) * 100}%` }}
            ></div>

            {/* Timeline Items */}
            <div className="space-y-8">
              {timeline.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = step.completed;

                return (
                  <div key={step.status} className="relative flex gap-4">
                    {/* Icon */}
                    <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white transition-all ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-400'
                    } ${isActive ? 'ring-4 ring-blue-200 scale-110' : ''}`}>
                      <Icon size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className={`${isCompleted ? 'text-gray-800' : 'text-gray-500'} ${isActive ? '' : ''}`}>
                          {step.label}
                        </p>
                        <span className={`text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                          {isCompleted ? step.time : '--:--'}
                        </span>
                      </div>
                      <p className={`${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                      
                      {isActive && (
                        <div className="mt-3 bg-blue-50 border-2 border-blue-200 rounded-xl p-3">
                          <p className="text-blue-900">Current Step - In Progress</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-4">
          <h3 className="text-gray-800 mb-4">Order Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Package className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="text-gray-600">Order ID</p>
                <p className="text-gray-800">{order.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Circle className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="text-gray-600">Customer</p>
                <p className="text-gray-800">{order.customerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="text-gray-600">Distance</p>
                <p className="text-gray-800">{order.distance}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard className="text-gray-400" size={20} />
              <div className="flex-1">
                <p className="text-gray-600">Amount</p>
                <p className="text-gray-800">₱{order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-white rounded-2xl p-4 mt-4 text-center" style={{ background: 'linear-gradient(to right, #003D7A, #0A1E3E)' }}>
          <p className="text-blue-100 mb-2">Current Status</p>
          <p className="text-xl capitalize">{order.status.replace(/_/g, ' ')}</p>
        </div>
      </div>
    </div>
  );
}