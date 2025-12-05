import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-700' 
          : 'bg-gray-200'
      }`}
      aria-label="Toggle dark mode"
    >
      {/* Track icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun 
          size={14} 
          className={`transition-opacity ${
            isDarkMode ? 'opacity-40 text-gray-400' : 'opacity-0'
          }`}
        />
        <Moon 
          size={14} 
          className={`transition-opacity ${
            isDarkMode ? 'opacity-0' : 'opacity-40 text-gray-500'
          }`}
        />
      </div>
      
      {/* Toggle circle */}
      <div
        className={`absolute top-0.5 left-0.5 w-7 h-7 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 ${
          isDarkMode ? 'translate-x-8' : 'translate-x-0'
        }`}
      >
        {isDarkMode ? (
          <Moon size={16} className="text-slate-700" />
        ) : (
          <Sun size={16} className="text-amber-500" />
        )}
      </div>
    </button>
  );
}
