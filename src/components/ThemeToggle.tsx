import React from "react";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: (isDark: boolean) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      onClick={() => onToggle(!isDarkMode)}
      className={`
        relative w-16 h-8 rounded-full p-1 transition-all duration-300 transform hover:scale-105
        ${
          isDarkMode
            ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25"
            : "bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-400/25"
        }
      `}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
    >
      {/* Toggle Circle */}
      <div
        className={`
        w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center
        ${
          isDarkMode
            ? "transform translate-x-8 bg-gray-800 text-purple-300"
            : "transform translate-x-0 bg-white text-yellow-600"
        }
      `}
      >
        <span className="text-sm">{isDarkMode ? "🌙" : "☀️"}</span>
      </div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <span className="text-xs opacity-60">☀️</span>
        <span className="text-xs opacity-60">🌙</span>
      </div>
    </button>
  );
};

export default ThemeToggle;
