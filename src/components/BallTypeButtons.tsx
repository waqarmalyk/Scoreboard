import { useState } from 'react';
import type { BallType } from '../types';
import { createPortal } from 'react-dom';
import { ExtraModal } from './ExtraModal';

interface BallTypeButtonsProps {
  onBallClick: (type: BallType, runs: number, batsmanRuns?: number) => void;
  onWicket: () => void;
  onRunOutWithRuns: (runs: number) => void;
  getTextColor: () => string;
  getTextColorLight: () => string;
  getGlassColor: () => string;
  getBorderColor: () => string;
  getPlaceholderColor: () => string;
}

export const BallTypeButtons: React.FC<BallTypeButtonsProps> = ({
  onBallClick,
  onWicket,
  onRunOutWithRuns,
  getTextColor,
  getTextColorLight,
  getGlassColor,
  getBorderColor,
}) => {
  const [extraModalOpen, setExtraModalOpen] = useState(false);

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
            boundary
          </small>
        </button>
        <button
          className={`bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={() => onBallClick('5', 5)}
        >
          <div className='text-2xl font-bold leading-none'>5</div>
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
            six
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
        <button
          className={`bg-yellow-500/50 backdrop-blur-md border-2 border-yellow-300/50 hover:bg-yellow-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
          onClick={() => setExtraModalOpen(true)}
        >
          <div className='text-xl font-bold leading-none'>➕</div>
          <small className={`text-[0.6rem] ${getTextColorLight()} lowercase`}>
            extra
          </small>
        </button>
      </div>

      {extraModalOpen &&
        createPortal(
          <ExtraModal
            onConfirm={(type, totalRuns, batsmanRuns) => {
              setExtraModalOpen(false);
              onBallClick(type, totalRuns, batsmanRuns);
            }}
            onRunOut={(runs) => {
              setExtraModalOpen(false);
              onRunOutWithRuns(runs);
            }}
            onCancel={() => setExtraModalOpen(false)}
            getTextColor={getTextColor}
            getGlassColor={getGlassColor}
            getBorderColor={getBorderColor}
          />,
          document.body,
        )}
    </div>
  );
};
