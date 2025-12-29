interface TeamNameInputProps {
  team1Name: string;
  team2Name: string;
  innings: 1 | 2;
  tossWinner: 1 | 2 | null;
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
  tossWinner,
  onTeam1Change,
  onTeam2Change,
  getGlassColor,
  getBorderColor,
  getTextColor,
  getTextColorLight,
  getPlaceholderColor,
}) => {
  // Determine batting and bowling teams based on toss and innings
  const getBattingTeam = () => {
    if (innings === 1) {
      return tossWinner === 1 ? team1Name : team2Name;
    } else {
      return tossWinner === 1 ? team2Name : team1Name;
    }
  };

  const getBowlingTeam = () => {
    if (innings === 1) {
      return tossWinner === 1 ? team2Name : team1Name;
    } else {
      return tossWinner === 1 ? team1Name : team2Name;
    }
  };

  const isBattingTeam1 = () => {
    if (innings === 1) {
      return tossWinner === 1;
    } else {
      return tossWinner === 2;
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-4 flex items-center gap-3`}
      >
        <div className='text-3xl'>🏏</div>
        <div className='flex-1'>
          <label className={`${getTextColorLight()} text-sm block mb-1`}>
            Batting Team
          </label>
          <input
            type='text'
            value={getBattingTeam()}
            onChange={(e) =>
              isBattingTeam1()
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
            Bowling Team
          </label>
          <input
            type='text'
            value={getBowlingTeam()}
            onChange={(e) =>
              isBattingTeam1()
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
