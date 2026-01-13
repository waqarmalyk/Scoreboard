// Predefined list of players
const PREDEFINED_PLAYERS = [
  'Atir',
  'Nakkash',
  'WaqarA',
  'WaqarD',
  'HamzaR',
  'AliHamza',
  'AliA',
  'Naseer',
  'Qadeer',
  'Nasrullah',
  'ShehzadD',
  'Haseeb',
  'Hassan',
  'Zerfi',
  'Kamran',
  'Saim',
  'Subhan',
  'Ihtisham',
  'Rohaan',
  'Adil',
  'Daud',
  'Waleed',
  'Ahmed',
  'Haris',
  'Abdullah',
  'Ibrahim',
  'Zarrar',
  'Zrbab',
  'AbdulWahab',
  'Taiyab',
];

interface PlayerSetupProps {
  team1Name: string;
  team2Name: string;
  team1Players: string[];
  team2Players: string[];
  matchOvers: number;
  tossWinner: 1 | 2 | null;
  onTeam1NameChange: (name: string) => void;
  onTeam2NameChange: (name: string) => void;
  onMatchOversChange: (overs: number) => void;
  onTossWinnerChange: (team: 1 | 2 | null) => void;
  onAddPlayer: (team: 1 | 2) => void;
  onAddPlayerByName: (team: 1 | 2, playerName: string) => void;
  onSwapPlayer: (playerName: string, fromTeam: 1 | 2) => void;
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
  matchOvers,
  tossWinner,
  onTeam1NameChange,
  onTeam2NameChange,
  onMatchOversChange,
  onTossWinnerChange,
  onAddPlayer,
  onAddPlayerByName,
  onSwapPlayer,
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
  // Filter out players already in teams
  const availablePlayers = PREDEFINED_PLAYERS.filter(
    (player) => !team1Players.includes(player) && !team2Players.includes(player)
  );

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

        {/* Match Overs Configuration */}
        <div className='mb-6'>
          <div
            className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6`}
          >
            <label className={`${getTextColorLight()} text-sm block mb-2`}>
              Match Overs
            </label>
            <input
              type='number'
              min='1'
              max='50'
              value={matchOvers || ''}
              onChange={(e) =>
                onMatchOversChange(parseInt(e.target.value) || 0)
              }
              placeholder='Enter number of overs (e.g., 5, 10, 20)'
              className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-4 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
            />
          </div>
        </div>

        {/* Toss Configuration */}
        <div className='mb-6'>
          <div
            className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6`}
          >
            <label className={`${getTextColorLight()} text-sm block mb-3`}>
              Which team won the toss and chose to bat first?
            </label>
            <div className='grid grid-cols-2 gap-4'>
              <button
                onClick={() => onTossWinnerChange(1)}
                className={`${
                  tossWinner === 1
                    ? 'bg-green-500/60 border-green-300/70 scale-105'
                    : 'bg-purple-500/40 border-purple-300/50 hover:bg-purple-500/50'
                } backdrop-blur-md border rounded-lg px-4 py-3 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105`}
              >
                {team1Name || 'Team 1'}
              </button>
              <button
                onClick={() => onTossWinnerChange(2)}
                className={`${
                  tossWinner === 2
                    ? 'bg-green-500/60 border-green-300/70 scale-105'
                    : 'bg-purple-500/40 border-purple-300/50 hover:bg-purple-500/50'
                } backdrop-blur-md border rounded-lg px-4 py-3 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105`}
              >
                {team2Name || 'Team 2'}
              </button>
            </div>
          </div>
        </div>

        {/* Predefined Players List */}
        {availablePlayers.length > 0 && (
          <div className='mb-6'>
            <div
              className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6`}
            >
              <h3 className={`text-lg font-semibold ${getTextColor()} mb-3`}>
                Available Players ({availablePlayers.length})
              </h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-60 overflow-y-auto'>
                {availablePlayers.map((player) => (
                  <div
                    key={player}
                    className={`${getGlassColor()} border ${getBorderColor()} rounded-lg p-2`}
                  >
                    <div
                      className={`text-sm ${getTextColor()} mb-1 text-center font-medium`}
                    >
                      {player}
                    </div>
                    <div className='flex gap-1'>
                      <button
                        onClick={() => onAddPlayerByName(1, player)}
                        className='flex-1 bg-blue-500/50 hover:bg-blue-500/70 rounded px-1 py-1 text-white text-xs font-semibold transition-all'
                        title={`Add to ${team1Name || 'Team 1'}`}
                      >
                        T1
                      </button>
                      <button
                        onClick={() => onAddPlayerByName(2, player)}
                        className='flex-1 bg-green-500/50 hover:bg-green-500/70 rounded px-1 py-1 text-white text-xs font-semibold transition-all'
                        title={`Add to ${team2Name || 'Team 2'}`}
                      >
                        T2
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
                  <div className='flex gap-2'>
                    <button
                      onClick={() => onSwapPlayer(player, 1)}
                      className='text-blue-400 hover:text-blue-300 font-bold text-sm'
                      title='Swap to Team 2'
                    >
                      ⇄
                    </button>
                    <button
                      onClick={() => onRemovePlayer(1, player)}
                      className='text-red-400 hover:text-red-300 font-bold'
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {addingToTeam === 1 ? (
              <div className='flex gap-1.5'>
                <input
                  type='text'
                  value={newPlayerName}
                  onChange={(e) => onNewPlayerNameChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onAddPlayer(1)}
                  placeholder='Player name'
                  className={`flex-1 min-w-0 ${getGlassColor()} border ${getBorderColor()} rounded-lg px-2 py-2 text-sm ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
                  autoFocus
                />
                <button
                  onClick={() => onAddPlayer(1)}
                  className='bg-green-500/50 hover:bg-green-500/70 rounded-lg px-3 py-2 text-white font-semibold text-sm whitespace-nowrap'
                >
                  Add
                </button>
                <button
                  onClick={() => onSetAddingToTeam(null)}
                  className='bg-red-500/50 hover:bg-red-500/70 rounded-lg px-2.5 py-2 text-white font-semibold flex-shrink-0'
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
                  <div className='flex gap-2'>
                    <button
                      onClick={() => onSwapPlayer(player, 2)}
                      className='text-blue-400 hover:text-blue-300 font-bold text-sm'
                      title='Swap to Team 1'
                    >
                      ⇄
                    </button>
                    <button
                      onClick={() => onRemovePlayer(2, player)}
                      className='text-red-400 hover:text-red-300 font-bold'
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {addingToTeam === 2 ? (
              <div className='flex gap-1.5'>
                <input
                  type='text'
                  value={newPlayerName}
                  onChange={(e) => onNewPlayerNameChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onAddPlayer(2)}
                  placeholder='Player name'
                  className={`flex-1 min-w-0 ${getGlassColor()} border ${getBorderColor()} rounded-lg px-2 py-2 text-sm ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
                  autoFocus
                />
                <button
                  onClick={() => onAddPlayer(2)}
                  className='bg-green-500/50 hover:bg-green-500/70 rounded-lg px-3 py-2 text-white font-semibold text-sm whitespace-nowrap'
                >
                  Add
                </button>
                <button
                  onClick={() => onSetAddingToTeam(null)}
                  className='bg-red-500/50 hover:bg-red-500/70 rounded-lg px-2.5 py-2 text-white font-semibold flex-shrink-0'
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
