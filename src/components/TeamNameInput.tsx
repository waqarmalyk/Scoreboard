interface TeamNameInputProps {
  team1Name: string;
  team2Name: string;
  innings: 1 | 2;
  onTeam1Change: (name: string) => void;
  onTeam2Change: (name: string) => void;
  getGlassColor: () => string;
  getBorderColor: () => string;
  getTextColor: () => string;
  getTextColorLight: () => string;
  getPlaceholderColor: () => string;
}

export const TeamNameInput: React.FC<TeamNameInputProps> = ({
  team1Name,
  team2Name,
  innings,
  onTeam1Change,
  onTeam2Change,
  getGlassColor,
  getBorderColor,
  getTextColor,
  getTextColorLight,
  getPlaceholderColor,
}) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-4 flex items-center gap-3`}
      >
        <div className='text-3xl'>🏏</div>
        <div className='flex-1'>
          <label className={`${getTextColorLight()} text-sm block mb-1`}>
            {' '}
            Team 1
          </label>
          <input
            type='text'
            value={innings === 1 ? team1Name : team2Name}
            onChange={(e) =>
              innings === 1
                ? onTeam1Change(e.target.value)
                : onTeam2Change(e.target.value)
            }
            placeholder='Team Name'
            className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
          />
        </div>
      </div>
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-4 flex items-center gap-3`}
      >
        <div className='text-3xl'>⚾</div>
        <div className='flex-1'>
          <label className={`${getTextColorLight()} text-sm block mb-1`}>
            {' '}
            Team 2
          </label>
          <input
            type='text'
            value={innings === 1 ? team2Name : team1Name}
            onChange={(e) =>
              innings === 1
                ? onTeam2Change(e.target.value)
                : onTeam1Change(e.target.value)
            }
            placeholder='Team Name'
            className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
          />
        </div>
      </div>
    </div>
  );
};
