import { ArrowLeft, Bell, Package, AlertCircle, Info, Trash2 } from 'lucide-react';
import type { Notification } from '../App';

interface NotificationsProps {
  notifications: Notification[];
  onBack: () => void;
  onMarkAsRead: (id: string) => void;
  isDarkMode: boolean;
}

export function Notifications({ notifications, onBack, onMarkAsRead, isDarkMode }: NotificationsProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'assignment':
        return Package;
      case 'alert':
        return AlertCircle;
      case 'update':
        return Info;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-100 text-blue-600';
      case 'alert':
        return 'bg-red-100 text-red-600';
      case 'update':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

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
            <h1 className="mb-1">Notifications</h1>
            <p className="text-blue-100">{unreadCount} unread</p>
          </div>
          <button className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <Bell size={24} />
          </button>
        </div>
      </div>

      <div className="p-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-800 mb-2">No Notifications</p>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const iconColor = getIconColor(notification.type);

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm transition-all ${
                    !notification.read ? 'ring-2 ring-blue-200' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`${iconColor} p-3 rounded-xl h-fit`}>
                      <Icon size={24} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <p className={`${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="bg-blue-600 w-2 h-2 rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">{formatTime(notification.timestamp)}</span>
                        
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="text-blue-600 hover:underline"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-6">
          <h2 className="text-gray-800 mb-4">Notification Settings</h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">New Assignments</p>
                <p className="text-gray-500">Get notified of new parcel assignments</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">Delivery Updates</p>
                <p className="text-gray-500">Status changes and customer messages</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">Payment Alerts</p>
                <p className="text-gray-500">Payment collection reminders</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800">Push Notifications</p>
                <p className="text-gray-500">Receive push notifications on device</p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}