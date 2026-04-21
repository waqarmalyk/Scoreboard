import { useState } from 'react';
import type { BallType } from '../types';

interface ExtraOption {
  label: string;
  emoji: string;
  type: BallType | 'LB';
  totalRuns: number;
  batsmanRuns: number;
}

interface ExtraModalProps {
  onConfirm: (type: BallType, totalRuns: number, batsmanRuns?: number) => void;
  onRunOut: (runsCompleted: number) => void;
  onCancel: () => void;
  getTextColor: () => string;
  getGlassColor: () => string;
  getBorderColor: () => string;
}

const SECTIONS: {
  heading: string;
  activeColor: string;
  options: ExtraOption[];
}[] = [
  {
    heading: '🚫 No Ball',
    activeColor: 'bg-orange-500/70 border-orange-300 scale-105 shadow-lg',
    options: [
      { label: 'NB+1', emoji: '1', type: 'NB', totalRuns: 2, batsmanRuns: 1 },
      { label: 'NB+2', emoji: '2', type: 'NB', totalRuns: 3, batsmanRuns: 2 },
      { label: 'NB+3', emoji: '3', type: 'NB', totalRuns: 4, batsmanRuns: 3 },
      { label: 'NB+4', emoji: '4', type: 'NB', totalRuns: 5, batsmanRuns: 4 },
      { label: 'NB+6', emoji: '6', type: 'NB', totalRuns: 7, batsmanRuns: 6 },
    ],
  },
  {
    heading: '↔️ Wide',
    activeColor: 'bg-yellow-500/70 border-yellow-300 scale-105 shadow-lg',
    options: [
      { label: 'WD', emoji: '↔️', type: 'WD', totalRuns: 1, batsmanRuns: 0 },
    ],
  },
  {
    heading: '➕ Extra',
    activeColor: 'bg-blue-500/70 border-blue-300 scale-105 shadow-lg',
    options: [
      { label: '1', emoji: '1', type: 'LB', totalRuns: 1, batsmanRuns: 0 },
      { label: '2', emoji: '2', type: 'LB', totalRuns: 2, batsmanRuns: 0 },
      { label: '3', emoji: '3', type: 'LB', totalRuns: 3, batsmanRuns: 0 },
      { label: '4', emoji: '4', type: 'LB', totalRuns: 4, batsmanRuns: 0 },
      { label: '5', emoji: '5', type: 'LB', totalRuns: 5, batsmanRuns: 0 },
      { label: '6', emoji: '6', type: 'LB', totalRuns: 6, batsmanRuns: 0 },
    ],
  },
];

export const ExtraModal: React.FC<ExtraModalProps> = ({
  onConfirm,
  onRunOut,
  onCancel,
  getTextColor,
  getGlassColor,
  getBorderColor,
}) => {
  const [selected, setSelected] = useState<ExtraOption | null>(null);
  const [selectedRunOut, setSelectedRunOut] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedRunOut !== null) {
      onRunOut(selectedRunOut);
      return;
    }
    if (!selected) return;
    if (selected.type === 'LB') {
      onConfirm(
        selected.totalRuns.toString() as BallType,
        selected.totalRuns,
        undefined,
      );
    } else {
      onConfirm(
        selected.type as BallType,
        selected.totalRuns,
        selected.batsmanRuns > 0 ? selected.batsmanRuns : undefined,
      );
    }
  };

  const canConfirm = selected !== null || selectedRunOut !== null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div
        className={`${getGlassColor()} backdrop-blur-xl rounded-2xl border ${getBorderColor()} shadow-2xl p-6 w-full max-w-md`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='text-center mb-5'>
          <div className='text-4xl mb-1'>➕</div>
          <h2 className={`text-xl font-bold ${getTextColor()}`}>Extra</h2>
          <p className={`text-sm mt-1 opacity-70 ${getTextColor()}`}>
            Select the extra type
          </p>
        </div>

        {/* Option sections */}
        <div className='space-y-4 mb-5'>
          {SECTIONS.map((section) => (
            <div key={section.heading}>
              <p
                className={`text-xs font-semibold uppercase tracking-wide mb-2 opacity-60 ${getTextColor()}`}
              >
                {section.heading}
              </p>
              <div className='grid grid-cols-3 gap-2'>
                {section.options.map((opt) => {
                  const isSelected =
                    selectedRunOut === null &&
                    selected?.label === opt.label &&
                    selected?.type === opt.type;
                  return (
                    <button
                      key={`${opt.type}-${opt.label}`}
                      onClick={() => {
                        setSelected(opt);
                        setSelectedRunOut(null);
                      }}
                      className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-3 px-2 transition-all duration-150 font-semibold text-sm
                        ${isSelected ? section.activeColor : 'bg-white/10 border-white/20 hover:bg-white/20'}
                        ${getTextColor()}`}
                    >
                      <span className='text-xl'>{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Run Out section */}
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wide mb-2 opacity-60 ${getTextColor()}`}
            >
              🏃 Run Out (runs completed)
            </p>
            <div className='grid grid-cols-3 gap-2'>
              {[0, 1, 2, 3, 4, 5].map((runs) => (
                <button
                  key={`ro-${runs}`}
                  onClick={() => {
                    setSelectedRunOut(runs);
                    setSelected(null);
                  }}
                  className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-3 px-2 transition-all duration-150 font-semibold text-sm
                    ${selectedRunOut === runs ? 'bg-red-500/70 border-red-300 scale-105 shadow-lg' : 'bg-white/10 border-white/20 hover:bg-white/20'}
                    ${getTextColor()}`}
                >
                  <span className='text-xl'>{runs}</span>
                  <span>
                    {runs === 0
                      ? 'Direct'
                      : `${runs} run${runs > 1 ? 's' : ''}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className='flex gap-3'>
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-xl border ${getBorderColor()} bg-white/10 hover:bg-white/20 ${getTextColor()} font-semibold transition-all`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`flex-1 py-3 rounded-xl font-bold transition-all
              ${
                canConfirm
                  ? 'bg-green-500/70 hover:bg-green-500/90 border-2 border-green-300 text-white scale-100 hover:scale-105'
                  : 'bg-white/10 border border-white/20 opacity-40 cursor-not-allowed'
              } ${!canConfirm ? getTextColor() : ''}`}
          >
            ✅ Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
