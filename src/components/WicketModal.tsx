import { useState } from 'react';

type DismissalType = 'caught' | 'bowled' | 'run-out' | 'stumped' | 'hit-wicket';

interface WicketModalProps {
  fieldingPlayers: string[];
  batsmanName: string;
  onConfirm: (dismissalType: DismissalType, fielderName: string) => void;
  onCancel: () => void;
  getTextColor: () => string;
  getGlassColor: () => string;
  getBorderColor: () => string;
  forceDismissal?: DismissalType;
}

const DISMISSAL_OPTIONS: {
  type: DismissalType;
  label: string;
  emoji: string;
  needsFielder: boolean;
}[] = [
  { type: 'caught', label: 'Caught', emoji: '🙌', needsFielder: true },
  { type: 'bowled', label: 'Bowled', emoji: '🎯', needsFielder: false },
  { type: 'run-out', label: 'Run Out', emoji: '🏃', needsFielder: true },
  { type: 'stumped', label: 'Stumped', emoji: '🧤', needsFielder: true },
  { type: 'hit-wicket', label: 'Hit Wicket', emoji: '💥', needsFielder: false },
];

export const WicketModal: React.FC<WicketModalProps> = ({
  fieldingPlayers,
  batsmanName,
  onConfirm,
  onCancel,
  getTextColor,
  getGlassColor,
  getBorderColor,
  forceDismissal,
}) => {
  const [selectedDismissal, setSelectedDismissal] =
    useState<DismissalType | null>(forceDismissal ?? null);
  const [selectedFielder, setSelectedFielder] = useState('');

  const visibleOptions = forceDismissal
    ? DISMISSAL_OPTIONS.filter((o) => o.type === forceDismissal)
    : DISMISSAL_OPTIONS;

  const selectedOption = DISMISSAL_OPTIONS.find(
    (o) => o.type === selectedDismissal,
  );
  const needsFielder = selectedOption?.needsFielder ?? false;

  const canConfirm =
    selectedDismissal !== null && (!needsFielder || selectedFielder !== '');

  const handleConfirm = () => {
    if (!selectedDismissal) return;
    onConfirm(selectedDismissal, selectedFielder);
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
          <h2 className={`text-xl font-bold ${getTextColor()}`}>Wicket!</h2>
          <p className={`text-sm mt-1 opacity-70 ${getTextColor()}`}>
            {batsmanName} is out — how?
          </p>
        </div>

        {/* Dismissal type buttons */}
        <div className='grid grid-cols-3 gap-2 mb-5'>
          {visibleOptions.map((opt) => (
            <button
              key={opt.type}
              onClick={() => {
                setSelectedDismissal(opt.type);
                setSelectedFielder('');
              }}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl border-2 py-3 px-2 transition-all duration-150 font-semibold text-sm
                ${
                  selectedDismissal === opt.type
                    ? 'bg-red-500/70 border-red-300 scale-105 shadow-lg'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                } ${getTextColor()}`}
            >
              <span className='text-xl'>{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Fielder select (only if needed) */}
        {needsFielder && fieldingPlayers.length > 0 && (
          <div className='mb-5'>
            <label
              className={`block text-sm font-semibold mb-2 ${getTextColor()}`}
            >
              {selectedDismissal === 'caught'
                ? '🙌 Who took the catch?'
                : selectedDismissal === 'run-out'
                  ? '🏃 Who effected the run-out?'
                  : '🧤 Who stumped?'}
            </label>
            <select
              value={selectedFielder}
              onChange={(e) => setSelectedFielder(e.target.value)}
              className={`w-full bg-white/10 border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} focus:outline-none focus:ring-2 focus:ring-white/40`}
            >
              <option value=''>— Select fielder —</option>
              {fieldingPlayers.map((p) => (
                <option key={p} value={p} className='bg-gray-800 text-white'>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}

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
                  ? 'bg-red-500/70 hover:bg-red-500/90 border-2 border-red-300 text-white scale-100 hover:scale-105'
                  : 'bg-white/10 border border-white/20 opacity-40 cursor-not-allowed'
              } ${!canConfirm ? getTextColor() : ''}`}
          >
            ✅ Confirm Out
          </button>
        </div>
      </div>
    </div>
  );
};
