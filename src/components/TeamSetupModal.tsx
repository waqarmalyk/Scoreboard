import { useState } from 'react';

interface PlayerGridProps {
  label: string;
  emoji: string;
  value: string;
  onChange: (v: string) => void;
  players: string[];
  exclude: string[];
  dismissed?: string[];
  getTextColor: () => string;
}

const PlayerGrid: React.FC<PlayerGridProps> = ({
  label,
  emoji,
  value,
  onChange,
  players,
  exclude,
  dismissed = [],
  getTextColor,
}) => {
  const available = players.filter((p) => p && !exclude.includes(p));
  return (
    <div>
      <p
        className={`text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1 ${getTextColor()}`}
      >
        <span>{emoji}</span> {label}
        {value && (
          <span className='ml-auto normal-case font-normal opacity-70'>
            ✅ {value}
          </span>
        )}
      </p>
      <div className='grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto'>
        {available.length === 0 ? (
          <p
            className={`col-span-3 text-center text-xs opacity-50 ${getTextColor()}`}
          >
            No players available
          </p>
        ) : (
          available.map((p) => {
            const isDismissed = dismissed.includes(p);
            return (
              <button
                key={p}
                onClick={() => !isDismissed && onChange(value === p ? '' : p)}
                disabled={isDismissed}
                title={isDismissed ? 'Out' : undefined}
                className={`rounded-xl border-2 py-2 px-2 text-xs font-semibold transition-all duration-150 truncate
                  ${
                    isDismissed
                      ? 'opacity-30 cursor-not-allowed bg-white/5 border-white/10 line-through'
                      : value === p
                        ? 'bg-indigo-500/70 border-indigo-300 scale-105 shadow-md'
                        : 'bg-white/10 border-white/20 hover:bg-white/20'
                  } ${getTextColor()}`}
              >
                {p}
                {isDismissed ? ' ❌' : ''}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

interface TeamSetupModalProps {
  battingPlayers: string[];
  bowlingPlayers: string[];
  dismissedBatsmen?: string[];
  initialStriker?: string;
  initialNonStriker?: string;
  initialBowler?: string;
  /** Which fields to show — defaults to all three */
  fields?: ('striker' | 'nonStriker' | 'bowler')[];
  onConfirm: (striker: string, nonStriker: string, bowler: string) => void;
  onCancel?: () => void;
  getTextColor: () => string;
  getGlassColor: () => string;
  getBorderColor: () => string;
}

export const TeamSetupModal: React.FC<TeamSetupModalProps> = ({
  battingPlayers,
  bowlingPlayers,
  dismissedBatsmen = [],
  initialStriker = '',
  initialNonStriker = '',
  initialBowler = '',
  fields = ['striker', 'nonStriker', 'bowler'],
  onConfirm,
  onCancel,
  getTextColor,
  getGlassColor,
  getBorderColor,
}) => {
  const [striker, setStriker] = useState(initialStriker);
  const [nonStriker, setNonStriker] = useState(initialNonStriker);
  const [bowler, setBowler] = useState(initialBowler);

  const showStriker = fields.includes('striker');
  const showNonStriker = fields.includes('nonStriker');
  const showBowler = fields.includes('bowler');

  const canConfirm =
    (!showStriker || striker !== '') &&
    (!showNonStriker || nonStriker !== '') &&
    (!showBowler || bowler !== '');

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(
      showStriker ? striker : initialStriker,
      showNonStriker ? nonStriker : initialNonStriker,
      showBowler ? bowler : initialBowler,
    );
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div
        className={`${getGlassColor()} backdrop-blur-xl rounded-2xl border ${getBorderColor()} shadow-2xl p-6 w-full max-w-md`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='text-center mb-5'>
          <div className='text-4xl mb-1'>🏏</div>
          <h2 className={`text-xl font-bold ${getTextColor()}`}>
            Set Up Players
          </h2>
          <p className={`text-sm mt-1 opacity-70 ${getTextColor()}`}>
            Select players before play begins
          </p>
        </div>

        <div className='space-y-4 mb-5'>
          {showStriker && (
            <PlayerGrid
              label='Striker'
              emoji='⭐'
              value={striker}
              onChange={setStriker}
              players={battingPlayers}
              exclude={[nonStriker]}
              dismissed={dismissedBatsmen}
              getTextColor={getTextColor}
            />
          )}
          {showNonStriker && (
            <PlayerGrid
              label='Non-Striker'
              emoji='🏃'
              value={nonStriker}
              onChange={setNonStriker}
              players={battingPlayers}
              exclude={[striker]}
              dismissed={dismissedBatsmen}
              getTextColor={getTextColor}
            />
          )}
          {showBowler && (
            <PlayerGrid
              label='Bowler'
              emoji='🎳'
              value={bowler}
              onChange={setBowler}
              players={bowlingPlayers}
              exclude={[]}
              getTextColor={getTextColor}
            />
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
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`flex-1 py-3 rounded-xl font-bold transition-all
              ${
                canConfirm
                  ? 'bg-indigo-500/70 hover:bg-indigo-500/90 border-2 border-indigo-300 text-white hover:scale-105'
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
