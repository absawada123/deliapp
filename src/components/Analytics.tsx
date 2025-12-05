import { useState } from 'react';
import { ArrowLeft, TrendingUp, Package, DollarSign, Clock, MapPin, Star, Award, Calendar, ChevronRight, Target } from 'lucide-react';

interface AnalyticsProps {
  onBack: () => void;
  isDarkMode: boolean;
}

export function Analytics({ onBack, isDarkMode }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Mock analytics data
  const weeklyData = [
    { day: 'Mon', deliveries: 12, earnings: 1800 },
    { day: 'Tue', deliveries: 15, earnings: 2250 },
    { day: 'Wed', deliveries: 10, earnings: 1500 },
    { day: 'Thu', deliveries: 18, earnings: 2700 },
    { day: 'Fri', deliveries: 20, earnings: 3000 },
    { day: 'Sat', deliveries: 25, earnings: 3750 },
    { day: 'Sun', deliveries: 14, earnings: 2100 }
  ];

  const stats = {
    totalDeliveries: 114,
    totalEarnings: 17100,
    averageRating: 4.8,
    successRate: 98,
    totalDistance: 456,
    averageTime: 18,
    onTimeRate: 95,
    topCustomerRating: 5.0
  };

  const achievements = [
    { title: '100 Deliveries', icon: Package, unlocked: true, color: 'blue' },
    { title: 'Fast Rider', icon: Clock, unlocked: true, color: 'green' },
    { title: '5 Star Rating', icon: Star, unlocked: true, color: 'yellow' },
    { title: 'Distance Master', icon: MapPin, unlocked: false, color: 'purple' }
  ];

  const maxDeliveries = Math.max(...weeklyData.map(d => d.deliveries));
  const maxEarnings = Math.max(...weeklyData.map(d => d.earnings));

  return (
    <div className={`min-h-screen pb-20 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
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
            <h1 className="mb-1">Analytics</h1>
            <p className="text-blue-100">Performance Overview</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 bg-white/20 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                selectedPeriod === 'week' 
                  ? 'bg-white text-blue-600' 
                  : 'text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                selectedPeriod === 'month' 
                  ? 'bg-white text-blue-600' 
                  : 'text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                selectedPeriod === 'year' 
                  ? 'bg-white text-blue-600' 
                  : 'text-white'
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total Deliveries */}
          <div className="rounded-2xl p-4 text-white" style={{ 
            background: isDarkMode ? 'linear-gradient(to bottom right, #003D7A, #0A1E3E)' : 'linear-gradient(to bottom right, #003D7A, #0A1E3E)'
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Package size={20} />
              <span className="text-blue-100">Deliveries</span>
            </div>
            <p className="text-3xl mb-1">{stats.totalDeliveries}</p>
            <div className="flex items-center gap-1 text-blue-200">
              <TrendingUp size={14} />
              <span className="text-sm">+12% from last week</span>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="rounded-2xl p-4 text-white" style={{ 
            background: isDarkMode ? 'linear-gradient(to bottom right, #E81E1E, #FF5A5F)' : 'linear-gradient(to bottom right, #E81E1E, #FF5A5F)'
          }}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} />
              <span className="opacity-90">Earnings</span>
            </div>
            <p className="text-3xl mb-1">₱{stats.totalEarnings.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-red-100">
              <TrendingUp size={14} />
              <span className="text-sm">+8% from last week</span>
            </div>
          </div>

          {/* Average Rating */}
          <div className="rounded-2xl p-4 text-white" style={{ 
            background: isDarkMode ? 'linear-gradient(to bottom right, #FF5A5F, #E81E1E)' : 'linear-gradient(to bottom right, #FF5A5F, #E81E1E)'
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Star size={20} />
              <span className="opacity-90">Rating</span>
            </div>
            <p className="text-3xl mb-1">{stats.averageRating}</p>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} fill="white" className="text-white" />
              ))}
            </div>
          </div>

          {/* Success Rate */}
          <div className="rounded-2xl p-4 text-white" style={{ 
            background: isDarkMode ? 'linear-gradient(to bottom right, #0A1E3E, #003D7A)' : 'linear-gradient(to bottom right, #0A1E3E, #003D7A)'
          }}>
            <div className="flex items-center gap-2 mb-2">
              <Award size={20} />
              <span className="opacity-90">Success</span>
            </div>
            <p className="text-3xl mb-1">{stats.successRate}%</p>
            <p className="opacity-90 text-sm">On-time delivery</p>
          </div>
        </div>

        {/* Deliveries Chart */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Deliveries This Week</h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>114 total</p>
          </div>

          {/* Bar Chart */}
          <div className="space-y-3">
            {weeklyData.map((data, index) => (
              <div key={data.day}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{data.day}</span>
                  <span className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{data.deliveries}</span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
                    style={{ width: `${(data.deliveries / maxDeliveries) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Chart */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Earnings This Week</h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>₱{stats.totalEarnings.toLocaleString()}</p>
          </div>

          {/* Area Chart Simulation */}
          <div className="relative h-32">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="earningsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Area */}
              <path
                d={`M 0 ${128 - (weeklyData[0].earnings / maxEarnings * 100)} ${weeklyData.map((d, i) => 
                  `L ${(i / (weeklyData.length - 1)) * 100}% ${128 - (d.earnings / maxEarnings * 100)}`
                ).join(' ')} L 100% 128 L 0 128 Z`}
                fill="url(#earningsGradient)"
              />
              
              {/* Line */}
              <path
                d={`M 0 ${128 - (weeklyData[0].earnings / maxEarnings * 100)} ${weeklyData.map((d, i) => 
                  `L ${(i / (weeklyData.length - 1)) * 100}% ${128 - (d.earnings / maxEarnings * 100)}`
                ).join(' ')}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Points */}
              {weeklyData.map((d, i) => (
                <circle
                  key={i}
                  cx={`${(i / (weeklyData.length - 1)) * 100}%`}
                  cy={128 - (d.earnings / maxEarnings * 100)}
                  r="4"
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2">
            {weeklyData.map(data => (
              <span key={data.day} className={`text-xs ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>{data.day}</span>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <h2 className={`mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Performance Metrics</h2>
          
          <div className="space-y-4">
            {/* Total Distance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Total Distance</span>
                </div>
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{stats.totalDistance} km</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{ width: '91%' }}
                ></div>
              </div>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>91% of 500km monthly goal</p>
            </div>

            {/* Average Delivery Time */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-green-600" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Avg. Delivery Time</span>
                </div>
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{stats.averageTime} min</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-full bg-green-600 transition-all duration-500"
                  style={{ width: '75%' }}
                ></div>
              </div>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>25% faster than average</p>
            </div>

            {/* On-Time Rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-purple-600" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>On-Time Delivery</span>
                </div>
                <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{stats.onTimeRate}%</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div 
                  className="h-full bg-purple-600 transition-all duration-500"
                  style={{ width: `${stats.onTimeRate}%` }}
                ></div>
              </div>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Excellent performance!</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={isDarkMode ? 'text-gray-100' : 'text-gray-800'}>Achievements</h2>
            <button className="text-blue-600 hover:underline">View All</button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              const backgroundColors = {
                blue: achievement.unlocked ? '#003D7A' : '#9ca3af',
                green: achievement.unlocked ? '#E81E1E' : '#9ca3af',
                yellow: achievement.unlocked ? '#FF5A5F' : '#9ca3af',
                purple: achievement.unlocked ? '#0A1E3E' : '#9ca3af'
              };

              return (
                <div
                  key={index}
                  className="rounded-xl p-4 text-white text-center relative overflow-hidden"
                  style={{ background: backgroundColors[achievement.color as keyof typeof backgroundColors] }}
                >
                  {!achievement.unlocked && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-xs">Locked</span>
                    </div>
                  )}
                  <Icon size={32} className="mx-auto mb-2" />
                  <p className="text-sm">{achievement.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="rounded-2xl p-4 text-white" style={{ 
          background: isDarkMode ? 'linear-gradient(to bottom right, #E81E1E, #FF5A5F)' : 'linear-gradient(to bottom right, #E81E1E, #FF5A5F)'
        }}>
          <div className="flex items-center justify-between mb-3">
            <h3>Weekly Goal</h3>
            <Award size={24} />
          </div>
          
          <p className="text-3xl mb-2">114 / 120</p>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
            <div 
              className="h-full bg-white transition-all duration-500"
              style={{ width: '95%' }}
            ></div>
          </div>
          <p className="opacity-90">6 more deliveries to reach your goal!</p>
        </div>

        {/* Detailed Stats */}
        <div className={`rounded-2xl p-4 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <h2 className={`mb-4 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Detailed Statistics</h2>
          
          <div className="space-y-3">
            <button className={`w-full flex items-center justify-between p-3 rounded-xl ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
            } transition-colors`}>
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-600" size={20} />
                <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>Monthly Report</span>
              </div>
              <ChevronRight className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} size={20} />
            </button>

            <button className={`w-full flex items-center justify-between p-3 rounded-xl ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
            } transition-colors`}>
              <div className="flex items-center gap-3">
                <TrendingUp className="text-green-600" size={20} />
                <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>Performance Trends</span>
              </div>
              <ChevronRight className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} size={20} />
            </button>

            <button className={`w-full flex items-center justify-between p-3 rounded-xl ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
            } transition-colors`}>
              <div className="flex items-center gap-3">
                <DollarSign className="text-purple-600" size={20} />
                <span className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>Earnings Breakdown</span>
              </div>
              <ChevronRight className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}