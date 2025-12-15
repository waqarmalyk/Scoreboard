import type { PlayerStats, BowlerStats } from '../types';

interface StatisticsProps {
  batsmenStats: PlayerStats[];
  bowlerStats: BowlerStats[];
  theme: string;
  getGlassColor: () => string;
  getBorderColor: () => string;
  getTextColor: () => string;
  getTextColorLight: () => string;
}

export const Statistics: React.FC<StatisticsProps> = ({
  batsmenStats,
  bowlerStats,
  theme,
  getGlassColor,
  getBorderColor,
  getTextColor,
  getTextColorLight,
}) => {
  if (batsmenStats.length === 0 && bowlerStats.length === 0) return null;

  return (
    <div className='mb-6'>
      {[1, 2].map(
        (inning) =>
          (batsmenStats.filter((b) => b.innings === inning).length > 0 ||
            bowlerStats.filter((b) => b.innings === inning).length > 0) && (
            <div key={inning} className='w-full mb-6'>
              <h2
                className={`text-center ${getTextColor()} text-2xl md:text-3xl font-bold my-4`}
              >
                Innings {inning} Statistics
              </h2>
              <div className='flex gap-6 justify-center flex-wrap'>
                {batsmenStats.filter((b) => b.innings === inning).length >
                  0 && (
                  <div
                    className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 flex-1 min-w-[300px]`}
                  >
                    <h3
                      className={`text-xl font-semibold ${getTextColor()} mb-4`}
                    >
                      🏏 Batting
                    </h3>
                    <div className='overflow-x-auto'>
                      <div
                        className={`grid grid-cols-7 gap-2 ${getTextColorLight()} text-sm font-semibold mb-2 pb-2 border-b ${getBorderColor()}`}
                      >
                        <span className='col-span-2'>Batsman</span>
                        <span className='text-center'>Runs</span>
                        <span className='text-center'>Balls</span>
                        <span className='text-center'>4s</span>
                        <span className='text-center'>6s</span>
                        <span className='text-center'>SR</span>
                      </div>
                      {batsmenStats
                        .filter((b) => b.innings === inning)
                        .map((batsman, index) => (
                          <div
                            key={index}
                            className={`grid grid-cols-7 gap-2 ${getTextColor()} py-2 border-b ${
                              theme === 'white'
                                ? 'border-gray-900/10'
                                : 'border-white/10'
                            }`}
                          >
                            <span className='font-medium col-span-2'>
                              {batsman.name}
                            </span>
                            <span className='text-center'>{batsman.runs}</span>
                            <span className='text-center'>{batsman.balls}</span>
                            <span className='text-center'>{batsman.fours}</span>
                            <span className='text-center'>{batsman.sixes}</span>
                            <span className='text-center'>
                              {batsman.balls > 0
                                ? (
                                    (batsman.runs / batsman.balls) *
                                    100
                                  ).toFixed(1)
                                : '0.0'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {bowlerStats.filter((b) => b.innings === inning).length > 0 && (
                  <div
                    className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 flex-1 min-w-[300px]`}
                  >
                    <h3
                      className={`text-xl font-semibold ${getTextColor()} mb-4`}
                    >
                      ⚾ Bowling
                    </h3>
                    <div className='overflow-x-auto'>
                      <div
                        className={`grid grid-cols-6 gap-2 ${getTextColorLight()} text-sm font-semibold mb-2 pb-2 border-b ${getBorderColor()}`}
                      >
                        <span className='col-span-2'>Bowler</span>
                        <span className='text-center'>Overs</span>
                        <span className='text-center'>Runs</span>
                        <span className='text-center'>Wickets</span>
                        <span className='text-center'>Econ</span>
                      </div>
                      {bowlerStats
                        .filter((b) => b.innings === inning)
                        .map((bowler, index) => (
                          <div
                            key={index}
                            className={`grid grid-cols-6 gap-2 ${getTextColor()} py-2 border-b ${
                              theme === 'white'
                                ? 'border-gray-900/10'
                                : 'border-white/10'
                            }`}
                          >
                            <span className='font-medium col-span-2'>
                              {bowler.name}
                            </span>
                            <span className='text-center'>
                              {Math.floor(bowler.balls / 6)}.{bowler.balls % 6}
                            </span>
                            <span className='text-center'>
                              {bowler.runsConceded}
                            </span>
                            <span className='text-center'>
                              {bowler.wickets}
                            </span>
                            <span className='text-center'>
                              {bowler.balls > 0
                                ? (
                                    bowler.runsConceded /
                                    (bowler.balls / 6)
                                  ).toFixed(2)
                                : '0.00'}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
      )}
    </div>
  );
};
