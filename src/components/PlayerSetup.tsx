interface PlayerSetupProps {
  team1Name: string;
  team2Name: string;
  team1Players: string[];
  team2Players: string[];
  onTeam1NameChange: (name: string) => void;
  onTeam2NameChange: (name: string) => void;
  onAddPlayer: (team: 1 | 2) => void;
  onRemovePlayer: (team: 1 | 2, playerName: string) => void;
  newPlayerName: string;
  onNewPlayerNameChange: (name: string) => void;
  addingToTeam: 1 | 2 | null;
  onSetAddingToTeam: (team: 1 | 2 | null) => void;
  onStartMatch: () => void;
  getTextColor: () => string;
  getTextColorLight: () => string;
  getGlassColor: () => string;
  getBorderColor: () => string;
  getPlaceholderColor: () => string;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({
  team1Name,
  team2Name,
  team1Players,
  team2Players,
  onTeam1NameChange,
  onTeam2NameChange,
  onAddPlayer,
  onRemovePlayer,
  newPlayerName,
  onNewPlayerNameChange,
  addingToTeam,
  onSetAddingToTeam,
  onStartMatch,
  getTextColor,
  getTextColorLight,
  getGlassColor,
  getBorderColor,
  getPlaceholderColor,
}) => {
  return (
    <div className='w-full max-w-6xl'>
      <div
        className={`${getGlassColor()} backdrop-blur-xl rounded-3xl border ${getBorderColor()} shadow-2xl p-6 md:p-8`}
      >
        <div className='text-center mb-8'>
          <h1
            className={`text-4xl md:text-5xl font-bold ${getTextColor()} mb-2`}
          >
            🏏 Match Setup
          </h1>
          <p className={`text-xl ${getTextColorLight()}`}>
            Add players to both teams before starting the match
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Team 1 Setup */}
          <div
            className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6`}
          >
            <div className='mb-4'>
              <label className={`${getTextColorLight()} text-sm block mb-2`}>
                Team 1 Name
              </label>
              <input
                type='text'
                value={team1Name}
                onChange={(e) => onTeam1NameChange(e.target.value)}
                placeholder='Enter team name'
                className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-4 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
              />
            </div>

            <h3 className={`text-lg font-semibold ${getTextColor()} mb-3`}>
              Players ({team1Players.length})
            </h3>

            <div className='space-y-2 mb-4 max-h-60 overflow-y-auto'>
              {team1Players.map((player, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between ${getGlassColor()} rounded-lg px-3 py-2 border ${getBorderColor()}`}
                >
                  <span className={getTextColor()}>{player}</span>
                  <button
                    onClick={() => onRemovePlayer(1, player)}
                    className='text-red-400 hover:text-red-300 font-bold'
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {addingToTeam === 1 ? (
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={newPlayerName}
                  onChange={(e) => onNewPlayerNameChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onAddPlayer(1)}
                  placeholder='Player name'
                  className={`flex-1 ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
                  autoFocus
                />
                <button
                  onClick={() => onAddPlayer(1)}
                  className='bg-green-500/50 hover:bg-green-500/70 rounded-lg px-4 py-2 text-white font-semibold'
                >
                  Add
                </button>
                <button
                  onClick={() => onSetAddingToTeam(null)}
                  className='bg-red-500/50 hover:bg-red-500/70 rounded-lg px-4 py-2 text-white font-semibold'
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSetAddingToTeam(1)}
                className='w-full bg-purple-500/40 hover:bg-purple-500/60 rounded-lg px-4 py-2 text-white font-semibold'
              >
                + Add Player
              </button>
            )}
          </div>

          {/* Team 2 Setup */}
          <div
            className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6`}
          >
            <div className='mb-4'>
              <label className={`${getTextColorLight()} text-sm block mb-2`}>
                Team 2 Name
              </label>
              <input
                type='text'
                value={team2Name}
                onChange={(e) => onTeam2NameChange(e.target.value)}
                placeholder='Enter team name'
                className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-4 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
              />
            </div>

            <h3 className={`text-lg font-semibold ${getTextColor()} mb-3`}>
              Players ({team2Players.length})
            </h3>

            <div className='space-y-2 mb-4 max-h-60 overflow-y-auto'>
              {team2Players.map((player, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between ${getGlassColor()} rounded-lg px-3 py-2 border ${getBorderColor()}`}
                >
                  <span className={getTextColor()}>{player}</span>
                  <button
                    onClick={() => onRemovePlayer(2, player)}
                    className='text-red-400 hover:text-red-300 font-bold'
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {addingToTeam === 2 ? (
              <div className='flex gap-2'>
                <input
                  type='text'
                  value={newPlayerName}
                  onChange={(e) => onNewPlayerNameChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onAddPlayer(2)}
                  placeholder='Player name'
                  className={`flex-1 ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
                  autoFocus
                />
                <button
                  onClick={() => onAddPlayer(2)}
                  className='bg-green-500/50 hover:bg-green-500/70 rounded-lg px-4 py-2 text-white font-semibold'
                >
                  Add
                </button>
                <button
                  onClick={() => onSetAddingToTeam(null)}
                  className='bg-red-500/50 hover:bg-red-500/70 rounded-lg px-4 py-2 text-white font-semibold'
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSetAddingToTeam(2)}
                className='w-full bg-purple-500/40 hover:bg-purple-500/60 rounded-lg px-4 py-2 text-white font-semibold'
              >
                + Add Player
              </button>
            )}
          </div>
        </div>

        <div className='mt-8 text-center'>
          <button
            onClick={onStartMatch}
            className='bg-green-500/50 hover:bg-green-500/70 rounded-lg px-8 py-4 text-white font-bold text-xl transition-all duration-200 hover:scale-105'
          >
            🏏 Start Match
          </button>
        </div>
      </div>
    </div>
  );
};
