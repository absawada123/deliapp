import { Package, TrendingUp, Clock, CheckCircle, Bell, MapPin, ChevronRight, BarChart3, Zap, Award, Target, Calendar } from 'lucide-react';
import type { Order } from '../App';
import { ThemeToggle } from './ThemeToggle';
import logoImage from 'figma:asset/2c80fe371af073855897a965d933e368be13c551.png';
import { useState, useEffect } from 'react';

interface DashboardProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onNavigateToAssignments: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToAnalytics: () => void;
  unreadNotifications: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Dashboard({ orders, onSelectOrder, onNavigateToAssignments, onNavigateToNotifications, onNavigateToAnalytics, unreadNotifications, isDarkMode, onToggleDarkMode }: DashboardProps) {
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showWelcome, setShowWelcome] = useState(true);

  const activeOrders = orders.filter(o => !['completed', 'pending'].includes(o.status));
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const completedToday = orders.filter(o => o.status === 'completed').length;
  const totalEarnings = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.totalAmount * 0.15), 0);

  // Set greeting based on time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Hide welcome animation after 3 seconds
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(timeInterval);
    };
  }, []);

  // Calculate daily goal progress
  const dailyGoal = 10;
  const goalProgress = Math.min((completedToday / dailyGoal) * 100, 100);

  // Calculate streak (mock data - would come from backend)
  const currentStreak = 5;

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Welcome Animation Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 z-50 flex items-center justify-center animate-fade-out" style={{ animation: 'fadeOut 1s ease-in-out 2s forwards' }}>
          <div className="text-center text-white animate-bounce">
            <img 
              src={logoImage} 
              alt="Logo" 
              className="w-24 h-24 mx-auto mb-4 animate-pulse"
            />
            <h1 className="text-3xl mb-2">Welcome Back!</h1>
            <p className="text-blue-200">Let{"'"}s make today great 🚀</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-white p-6 rounded-b-3xl relative overflow-hidden" style={{ background: 'linear-gradient(to right, #0A1E3E, #003D7A)' }}>
        {/* Animated Background Circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={logoImage} 
                  alt="Rider Logo" 
                  className="w-14 h-14 object-contain bg-white rounded-xl p-1 shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h1 className="mb-1 text-xl">{greeting},</h1>
                <p className="text-blue-100 text-lg">Juan Rider 👋</p>
                <p className="text-blue-200 text-xs mt-1">
                  {currentTime.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })} • {currentTime.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
              <button 
                onClick={onNavigateToNotifications}
                className="relative bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all hover:scale-110 active:scale-95"
              >
                <Bell size={24} className={unreadNotifications > 0 ? 'animate-bounce' : ''} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Streak Counter */}
          <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-amber-400/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 p-2 rounded-xl">
                  <Zap size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-xl">{currentStreak} Day Streak! 🔥</p>
                  <p className="text-amber-100 text-sm">Keep it going!</p>
                </div>
              </div>
              <Award size={32} className="text-amber-300 animate-pulse" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Package size={20} className="animate-pulse" />
                <span className="text-blue-100 text-sm">Active</span>
              </div>
              <p className="text-4xl mb-1">{activeOrders.length}</p>
              <p className="text-blue-200 text-xs">In progress</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-300" />
                <span className="text-blue-100 text-sm">Today</span>
              </div>
              <p className="text-4xl mb-1">{completedToday}</p>
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-green-400 h-full transition-all duration-500"
                  style={{ width: `${goalProgress}%` }}
                ></div>
              </div>
              <p className="text-blue-200 text-xs mt-1">{completedToday}/{dailyGoal} goal</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/30 to-emerald-500/30 backdrop-blur-sm rounded-2xl p-4 hover:scale-105 transition-all cursor-pointer border border-green-400/40">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-green-300" />
                <span className="text-green-100 text-sm">Earnings</span>
              </div>
              <p className="text-4xl mb-1">₱{totalEarnings.toFixed(0)}</p>
              <p className="text-green-200 text-xs">+₱{(totalEarnings * 0.15).toFixed(0)} bonus</p>
            </div>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 hover:bg-white/30 transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className={pendingOrders.length > 0 ? 'text-amber-300 animate-pulse' : ''} />
                <span className="text-blue-100 text-sm">Pending</span>
              </div>
              <p className="text-4xl mb-1">{pendingOrders.length}</p>
              <p className="text-blue-200 text-xs">New assignments</p>
            </div>
          </div>

          {/* Daily Goal Progress */}
          {completedToday > 0 && (
            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target size={18} />
                  <span className="text-sm">Daily Goal Progress</span>
                </div>
                <span className="text-sm">{Math.round(goalProgress)}%</span>
              </div>
              <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${goalProgress}%` }}
                ></div>
              </div>
              <p className="text-blue-200 text-xs mt-2">
                {completedToday >= dailyGoal 
                  ? '🎉 Goal achieved! Outstanding work!' 
                  : `${dailyGoal - completedToday} more to reach your goal!`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Assignments Alert */}
      {pendingOrders.length > 0 && (
        <div className="mx-4 mt-4">
          <button
            onClick={onNavigateToAssignments}
            className={`w-full border-2 border-amber-200 rounded-2xl p-4 flex items-center justify-between hover:bg-amber-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
              isDarkMode ? 'bg-amber-900/30 dark:border-amber-800' : 'bg-amber-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 text-white p-3 rounded-xl animate-pulse shadow-lg shadow-amber-500/50">
                <Package size={24} />
              </div>
              <div className="text-left">
                <p className={`text-lg ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
                  {pendingOrders.length} New Assignment{pendingOrders.length > 1 ? 's' : ''} 🚨
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                  Tap to view and accept
                </p>
              </div>
            </div>
            <ChevronRight className="text-amber-600 animate-bounce" size={24} />
          </button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="px-4 mt-4">
        <h3 className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={onNavigateToAssignments}
            className={`rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="bg-blue-100 p-3 rounded-xl">
              <Package size={24} className="text-blue-600" />
            </div>
            <span className={`text-xs text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Assignments
            </span>
          </button>

          <button
            onClick={onNavigateToAnalytics}
            className={`rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="bg-purple-100 p-3 rounded-xl">
              <BarChart3 size={24} className="text-purple-600" />
            </div>
            <span className={`text-xs text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Analytics
            </span>
          </button>

          <button
            onClick={onNavigateToNotifications}
            className={`rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="bg-red-100 p-3 rounded-xl relative">
              <Bell size={24} className="text-red-600" />
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </div>
            <span className={`text-xs text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Notifications
            </span>
          </button>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Active Deliveries</h2>
          <span className={`px-3 py-1 rounded-full text-sm ${
            activeOrders.length > 0 
              ? 'bg-blue-100 text-blue-700' 
              : isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
          }`}>
            {activeOrders.length} orders
          </span>
        </div>

        {activeOrders.length === 0 ? (
          <div className={`rounded-2xl p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Package size={32} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <p className={`mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No active deliveries</p>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Check new assignments to get started</p>
            {pendingOrders.length > 0 && (
              <button
                onClick={onNavigateToAssignments}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
              >
                View {pendingOrders.length} Pending Assignment{pendingOrders.length > 1 ? 's' : ''}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => onSelectOrder(order)}
                className={`w-full rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all text-left hover:scale-[1.02] active:scale-[0.98] border-2 border-transparent hover:border-blue-400 ${
                  isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className={`mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{order.id}</p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{order.customerName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm animate-pulse ${
                    ['en_route_delivery', 'arrived_delivery'].includes(order.status)
                      ? 'bg-blue-100 text-blue-700'
                      : ['en_route_pickup', 'arrived_pickup'].includes(order.status)
                      ? 'bg-purple-100 text-purple-700'
                      : order.status === 'picked_up'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-start gap-2 mb-3">
                  <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                  <p className={`line-clamp-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{order.deliveryAddress}</p>
                </div>

                <div className={`flex items-center justify-between pt-3 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <div className={`flex items-center gap-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {order.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {order.estimatedTime}
                    </span>
                  </div>
                  <span className={`text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>₱{order.totalAmount.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Completed Today */}
      {completedToday > 0 && (
        <div className="px-4 pb-4">
          <h2 className={`mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Completed Today</h2>
          <div className={`rounded-2xl p-5 border-2 hover:scale-[1.02] transition-all cursor-pointer ${
            isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 text-white p-3 rounded-xl shadow-lg shadow-green-500/50">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <p className={`text-xl ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
                    {completedToday} Deliveries Completed 🎉
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    Great job today! Keep it up!
                  </p>
                </div>
              </div>
              <ChevronRight className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}