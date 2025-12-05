import { Package, Truck } from 'lucide-react';
import logoImage from 'figma:asset/e345708a387e9c07d7fcf2098ea636e74d2ac868.png';

interface LoadingProps {
  message?: string;
  isDarkMode?: boolean;
}

export function Loading({ message = 'Loading...', isDarkMode = false }: LoadingProps) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="text-center">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative animate-bounce">
            <img 
              src={logoImage} 
              alt="Loading" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Animated circles around logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-4 border-purple-200 rounded-full animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Moving delivery truck animation */}
        <div className="relative h-16 mb-6 overflow-hidden">
          <div className="absolute left-0 w-full">
            <div className="animate-truck-drive">
              <Truck size={40} className="text-blue-600" />
            </div>
          </div>
          {/* Road line */}
          <div className="absolute bottom-4 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
            <div className="h-full bg-blue-600 animate-road-line"></div>
          </div>
        </div>

        {/* Loading text */}
        <p className={`text-xl mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          {message}
        </p>
        
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full animate-bounce ${
            isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
          }`} style={{ animationDelay: '0s' }}></div>
          <div className={`w-3 h-3 rounded-full animate-bounce ${
            isDarkMode ? 'bg-purple-400' : 'bg-purple-600'
          }`} style={{ animationDelay: '0.2s' }}></div>
          <div className={`w-3 h-3 rounded-full animate-bounce ${
            isDarkMode ? 'bg-blue-400' : 'bg-blue-600'
          }`} style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Spinning package */}
        <div className="mt-8 flex justify-center">
          <div className="animate-spin-slow">
            <Package size={32} className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
          </div>
        </div>
      </div>
    </div>
  );
}
