interface BowlerInputProps {
  currentBowler: string;
  onBowlerChange: (name: string) => void;
  availablePlayers: string[];
  getGlassColor: () => string;
  getBorderColor: () => string;
  getTextColor: () => string;
  getTextColorLight: () => string;
  getPlaceholderColor: () => string;
}

export const BowlerInput: React.FC<BowlerInputProps> = ({
  currentBowler,
  onBowlerChange,
  availablePlayers,
  getGlassColor,
  getBorderColor,
  getTextColor,
  getTextColorLight,
  getPlaceholderColor,
}) => {
  return (
    <div
      className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-4 flex items-center gap-3 mb-6`}
    >
      <div className='text-3xl flex-shrink-0'>⚾</div>
      <div className='flex-1 overflow-hidden'>
        <label className={`${getTextColorLight()} text-sm block mb-1`}>
          Current Bowler:
        </label>
        <select
          value={currentBowler}
          onChange={(e) => onBowlerChange(e.target.value)}
          className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
        >
          <option value=''>Select Bowler</option>
          {availablePlayers.map((player) => (
            <option key={player} value={player}>
              {player}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
