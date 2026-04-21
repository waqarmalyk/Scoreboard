import { useState } from 'react';

interface PlayerSelectModalProps {
  title: string;
  subtitle: string;
  emoji: string;
  players: string[];
  excludePlayers?: string[];
  onConfirm: (player: string) => void;
  onCancel?: () => void;
  getTextColor: () => string;
  getGlassColor: () => string;
  getBorderColor: () => string;
}

export const PlayerSelectModal: React.FC<PlayerSelectModalProps> = ({
  title,
  subtitle,
  emoji,
  players,
  excludePlayers = [],
  onConfirm,
  onCancel,
  getTextColor,
  getGlassColor,
  getBorderColor,
}) => {
  const [selected, setSelected] = useState('');

  const available = players.filter((p) => p && !excludePlayers.includes(p));

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div
        className={`${getGlassColor()} backdrop-blur-xl rounded-2xl border ${getBorderColor()} shadow-2xl p-6 w-full max-w-md`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='text-center mb-5'>
          <div className='text-4xl mb-1'>{emoji}</div>
          <h2 className={`text-xl font-bold ${getTextColor()}`}>{title}</h2>
          <p className={`text-sm mt-1 opacity-70 ${getTextColor()}`}>
            {subtitle}
          </p>
        </div>

        {/* Player list */}
        <div className='grid grid-cols-2 gap-2 mb-5 max-h-64 overflow-y-auto'>
          {available.length === 0 ? (
            <p
              className={`col-span-2 text-center opacity-50 ${getTextColor()}`}
            >
              No players available
            </p>
          ) : (
            available.map((p) => (
              <button
                key={p}
                onClick={() => setSelected(p)}
                className={`rounded-xl border-2 py-3 px-3 text-sm font-semibold transition-all duration-150 text-left truncate
                  ${
                    selected === p
                      ? 'bg-indigo-500/70 border-indigo-300 scale-105 shadow-lg'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  } ${getTextColor()}`}
              >
                {p}
              </button>
            ))
          )}
        </div>

        {/* Action buttons */}
        <div className='flex gap-3'>
          {onCancel && (
            <button
              onClick={onCancel}
              className={`flex-1 py-3 rounded-xl border ${getBorderColor()} bg-white/10 hover:bg-white/20 ${getTextColor()} font-semibold transition-all`}
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => selected && onConfirm(selected)}
            disabled={!selected}
            className={`flex-1 py-3 rounded-xl font-bold transition-all
              ${
                selected
                  ? 'bg-indigo-500/70 hover:bg-indigo-500/90 border-2 border-indigo-300 text-white hover:scale-105'
                  : 'bg-white/10 border border-white/20 opacity-40 cursor-not-allowed'
              } ${!selected ? getTextColor() : ''}`}
          >
            ✅ Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
