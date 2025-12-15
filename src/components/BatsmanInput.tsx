interface BatsmanInputProps {
  currentBatsman: string;
  nonStriker: string;
  onStrike: 'striker' | 'non-striker';
  onCurrentBatsmanChange: (name: string) => void;
  onNonStrikerChange: (name: string) => void;
  onStrikeToggle: () => void;
  availablePlayers: string[];
  getGlassColor: () => string;
  getBorderColor: () => string;
  getTextColor: () => string;
  getTextColorLight: () => string;
  getPlaceholderColor: () => string;
}

export const BatsmanInput: React.FC<BatsmanInputProps> = ({
  currentBatsman,
  nonStriker,
  onStrike,
  onCurrentBatsmanChange,
  onNonStrikerChange,
  onStrikeToggle,
  availablePlayers,
  getGlassColor,
  getBorderColor,
  getTextColor,
  getTextColorLight,
  getPlaceholderColor,
}) => {
  return (
    <div className='flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-6'>
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border p-4 flex items-center gap-3 w-full md:flex-1 ${
          onStrike === 'striker'
            ? 'border-yellow-300/70 shadow-lg shadow-yellow-500/30'
            : getBorderColor()
        }`}
      >
        <div className='text-3xl flex-shrink-0'>🏏</div>
        <div className='flex-1 overflow-hidden'>
          <label className={`${getTextColorLight()} text-sm block mb-1`}>
            {onStrike === 'striker' ? 'Striker ⭐' : 'Non-Striker'}
          </label>
          <select
            value={currentBatsman}
            onChange={(e) => onCurrentBatsmanChange(e.target.value)}
            className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
          >
            <option value=''>Select Batsman</option>
            {availablePlayers.map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        className='bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-10 h-10 md:w-12 md:h-12 text-xl md:text-2xl transition-all duration-200 hover:scale-110 hover:rotate-180 flex items-center justify-center flex-shrink-0'
        onClick={onStrikeToggle}
        title='Switch Strike'
      >
        🔄
      </button>
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border p-4 flex items-center gap-3 w-full md:flex-1 ${
          onStrike === 'non-striker'
            ? 'border-yellow-300/70 shadow-lg shadow-yellow-500/30'
            : getBorderColor()
        }`}
      >
        <div className='text-3xl flex-shrink-0'>🏏</div>
        <div className='flex-1 overflow-hidden'>
          <label className={`${getTextColorLight()} text-sm block mb-1`}>
            {onStrike === 'non-striker' ? 'Striker ⭐' : 'Non-Striker'}
          </label>
          <select
            value={nonStriker}
            onChange={(e) => onNonStrikerChange(e.target.value)}
            className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
          >
            <option value=''>Select Batsman</option>
            {availablePlayers.map((player) => (
              <option key={player} value={player}>
                {player}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
