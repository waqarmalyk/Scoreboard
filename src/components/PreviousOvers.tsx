import type { Ball } from '../types';

interface PreviousOversProps {
  allOvers: Ball[][];
  theme: string;
  getGlassColor: () => string;
  getBorderColor: () => string;
  getTextColor: () => string;
  getTextColorLight: () => string;
  getBallDisplay: (ball: Ball) => string;
}

export const PreviousOvers: React.FC<PreviousOversProps> = ({
  allOvers,
  theme,
  getGlassColor,
  getBorderColor,
  getTextColor,
  getTextColorLight,
  getBallDisplay,
}) => {
  if (allOvers.length === 0) return null;

  return (
    <div
      className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 mb-6`}
    >
      <h3 className={`text-xl font-semibold ${getTextColor()} mb-4`}>
        Previous Overs
      </h3>
      <div className='space-y-3'>
        {allOvers.map((over, overIndex) => (
          <div
            key={overIndex}
            className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
          >
            <span className={`${getTextColorLight()} font-semibold`}>
              Over {overIndex + 1}:
            </span>
            <div className='flex gap-2 flex-wrap my-2'>
              {over.map((ball, ballIndex) => (
                <span
                  key={ballIndex}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getTextColor()} ${
                    ball.type === 'W'
                      ? 'bg-red-500/70'
                      : ball.type === '4'
                      ? 'bg-blue-500/70'
                      : ball.type === '6'
                      ? 'bg-green-500/70'
                      : ball.type === 'WD' || ball.type === 'NB'
                      ? 'bg-yellow-500/70'
                      : ball.type === '0'
                      ? 'bg-gray-500/70'
                      : 'bg-purple-500/70'
                  }`}
                >
                  {getBallDisplay(ball)}
                </span>
              ))}
            </div>
            <span
              className={`${
                theme === 'white' ? 'text-gray-500' : 'text-white/60'
              } text-sm`}
            >
              ({over.reduce((sum, ball) => sum + ball.runs, 0)} runs)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
