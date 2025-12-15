interface ScoreDisplayProps {
  totalRuns: number;
  wickets: number;
  oversDisplay: string;
  innings: 1 | 2;
  targetMode: boolean;
  target: number;
  runsRequired: number;
  ballsRemaining: number;
  runRate: string;
  requiredRunRate: string;
  theme: string;
  getGlassColor: () => string;
  getBorderColor: () => string;
  getTextColor: () => string;
  getTextColorLight: () => string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  totalRuns,
  wickets,
  oversDisplay,
  innings,
  targetMode,
  target,
  runsRequired,
  ballsRemaining,
  runRate,
  requiredRunRate,
  theme,
  getGlassColor,
  getBorderColor,
  getTextColor,
  getTextColorLight,
}) => {
  return (
    <div
      className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 mb-6`}
    >
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-end gap-2'>
          <span className={`text-6xl md:text-7xl font-bold ${getTextColor()}`}>
            {totalRuns}
          </span>
          <span
            className={`text-4xl md:text-5xl font-bold ${
              theme === 'white' ? 'text-gray-600' : 'text-white/70'
            }`}
          >
            /{wickets}
          </span>
        </div>
        <div className='bg-purple-500/40 backdrop-blur-md border border-purple-300/50 rounded-lg px-4 py-2'>
          <span className={`${getTextColor()} font-semibold`}>
            {innings === 1 ? '1st Innings' : '2nd Innings'}
          </span>
        </div>
      </div>
      <div className={`flex items-center gap-2 ${getTextColor()} mb-4`}>
        <span className={getTextColorLight()}>Overs:</span>
        <span className='text-2xl font-semibold'>{oversDisplay}</span>
      </div>
      {targetMode && (
        <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
          <div
            className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
          >
            <span className={`${getTextColorLight()} text-sm block mb-1`}>
              Target:
            </span>
            <span className={`${getTextColor()} font-bold text-lg`}>
              {target}
            </span>
          </div>
          <div
            className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
          >
            <span className={`${getTextColorLight()} text-sm block mb-1`}>
              Need:
            </span>
            <span className={`${getTextColor()} font-bold text-lg`}>
              {runsRequired > 0 ? runsRequired : 0} runs
            </span>
          </div>
          <div
            className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
          >
            <span className={`${getTextColorLight()} text-sm block mb-1`}>
              Balls Left:
            </span>
            <span className={`${getTextColor()} font-bold text-lg`}>
              {ballsRemaining}
            </span>
          </div>
          <div
            className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
          >
            <span className={`${getTextColorLight()} text-sm block mb-1`}>
              CRR:
            </span>
            <span className={`${getTextColor()} font-bold text-lg`}>
              {runRate}
            </span>
          </div>
          <div
            className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
          >
            <span className={`${getTextColorLight()} text-sm block mb-1`}>
              RRR:
            </span>
            <span className={`${getTextColor()} font-bold text-lg`}>
              {requiredRunRate}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
