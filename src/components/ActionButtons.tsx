interface ActionButtonsProps {
  innings: 1 | 2;
  onUndo: () => void;
  onResetMatch: () => void;
  onStartSecondInnings: () => void;
  onResetFullMatch: () => void;
  onEndMatch: () => void;
  getTextColor: () => string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  innings,
  onUndo,
  onResetMatch,
  onStartSecondInnings,
  onResetFullMatch,
  onEndMatch,
  getTextColor,
}) => {
  return (
    <div className='grid grid-cols-2 gap-3 md:gap-4 mb-6'>
      {innings === 1 ? (
        <>
          <button
            className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105`}
            onClick={onUndo}
          >
            ↶ Undo
          </button>
          <button
            className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105`}
            onClick={onResetMatch}
          >
            🔄 New Match
          </button>
          <button
            className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105 col-span-2`}
            onClick={onStartSecondInnings}
          >
            🏁 Start 2nd Innings
          </button>
        </>
      ) : (
        <>
          <button
            className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105`}
            onClick={onUndo}
          >
            ↶ Undo
          </button>
          <button
            className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105`}
            onClick={onResetFullMatch}
          >
            🔄 New Match
          </button>
          <button
            className='col-span-2 bg-red-500/60 backdrop-blur-md border border-red-300/60 hover:bg-red-500/80 rounded-lg px-4 md:px-6 py-3 md:py-4 text-white font-bold transition-all duration-200 hover:scale-105'
            onClick={onEndMatch}
          >
            🏁 End Innings
          </button>
        </>
      )}
    </div>
  );
};
