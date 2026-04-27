import { useState, useEffect } from 'react';

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
  team3Name: string;
  team1Players: string[];
  team2Players: string[];
  team3Players: string[];
  matchTeamA: 1 | 2 | 3;
  matchTeamB: 1 | 2 | 3;
  matchOvers: number;
  tossWinner: 1 | 2 | null;
  onTeam1NameChange: (name: string) => void;
  onTeam2NameChange: (name: string) => void;
  onTeam3NameChange: (name: string) => void;
  onMatchTeamAChange: (team: 1 | 2 | 3) => void;
  onMatchTeamBChange: (team: 1 | 2 | 3) => void;
  onMatchOversChange: (overs: number) => void;
  onTossWinnerChange: (team: 1 | 2 | null) => void;
  onAddPlayer: (team: 1 | 2 | 3) => void;
  onAddPlayerByName: (team: 1 | 2 | 3, playerName: string) => void;
  onMovePlayer: (
    playerName: string,
    fromTeam: 1 | 2 | 3,
    toTeam: 1 | 2 | 3,
  ) => void;
  onRemovePlayer: (team: 1 | 2 | 3, playerName: string) => void;
  newPlayerName: string;
  onNewPlayerNameChange: (name: string) => void;
  addingToTeam: 1 | 2 | 3 | null;
  onSetAddingToTeam: (team: 1 | 2 | 3 | null) => void;
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
  team3Name,
  team1Players,
  team2Players,
  team3Players,
  matchTeamA,
  matchTeamB,
  matchOvers,
  tossWinner,
  onTeam1NameChange,
  onTeam2NameChange,
  onTeam3NameChange,
  onMatchTeamAChange,
  onMatchTeamBChange,
  onMatchOversChange,
  onTossWinnerChange,
  onAddPlayer,
  onAddPlayerByName,
  onMovePlayer,
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
  const [showThirdTeam, setShowThirdTeam] = useState(false);

  // When third team is hidden, always reset to T1 vs T2
  useEffect(() => {
    if (!showThirdTeam) {
      onMatchTeamAChange(1);
      onMatchTeamBChange(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showThirdTeam]);

  // Filter out players already in any of the three teams
  const availablePlayers = PREDEFINED_PLAYERS.filter(
    (player) =>
      !team1Players.includes(player) &&
      !team2Players.includes(player) &&
      (!showThirdTeam || !team3Players.includes(player)),
  );

  // Used for display labels / buttons — shows fallback when empty
  const getTeamName = (num: 1 | 2 | 3) => {
    if (num === 1) return team1Name || 'Team 1';
    if (num === 2) return team2Name || 'Team 2';
    return team3Name || 'Team 3';
  };

  // Used for controlled inputs — returns the raw value so the field can be fully cleared
  const getRawTeamName = (num: 1 | 2 | 3) => {
    if (num === 1) return team1Name;
    if (num === 2) return team2Name;
    return team3Name;
  };

  const getTeamPlayers = (num: 1 | 2 | 3) => {
    if (num === 1) return team1Players;
    if (num === 2) return team2Players;
    return team3Players;
  };

  // All possible match-up combos
  const allMatchups: Array<{ a: 1 | 2 | 3; b: 1 | 2 | 3 }> = [
    { a: 1, b: 2 },
    { a: 1, b: 3 },
    { a: 2, b: 3 },
  ];
  const matchups = showThirdTeam
    ? allMatchups
    : allMatchups.filter(({ a, b }) => a !== 3 && b !== 3);

  const renderTeamCard = (teamNum: 1 | 2 | 3) => {
    const players = getTeamPlayers(teamNum);
    const otherTeams = ([1, 2, 3] as (1 | 2 | 3)[]).filter(
      (t) => t !== teamNum && (showThirdTeam || t !== 3),
    );
    const onChangeName =
      teamNum === 1
        ? onTeam1NameChange
        : teamNum === 2
          ? onTeam2NameChange
          : onTeam3NameChange;

    return (
      <div
        key={teamNum}
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6`}
      >
        <div className='mb-4'>
          <label className={`${getTextColorLight()} text-sm block mb-2`}>
            Team {teamNum} Name
          </label>
          <input
            type='text'
            value={getRawTeamName(teamNum)}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder={`Enter team ${teamNum} name`}
            className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-4 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
          />
        </div>

        <h3 className={`text-lg font-semibold ${getTextColor()} mb-3`}>
          Players ({players.length})
        </h3>

        <div className='space-y-2 mb-4 max-h-52 overflow-y-auto'>
          {players.map((player, index) => (
            <div
              key={index}
              className={`flex items-center justify-between ${getGlassColor()} rounded-lg px-3 py-2 border ${getBorderColor()}`}
            >
              <span
                className={`${getTextColor()} text-sm flex-1 min-w-0 truncate`}
              >
                {player}
              </span>
              <div className='flex gap-1 ml-2 flex-shrink-0'>
                {otherTeams.map((toTeam) => (
                  <button
                    key={toTeam}
                    onClick={() => onMovePlayer(player, teamNum, toTeam)}
                    className='bg-blue-500/50 hover:bg-blue-500/70 rounded px-1.5 py-1 text-white text-xs font-semibold transition-all'
                    title={`Move to ${getTeamName(toTeam)}`}
                  >
                    →T{toTeam}
                  </button>
                ))}
                <button
                  onClick={() => onRemovePlayer(teamNum, player)}
                  className='text-red-400 hover:text-red-300 font-bold px-1'
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {addingToTeam === teamNum ? (
          <div className='flex gap-1.5'>
            <input
              type='text'
              value={newPlayerName}
              onChange={(e) => onNewPlayerNameChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onAddPlayer(teamNum)}
              placeholder='Player name'
              className={`flex-1 min-w-0 ${getGlassColor()} border ${getBorderColor()} rounded-lg px-2 py-2 text-sm ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
              autoFocus
            />
            <button
              onClick={() => onAddPlayer(teamNum)}
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
            onClick={() => onSetAddingToTeam(teamNum)}
            className='w-full bg-purple-500/40 hover:bg-purple-500/60 rounded-lg px-4 py-2 text-white font-semibold'
          >
            + Add Player
          </button>
        )}
      </div>
    );
  };

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
          <p className={`text-xl ${getTextColorLight()} mb-4`}>
            Configure teams and start the match
          </p>
          {/* 3rd team toggle */}
          <button
            onClick={() => setShowThirdTeam((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm transition-all duration-200 ${
              showThirdTeam
                ? 'bg-orange-500/60 border-orange-300/70 text-white'
                : `${getGlassColor()} border-white/20 ${getTextColor()} hover:bg-white/10`
            }`}
          >
            <span
              className={`w-9 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
                showThirdTeam ? 'bg-orange-400' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                  showThirdTeam ? 'left-4' : 'left-0.5'
                }`}
              />
            </span>
            Enable 3rd Team
          </button>
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
                      className={`text-sm ${getTextColor()} mb-1 text-center font-medium truncate`}
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
                      {showThirdTeam && (
                        <button
                          onClick={() => onAddPlayerByName(3, player)}
                          className='flex-1 bg-orange-500/50 hover:bg-orange-500/70 rounded px-1 py-1 text-white text-xs font-semibold transition-all'
                          title={`Add to ${team3Name || 'Team 3'}`}
                        >
                          T3
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Cards */}
        <div
          className={`grid grid-cols-1 gap-6 mb-6 ${showThirdTeam ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
        >
          {renderTeamCard(1)}
          {renderTeamCard(2)}
          {showThirdTeam && renderTeamCard(3)}
        </div>

        {/* Match Selection — only shown when 3rd team is enabled */}
        {showThirdTeam && (
          <div className='mb-6'>
            <div
              className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6`}
            >
              <label className={`${getTextColorLight()} text-sm block mb-3`}>
                Which two teams are playing today?
              </label>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                {matchups.map(({ a, b }) => {
                  const isSelected = matchTeamA === a && matchTeamB === b;
                  return (
                    <button
                      key={`${a}-${b}`}
                      onClick={() => {
                        onMatchTeamAChange(a);
                        onMatchTeamBChange(b);
                        onTossWinnerChange(null);
                      }}
                      className={`${
                        isSelected
                          ? 'bg-green-500/60 border-green-300/70 scale-105'
                          : 'bg-purple-500/40 border-purple-300/50 hover:bg-purple-500/50'
                      } backdrop-blur-md border rounded-lg px-4 py-3 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105 text-center`}
                    >
                      <span className='text-sm'>
                        {getTeamName(a)}{' '}
                        <span className={getTextColorLight()}>vs</span>{' '}
                        {getTeamName(b)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Toss Configuration — only shows the two selected playing teams */}
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
                {getTeamName(matchTeamA)}
              </button>
              <button
                onClick={() => onTossWinnerChange(2)}
                className={`${
                  tossWinner === 2
                    ? 'bg-green-500/60 border-green-300/70 scale-105'
                    : 'bg-purple-500/40 border-purple-300/50 hover:bg-purple-500/50'
                } backdrop-blur-md border rounded-lg px-4 py-3 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105`}
              >
                {getTeamName(matchTeamB)}
              </button>
            </div>
          </div>
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
