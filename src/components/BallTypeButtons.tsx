import { useState } from 'react';
import type { BallType } from '../types';

interface BallTypeButtonsProps {
  onBallClick: (type: BallType, runs: number, batsmanRuns?: number) => void;
  onWicket: () => void;
  getTextColor: () => string;
  getTextColorLight: () => string;
  getGlassColor: () => string;
  getBorderColor: () => string;
  getPlaceholderColor: () => string;
}

export const BallTypeButtons: React.FC<BallTypeButtonsProps> = ({
  onBallClick,
  onWicket,
  getTextColor,
  getTextColorLight,
  getGlassColor,
  getBorderColor,
  getPlaceholderColor,
}) => {
  const [extraType, setExtraType] = useState<'WD' | 'NB' | 'WALL' | null>(null);
  const [extraRuns, setExtraRuns] = useState('');

  const handleAddExtra = () => {
    const runs = parseInt(extraRuns) || 0;

    if (!extraType) {
      // No WD/NB/WALL selected - treat as normal ball, runs go to batsman
      if (runs === 0) {
        alert('Please enter runs to add');
        return;
      }
      onBallClick(runs.toString() as BallType, runs);
    } else if (extraType === 'WALL') {
      // Wall - adds 1 run automatically (wall advantage) + batsman runs
      // Pass actual batsman runs (not total) as third param for correct rotation logic
      const totalRuns = runs + 1; // Wall (1) + batsman runs
      onBallClick(runs.toString() as BallType, totalRuns, runs);
    } else {
      // WD or NB with batsman runs
      const totalRuns = runs + 1; // Extra penalty + runs made by batsman
      onBallClick(extraType, totalRuns, runs);
    }

    setExtraType(null);
    setExtraRuns('');
  };

  return (
    <div className='backdrop-blur-md rounded-xl p-6 mb-6'>
      <h3
        className={`text-xl font-semibold ${getTextColor()} mb-4 text-center`}
      >
        Ball Types
      </h3>
      <div className='flex flex-wrap gap-4 justify-center'>
        <button
          className={`bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={() => onBallClick('0', 0)}
        >
          <div className='text-2xl font-bold leading-none'>0</div>
          <small className={`text-[0.6rem] ${getTextColorLight()} lowercase`}>
            dot
          </small>
        </button>
        <button
          className={`bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={() => onBallClick('1', 1)}
        >
          <div className='text-2xl font-bold leading-none'>1</div>
          <small className={`text-[0.6rem] ${getTextColorLight()} lowercase`}>
            run
          </small>
        </button>
        <button
          className={`bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={() => onBallClick('2', 2)}
        >
          <div className='text-2xl font-bold leading-none'>2</div>
          <small className={`text-[0.6rem] ${getTextColorLight()} lowercase`}>
            runs
          </small>
        </button>
        <button
          className={`bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={() => onBallClick('3', 3)}
        >
          <div className='text-2xl font-bold leading-none'>3</div>
          <small className={`text-[0.6rem] ${getTextColorLight()} lowercase`}>
            runs
          </small>
        </button>
        <button
          className={`bg-blue-500/50 backdrop-blur-md border-2 border-blue-300/50 hover:bg-blue-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={() => onBallClick('4', 4)}
        >
          <div className='text-2xl font-bold leading-none'>4</div>
          <small className={`text-[0.6rem] ${getTextColorLight()} lowercase`}>
            runs
          </small>
        </button>
        <button
          className={`bg-green-500/50 backdrop-blur-md border-2 border-green-300/50 hover:bg-green-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={() => onBallClick('6', 6)}
        >
          <div className='text-2xl font-bold leading-none'>6</div>
          <small className={`text-[0.6rem] ${getTextColorLight()} lowercase`}>
            runs
          </small>
        </button>
        <button
          className={`bg-red-500/50 backdrop-blur-md border-2 border-red-300/50 hover:bg-red-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={onWicket}
        >
          <div className='text-2xl font-bold leading-none'>W</div>
          <small className={`text-[0.6rem] ${getTextColorLight()} lowercase`}>
            wicket
          </small>
        </button>
        <button
          className={`bg-yellow-500/50 backdrop-blur-md border-2 border-yellow-300/50 hover:bg-yellow-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={() => onBallClick('WD', 1)}
        >
          <div className='text-xl font-bold leading-none'>WD</div>
          <small className={`text-[0.6rem] ${getTextColorLight()} lowercase`}>
            wide
          </small>
        </button>
        <button
          className={`bg-yellow-500/50 backdrop-blur-md border-2 border-yellow-300/50 hover:bg-yellow-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={() => onBallClick('NB', 1)}
        >
          <div className='text-xl font-bold leading-none'>NB</div>
          <small className={`text-[0.6rem] ${getTextColorLight()} lowercase`}>
            no ball
          </small>
        </button>
      </div>

      {/* Extras with additional runs */}
      <div
        className={`mt-6 ${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-4`}
      >
        <h4
          className={`text-sm font-semibold ${getTextColor()} mb-3 text-center`}
        >
          Add Runs (Optional: select type)
        </h4>
        <div className='flex flex-col md:flex-row items-center gap-3'>
          <div className='flex gap-2 flex-wrap'>
            <button
              className={`px-3 py-2 rounded-lg transition-all text-sm ${
                extraType === 'WALL'
                  ? 'bg-blue-500/70 border-2 border-blue-300'
                  : 'bg-blue-500/30 border border-blue-300/50'
              } ${getTextColor()}`}
              onClick={() => setExtraType(extraType === 'WALL' ? null : 'WALL')}
            >
              Wall
            </button>
            <button
              className={`px-3 py-2 rounded-lg transition-all text-sm ${
                extraType === 'WD'
                  ? 'bg-yellow-500/70 border-2 border-yellow-300'
                  : 'bg-yellow-500/30 border border-yellow-300/50'
              } ${getTextColor()}`}
              onClick={() => setExtraType(extraType === 'WD' ? null : 'WD')}
            >
              Wide
            </button>
            <button
              className={`px-3 py-2 rounded-lg transition-all text-sm ${
                extraType === 'NB'
                  ? 'bg-yellow-500/70 border-2 border-yellow-300'
                  : 'bg-yellow-500/30 border border-yellow-300/50'
              } ${getTextColor()}`}
              onClick={() => setExtraType(extraType === 'NB' ? null : 'NB')}
            >
              No Ball
            </button>
          </div>
          <div className='flex items-center gap-2 flex-1'>
            <span className={`${getTextColor()} text-sm`}>+</span>
            <input
              type='number'
              min='0'
              value={extraRuns}
              onChange={(e) => setExtraRuns(e.target.value)}
              placeholder='Runs'
              className={`w-20 ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
            />
            <span className={`${getTextColorLight()} text-xs`}>runs</span>
          </div>
          <button
            className='bg-green-500/50 hover:bg-green-500/70 border-2 border-green-300/50 rounded-lg px-6 py-2 font-semibold text-white transition-all'
            onClick={handleAddExtra}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
