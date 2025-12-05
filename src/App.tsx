import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';
import { ParcelAssignment } from './components/ParcelAssignment';
import { OrderDetails } from './components/OrderDetails';
import { DeliveryFlow } from './components/DeliveryFlow';
import { DeliveryVerification } from './components/DeliveryVerification';
import { PaymentSelection } from './components/PaymentSelection';
import { DeliveryTracking } from './components/DeliveryTracking';
import { Notifications } from './components/Notifications';
import { BarcodeScan } from './components/BarcodeScan';
import { DeliveryMap } from './components/DeliveryMap';
import { LiveDeliveryMapLeaflet } from './components/LiveDeliveryMapLeaflet';
import { Analytics } from './components/Analytics';
import { ProofOfDelivery } from './components/ProofOfDelivery';
import { Loading } from './components/Loading';


export type DeliveryStatus = 'pending' | 'accepted' | 'en_route_pickup' | 'arrived_pickup' | 'picked_up' | 'en_route_delivery' | 'arrived_delivery' | 'verified' | 'payment_collected' | 'completed';


export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: { name: string; quantity: number; price: number }[];
  specialInstructions?: string;
  status: DeliveryStatus;
  totalAmount: number;
  distance: string;
  estimatedTime: string;
  barcode: string;
  otp?: string;
}


export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'assignment' | 'update' | 'alert';
}


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authScreen, setAuthScreen] = useState<'signup' | 'login'>('signup');
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'assignments' | 'order' | 'delivery' | 'verification' | 'payment' | 'tracking' | 'notifications' | 'barcode' | 'map' | 'livemap' | 'analytics' | 'proof'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Parcel Assignment',
      message: '3 new parcels assigned from Central Hub',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      type: 'assignment'
    },
    {
      id: '2',
      title: 'Delivery Update',
      message: 'Customer is waiting at delivery location',
      timestamp: new Date(Date.now() - 600000),
      read: false,
      type: 'update'
    }
  ]);


  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-2024-001',
      customerName: 'Maria Santos',
      customerPhone: '+63 917 123 4567',
      pickupAddress: 'SM Megamall, EDSA corner J. Vargas Ave, Mandaluyong, Metro Manila',
      deliveryAddress: 'Unit 5B The Pearl Place, Ortigas Center, Pasig City, Metro Manila 1605',
      items: [
        { name: 'Electronics Package', quantity: 1, price: 14999.00 },
        { name: 'Accessories Box', quantity: 2, price: 2499.00 }
      ],
      specialInstructions: 'Please call before arriving. Ring doorbell twice.',
      status: 'accepted',
      totalAmount: 19997.00,
      distance: '8.5 km',
      estimatedTime: '25 mins',
      barcode: 'BAR123456789',
      otp: '4582'
    },
    {
      id: 'ORD-2024-002',
      customerName: 'Juan Dela Cruz',
      customerPhone: '+63 918 234 5678',
      pickupAddress: 'Robinsons Galleria, EDSA corner Ortigas Ave, Quezon City, Metro Manila',
      deliveryAddress: 'Greenbelt 5, Ayala Center, Makati City, Metro Manila 1224',
      items: [
        { name: 'Document Envelope', quantity: 1, price: 750.00 }
      ],
      specialInstructions: 'Leave with reception if customer unavailable',
      status: 'pending',
      totalAmount: 750.00,
      distance: '12.3 km',
      estimatedTime: '35 mins',
      barcode: 'BAR987654321',
      otp: '7391'
    }
  ]);


  useEffect(() => {
    // Simulate push notification
    const timer = setTimeout(() => {
      addNotification({
        id: Date.now().toString(),
        title: 'Payment Reminder',
        message: 'Collect payment for order ORD-2024-001',
        timestamp: new Date(),
        read: false,
        type: 'alert'
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);


  const addNotification = (notification: Notification) => {
    setNotifications((prev: Notification[]) => [notification, ...prev]);
  };


  const handleSignup = () => {
    setIsLoading(true);
    setLoadingMessage('Creating your account...');
    
    setTimeout(() => {
      setIsLoggedIn(true);
      setCurrentScreen('dashboard');
      setIsLoading(false);
    }, 2000);
  };


  const handleLogin = () => {
    setIsLoading(true);
    setLoadingMessage('Signing you in...');
    
    setTimeout(() => {
      setIsLoggedIn(true);
      setCurrentScreen('dashboard');
      setIsLoading(false);
    }, 2000);
  };


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };


  const handleSelectOrder = (order: Order) => {
    setIsLoading(true);
    setLoadingMessage('Loading order details...');
    
    setTimeout(() => {
      setSelectedOrder(order);
      setCurrentScreen('order');
      setIsLoading(false);
    }, 800);
  };


  const handleStartDelivery = () => {
    setIsLoading(true);
    setLoadingMessage('Initializing delivery route...');
    
    setTimeout(() => {
      setCurrentScreen('delivery');
      setIsLoading(false);
    }, 1000);
  };


  const handleScanBarcode = () => {
    setIsLoading(true);
    setLoadingMessage('Opening scanner...');
    
    setTimeout(() => {
      setCurrentScreen('barcode');
      setIsLoading(false);
    }, 800);
  };


  const handleVerification = () => {
    setIsLoading(true);
    setLoadingMessage('Preparing verification...');
    
    setTimeout(() => {
      setCurrentScreen('verification');
      setIsLoading(false);
    }, 800);
  };


  const handlePayment = () => {
    setIsLoading(true);
    setLoadingMessage('Loading payment options...');
    
    setTimeout(() => {
      setCurrentScreen('payment');
      setIsLoading(false);
    }, 800);
  };


  const handleViewTracking = () => {
    setIsLoading(true);
    setLoadingMessage('Loading delivery timeline...');
    
    setTimeout(() => {
      setCurrentScreen('tracking');
      setIsLoading(false);
    }, 800);
  };


  const handleViewMap = () => {
    setIsLoading(true);
    setLoadingMessage('Loading route map...');
    
    setTimeout(() => {
      setCurrentScreen('map');
      setIsLoading(false);
    }, 1000);
  };


  const handleStartNavigation = () => {
    setIsLoading(true);
    setLoadingMessage('Starting live navigation...');
    
    setTimeout(() => {
      setCurrentScreen('livemap');
      setIsLoading(false);
    }, 1000);
  };


  const handleCompleteDelivery = () => {
    if (selectedOrder) {
      setOrders((prev: Order[]) => prev.map((o: Order) => 
        o.id === selectedOrder.id ? { ...o, status: 'completed' } : o
      ));
      addNotification({
        id: Date.now().toString(),
        title: 'Delivery Completed',
        message: `Order ${selectedOrder.id} has been successfully delivered`,
        timestamp: new Date(),
        read: false,
        type: 'update'
      });
      setSelectedOrder(null);
      setCurrentScreen('dashboard');
    }
  };


  const updateOrderStatus = (orderId: string, status: DeliveryStatus) => {
    setOrders((prev: Order[]) => prev.map((o: Order) => 
      o.id === orderId ? { ...o, status } : o
    ));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
  };


  const markNotificationAsRead = (id: string) => {
    setNotifications((prev: Notification[]) => prev.map((n: Notification) => 
      n.id === id ? { ...n, read: true } : n
    ));
  };


  // In your App component, remove the external links and pass the toggle handler:

if (!isLoggedIn) {
  if (authScreen === 'login') {
    return <Login onLogin={handleLogin} onToggleAuth={() => setAuthScreen('signup')} />;
  }
  return <Signup onSignup={handleSignup} onToggleAuth={() => setAuthScreen('login')} />;
}



  const unreadCount = notifications.filter((n: Notification) => !n.read).length;


  if (isLoading) {
    return <Loading message={loadingMessage} isDarkMode={isDarkMode} />;
  }


  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {currentScreen === 'dashboard' && (
        <Dashboard 
          orders={orders}
          onSelectOrder={handleSelectOrder}
          onNavigateToAssignments={() => setCurrentScreen('assignments')}
          onNavigateToNotifications={() => setCurrentScreen('notifications')}
          onNavigateToAnalytics={() => setCurrentScreen('analytics')}
          unreadNotifications={unreadCount}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      
      {currentScreen === 'assignments' && (
        <ParcelAssignment 
          onBack={() => setCurrentScreen('dashboard')}
          onAcceptParcel={(order: Order) => {
            setOrders((prev: Order[]) => {
              const exists = prev.some(o => o.id === order.id);
              if (exists) {
                return prev.map(o => o.id === order.id ? { ...o, status: 'accepted' } : o);
              }
              return [...prev, order];
            });
            addNotification({
              id: Date.now().toString(),
              title: 'Parcel Accepted',
              message: `You accepted order ${order.id}`,
              timestamp: new Date(),
              read: false,
              type: 'assignment'
            });
            setCurrentScreen('dashboard');
          }}
          isDarkMode={isDarkMode}
        />
      )}
      
      {currentScreen === 'order' && selectedOrder && (
        <OrderDetails 
          order={selectedOrder}
          onBack={() => setCurrentScreen('dashboard')}
          onStartDelivery={handleStartDelivery}
          onViewMap={handleViewMap}
          isDarkMode={isDarkMode}
        />
      )}
      
      {currentScreen === 'delivery' && selectedOrder && (
        <DeliveryFlow 
          order={selectedOrder}
          onBack={() => setCurrentScreen('order')}
          onScanBarcode={handleScanBarcode}
          onVerify={handleVerification}
          onViewTracking={handleViewTracking}
          onViewMap={handleViewMap}
          onStartNavigation={handleStartNavigation}
          updateOrderStatus={updateOrderStatus}
          isDarkMode={isDarkMode}
        />
      )}
      
      {currentScreen === 'barcode' && selectedOrder && (
        <BarcodeScan 
          expectedBarcode={selectedOrder.barcode}
          onBack={() => setCurrentScreen('delivery')}
          onScanSuccess={() => {
            updateOrderStatus(selectedOrder.id, 'picked_up');
            setCurrentScreen('delivery');
            addNotification({
              id: Date.now().toString(),
              title: 'Barcode Verified',
              message: 'Package scanned successfully',
              timestamp: new Date(),
              read: false,
              type: 'update'
            });
          }}
          isDarkMode={isDarkMode}
        />
      )}
      
      {currentScreen === 'verification' && selectedOrder && (
        <DeliveryVerification 
          order={selectedOrder}
          onBack={() => setCurrentScreen('delivery')}
          onVerified={() => {
            updateOrderStatus(selectedOrder.id, 'verified');
            handlePayment();
          }}
        />
      )}
      
      {currentScreen === 'payment' && selectedOrder && (
        <PaymentSelection 
          order={selectedOrder}
          onBack={() => setCurrentScreen('delivery')}
          onPaymentComplete={() => {
            updateOrderStatus(selectedOrder.id, 'payment_collected');
            setCurrentScreen('proof');
          }}
          isDarkMode={isDarkMode}
        />
      )}
      
      {currentScreen === 'tracking' && selectedOrder && (
        <DeliveryTracking 
          order={selectedOrder}
          onBack={() => setCurrentScreen('delivery')}
          isDarkMode={isDarkMode}
        />
      )}
      
      {currentScreen === 'notifications' && (
        <Notifications 
          notifications={notifications}
          onBack={() => setCurrentScreen('dashboard')}
          onMarkAsRead={markNotificationAsRead}
          isDarkMode={isDarkMode}
        />
      )}

      {currentScreen === 'map' && selectedOrder && (
        <DeliveryMap 
          order={selectedOrder}
          onClose={() => setCurrentScreen(selectedOrder.status === 'accepted' ? 'order' : 'delivery')}
          isDarkMode={isDarkMode}
        />
      )}

      {currentScreen === 'livemap' && selectedOrder && (
        <LiveDeliveryMapLeaflet 
          order={selectedOrder}
          onBack={() => setCurrentScreen('delivery')}
          isDarkMode={isDarkMode}
        />
      )}

      {currentScreen === 'analytics' && (
        <Analytics 
          onBack={() => setCurrentScreen('dashboard')}
          isDarkMode={isDarkMode}
        />
      )}

      {currentScreen === 'proof' && selectedOrder && (
        <ProofOfDelivery 
          order={selectedOrder}
          onBack={() => setCurrentScreen('delivery')}
          isDarkMode={isDarkMode}
          onComplete={handleCompleteDelivery}
        />
      )}
    </div>
  );
}
