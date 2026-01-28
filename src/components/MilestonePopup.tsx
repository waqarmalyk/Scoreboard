import { useEffect } from 'react';

interface MilestonePopupProps {
  playerName: string;
  milestone: number;
  type: 'batsman' | 'bowler';
  onClose: () => void;
}

export const MilestonePopup = ({
  playerName,
  milestone,
  type,
  onClose,
}: MilestonePopupProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getMessage = () => {
    if (type === 'batsman') {
      if (milestone === 100) return '💯 Century!';
      if (milestone === 50) return '🎯 Half-Century!';
      if (milestone === 30) return '⭐ Great Start!';
    } else {
      if (milestone === 5) return '🔥 5-Wicket Haul!';
      if (milestone === 3) return '🎳 3 Wickets!';
    }
    return '';
  };

  const getSubMessage = () => {
    if (type === 'batsman') {
      return `${playerName} scored ${milestone} runs!`;
    } else {
      return `${playerName} took ${milestone} wickets!`;
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={onClose}
    >
      <div
        className='relative animate-bounce-in rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-1 shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='rounded-xl bg-gray-900 px-8 py-6 text-center'>
          <div className='mb-2 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300'>
            {getMessage()}
          </div>
          <div className='text-xl font-semibold text-white'>
            {getSubMessage()}
          </div>
          <button
            onClick={onClose}
            className='mt-4 rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
