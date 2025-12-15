import type { Ball } from '../types';

interface CurrentOverProps {
  currentOver: Ball[];
  legalBallsCount: number;
  theme: string;
  getGlassColor: () => string;
  getBorderColor: () => string;
  getTextColor: () => string;
  getBallDisplay: (ball: Ball) => string;
}

export const CurrentOver: React.FC<CurrentOverProps> = ({
  currentOver,
  legalBallsCount,
  theme,
  getGlassColor,
  getBorderColor,
  getTextColor,
  getBallDisplay,
}) => {
  return (
    <div
      className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 mb-6`}
    >
      <h3
        className={`text-xl font-semibold ${getTextColor()} mb-4 text-center`}
      >
        Current Over
      </h3>
      <div className='flex gap-4 justify-center flex-wrap'>
        {currentOver.map((ball, index) => (
          <div
            key={index}
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getTextColor()} border-2 ${
              ball.type === 'W'
                ? 'bg-red-500/70 border-red-300'
                : ball.type === '4'
                ? 'bg-blue-500/70 border-blue-300'
                : ball.type === '6'
                ? 'bg-green-500/70 border-green-300'
                : ball.type === 'WD' || ball.type === 'NB'
                ? 'bg-yellow-500/70 border-yellow-300'
                : ball.type === '0'
                ? 'bg-gray-500/70 border-gray-300'
                : 'bg-purple-500/70 border-purple-300'
            }`}
          >
            {getBallDisplay(ball)}
          </div>
        ))}
        {[...Array(6 - legalBallsCount)].map((_, i) => (
          <div
            key={`empty-${i}`}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              theme === 'white' ? 'text-gray-300' : 'text-white/30'
            } border-2 ${getBorderColor()} ${getGlassColor()}`}
          >
            -
          </div>
        ))}
      </div>
    </div>
  );
};
