import { useState, useEffect } from 'react';
import type { ThemeColor } from '../types';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeColor>(
    () => (localStorage.getItem('theme') as ThemeColor) || 'black'
  );

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const getThemeBg = () => {
    const gradients: Record<ThemeColor, string> = {
      purple: 'from-purple-600 via-violet-600 to-purple-700',
      teal: 'from-teal-400 via-cyan-500 to-blue-500',
      emerald: 'from-emerald-500 via-green-600 to-teal-600',
      rose: 'from-rose-500 via-pink-600 to-red-600',
      blue: 'from-blue-600 via-indigo-600 to-purple-700',
      orange: 'from-orange-500 via-amber-600 to-yellow-500',
      pink: 'from-pink-500 via-fuchsia-600 to-purple-600',
      black: 'from-gray-900 via-gray-800 to-black',
      white: 'from-gray-100 via-gray-50 to-white',
    };
    return gradients[theme];
  };

  const getTextColor = () =>
    theme === 'white' ? 'text-gray-900' : 'text-white';
  const getTextColorLight = () =>
    theme === 'white' ? 'text-gray-700' : 'text-white/80';
  const getPlaceholderColor = () =>
    theme === 'white' ? 'placeholder-gray-400' : 'placeholder-white/50';
  const getGlassColor = () =>
    theme === 'white' ? 'bg-gray-900/10' : 'bg-white/10';
  const getBorderColor = () =>
    theme === 'white' ? 'border-gray-900/20' : 'border-white/20';

  return {
    theme,
    setTheme,
    getThemeBg,
    getTextColor,
    getTextColorLight,
    getPlaceholderColor,
    getGlassColor,
    getBorderColor,
  };
};
