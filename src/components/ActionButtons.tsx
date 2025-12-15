interface ActionButtonsProps {
  innings: 1 | 2;
  onUndo: () => void;
  onResetMatch: () => void;
  onStartSecondInnings: () => void;
  onResetFullMatch: () => void;
  getTextColor: () => string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  innings,
  onUndo,
  onResetMatch,
  onStartSecondInnings,
  onResetFullMatch,
  getTextColor,
}) => {
  return (
    <div className='grid grid-cols-2 gap-3 md:gap-4 mb-6'>
      <button
        className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105`}
        onClick={onUndo}
      >
        ↶ Undo
      </button>
      {innings === 1 ? (
        <>
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
        <button
          className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105 col-span-2`}
          onClick={onResetFullMatch}
        >
          ❌ New Match
        </button>
      )}
      {/* <button
        className={`bg-red-500/40 backdrop-blur-md border border-red-300/50 hover:bg-red-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105 col-span-2`}
        onClick={onResetEverything}
      >
        🗑️ Reset Everything
      </button> */}
    </div>
  );
};
