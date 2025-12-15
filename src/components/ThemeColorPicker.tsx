import { useState } from 'react';
import type { ThemeColor } from '../types';

interface ThemeColorPickerProps {
  theme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
  getTextColor: () => string;
  getGlassColor: () => string;
  getBorderColor: () => string;
}

export const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({
  theme,
  onThemeChange,
  getTextColor,
  getGlassColor,
  getBorderColor,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const changeTheme = (newTheme: ThemeColor) => {
    onThemeChange(newTheme);
    setShowColorPicker(false);
  };

  return (
    <div className='fixed right-4 top-1/2 -translate-y-1/2 z-50'>
      <button
        onClick={() => setShowColorPicker(!showColorPicker)}
        className={`${getGlassColor()} backdrop-blur-md ${getTextColor()} rounded-full w-14 h-14 flex items-center justify-center shadow-2xl border-2 ${getBorderColor()} ${
          theme === 'white' ? 'hover:bg-gray-900/20' : 'hover:bg-white/30'
        } transition-all duration-300 hover:scale-110 text-2xl`}
        title='Change Theme'
      >
        🎨
      </button>
      {showColorPicker && (
        <div className='absolute right-16 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/40 min-w-[200px] max-h-[70vh] overflow-y-auto'>
          <h3 className='text-gray-800 font-bold mb-3 text-sm'>Choose Theme</h3>
          <div className='flex flex-col gap-2'>
            {[
              {
                name: 'Purple',
                value: 'purple' as ThemeColor,
                gradient: 'from-purple-600 via-violet-600 to-purple-700',
              },
              {
                name: 'Teal',
                value: 'teal' as ThemeColor,
                gradient: 'from-teal-400 via-cyan-500 to-blue-500',
              },
              {
                name: 'Emerald',
                value: 'emerald' as ThemeColor,
                gradient: 'from-emerald-500 via-green-600 to-teal-600',
              },
              {
                name: 'Rose',
                value: 'rose' as ThemeColor,
                gradient: 'from-rose-500 via-pink-600 to-red-600',
              },
              {
                name: 'Blue',
                value: 'blue' as ThemeColor,
                gradient: 'from-blue-600 via-indigo-600 to-purple-700',
              },
              {
                name: 'Orange',
                value: 'orange' as ThemeColor,
                gradient: 'from-orange-500 via-amber-600 to-yellow-500',
              },
              {
                name: 'Pink',
                value: 'pink' as ThemeColor,
                gradient: 'from-pink-500 via-fuchsia-600 to-purple-600',
              },
              {
                name: 'Black',
                value: 'black' as ThemeColor,
                gradient: 'from-gray-900 via-gray-800 to-black',
              },
              {
                name: 'White',
                value: 'white' as ThemeColor,
                gradient: 'from-gray-100 via-gray-50 to-white',
              },
            ].map((color) => (
              <button
                key={color.value}
                onClick={() => changeTheme(color.value)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                  theme === color.value
                    ? 'bg-gradient-to-r ' + color.gradient + ' text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${color.gradient}`}
                ></div>
                <span className='font-semibold text-sm'>{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
