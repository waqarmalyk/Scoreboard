import { useState, useEffect } from 'react';
import './App.css';
import type {
  Ball,
  BallType,
  PlayerStats,
  BowlerStats,
  FielderStats,
} from './types';
import { useTheme } from './hooks/useTheme';
import { ThemeColorPicker } from './components/ThemeColorPicker';
import { TeamNameInput } from './components/TeamNameInput';
import { ScoreDisplay } from './components/ScoreDisplay';
import { ExtrasDisplay } from './components/ExtrasDisplay';
import { BatsmanInput } from './components/BatsmanInput';
import { BowlerInput } from './components/BowlerInput';
import { CurrentOver } from './components/CurrentOver';
import { BallTypeButtons } from './components/BallTypeButtons';
import { ActionButtons } from './components/ActionButtons';
import { PreviousOvers } from './components/PreviousOvers';
import { Statistics } from './components/Statistics';
import { PlayerSetup } from './components/PlayerSetup';
import { MatchSummary } from './components/MatchSummary';
import { MilestonePopup } from './components/MilestonePopup';
import { WicketModal } from './components/WicketModal';
import { TeamSetupModal } from './components/TeamSetupModal';

function App() {
  // Theme state
  const {
    theme,
    setTheme,
    getThemeBg,
    getTextColor,
    getTextColorLight,
    getPlaceholderColor,
    getGlassColor,
    getBorderColor,
  } = useTheme();

  // Match setup state
  const [matchStarted, setMatchStarted] = useState(() => {
    const saved = sessionStorage.getItem('matchStarted');
    return saved ? JSON.parse(saved) : false;
  });
  const [matchCompleted, setMatchCompleted] = useState(() => {
    const saved = sessionStorage.getItem('matchCompleted');
    return saved ? JSON.parse(saved) : false;
  });
  const [tossWinner, setTossWinner] = useState<1 | 2 | null>(() => {
    const saved = sessionStorage.getItem('tossWinner');
    return saved ? (parseInt(saved) as 1 | 2) : null;
  });
  const [team1Players, setTeam1Players] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('team1Players');
    return saved ? JSON.parse(saved) : [];
  });
  const [team2Players, setTeam2Players] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('team2Players');
    return saved ? JSON.parse(saved) : [];
  });
  const [team3Players, setTeam3Players] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('team3Players');
    return saved ? JSON.parse(saved) : [];
  });
  const [newPlayerName, setNewPlayerName] = useState('');
  const [addingToTeam, setAddingToTeam] = useState<1 | 2 | 3 | null>(null);

  // Load from sessionStorage or use defaults
  const [team1Name, setTeam1Name] = useState(
    () => sessionStorage.getItem('team1Name') || 'Team 1',
  );
  const [team2Name, setTeam2Name] = useState(
    () => sessionStorage.getItem('team2Name') || 'Team 2',
  );
  const [team3Name, setTeam3Name] = useState(
    () => sessionStorage.getItem('team3Name') || 'Team 3',
  );

  // Which two teams are playing this match
  const [matchTeamA, setMatchTeamA] = useState<1 | 2 | 3>(() => {
    const saved = sessionStorage.getItem('matchTeamA');
    return saved ? (parseInt(saved) as 1 | 2 | 3) : 1;
  });
  const [matchTeamB, setMatchTeamB] = useState<1 | 2 | 3>(() => {
    const saved = sessionStorage.getItem('matchTeamB');
    return saved ? (parseInt(saved) as 1 | 2 | 3) : 2;
  });
  const [currentBatsman, setCurrentBatsman] = useState(() => {
    const saved = sessionStorage.getItem('currentBatsman');
    return saved || '';
  });
  const [nonStriker, setNonStriker] = useState(() => {
    const saved = sessionStorage.getItem('nonStriker');
    return saved || '';
  });
  const [onStrike, setOnStrike] = useState<'striker' | 'non-striker'>(() => {
    const saved = sessionStorage.getItem('onStrike');
    return (saved as 'striker' | 'non-striker') || 'striker';
  });
  const [currentBowler, setCurrentBowler] = useState(() => {
    const saved = sessionStorage.getItem('currentBowler');
    return saved || '';
  });

  // Player statistics
  const [batsmenStats, setBatsmenStats] = useState<PlayerStats[]>(() => {
    const saved = sessionStorage.getItem('batsmenStats');
    return saved ? JSON.parse(saved) : [];
  });
  const [bowlerStats, setBowlerStats] = useState<BowlerStats[]>(() => {
    const saved = sessionStorage.getItem('bowlerStats');
    return saved ? JSON.parse(saved) : [];
  });
  const [fielderStats, setFielderStats] = useState<FielderStats[]>(() => {
    const saved = sessionStorage.getItem('fielderStats');
    return saved ? JSON.parse(saved) : [];
  });

  const [totalRuns, setTotalRuns] = useState(() => {
    const saved = sessionStorage.getItem('totalRuns');
    return saved ? parseInt(saved) : 0;
  });
  const [wickets, setWickets] = useState(() => {
    const saved = sessionStorage.getItem('wickets');
    return saved ? parseInt(saved) : 0;
  });
  const [currentOver, setCurrentOver] = useState<Ball[]>(() => {
    const saved = sessionStorage.getItem('currentOver');
    return saved ? JSON.parse(saved) : [];
  });
  const [allOvers, setAllOvers] = useState<Ball[][]>(() => {
    const saved = sessionStorage.getItem('allOvers');
    return saved ? JSON.parse(saved) : [];
  });
  const [extras, setExtras] = useState(() => {
    const saved = sessionStorage.getItem('extras');
    return saved ? JSON.parse(saved) : { wides: 0, noBalls: 0 };
  });

  // Innings management
  const [innings, setInnings] = useState<1 | 2>(() => {
    const saved = sessionStorage.getItem('innings');
    return saved ? (parseInt(saved) as 1 | 2) : 1;
  });
  const [firstInningsBalls, setFirstInningsBalls] = useState(() => {
    const saved = sessionStorage.getItem('firstInningsBalls');
    return saved ? parseInt(saved) : 0;
  });

  // Saved stats from innings
  const [innings1BatsmenStats, setInnings1BatsmenStats] = useState<
    PlayerStats[]
  >(() => {
    const saved = sessionStorage.getItem('innings1BatsmenStats');
    return saved ? JSON.parse(saved) : [];
  });
  const [innings1BowlerStats, setInnings1BowlerStats] = useState<BowlerStats[]>(
    () => {
      const saved = sessionStorage.getItem('innings1BowlerStats');
      return saved ? JSON.parse(saved) : [];
    },
  );
  const [innings1FielderStats, setInnings1FielderStats] = useState<
    FielderStats[]
  >(() => {
    const saved = sessionStorage.getItem('innings1FielderStats');
    return saved ? JSON.parse(saved) : [];
  });
  const [innings1Score, setInnings1Score] = useState(() => {
    const saved = sessionStorage.getItem('innings1Score');
    return saved ? parseInt(saved) : 0;
  });
  const [innings1Wickets, setInnings1Wickets] = useState(() => {
    const saved = sessionStorage.getItem('innings1Wickets');
    return saved ? parseInt(saved) : 0;
  });
  const [innings1Overs, setInnings1Overs] = useState(() => {
    const saved = sessionStorage.getItem('innings1Overs');
    return saved || '';
  });

  const [innings2Score, setInnings2Score] = useState(() => {
    const saved = sessionStorage.getItem('innings2Score');
    return saved ? parseInt(saved) : 0;
  });
  const [innings2Wickets, setInnings2Wickets] = useState(() => {
    const saved = sessionStorage.getItem('innings2Wickets');
    return saved ? parseInt(saved) : 0;
  });
  const [innings2Overs, setInnings2Overs] = useState(() => {
    const saved = sessionStorage.getItem('innings2Overs');
    return saved || '';
  });

  // Match configuration
  const [matchOvers, setMatchOvers] = useState(() => {
    const saved = sessionStorage.getItem('matchOvers');
    return saved ? parseInt(saved) : 0;
  });

  // Target mode state
  const [targetMode, setTargetMode] = useState(() => {
    const saved = sessionStorage.getItem('targetMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [target, setTarget] = useState(() => {
    const saved = sessionStorage.getItem('target');
    return saved ? parseInt(saved) : 0;
  });
  const [totalBalls, setTotalBalls] = useState(() => {
    const saved = sessionStorage.getItem('totalBalls');
    return saved ? parseInt(saved) : 0;
  });
  const [maxBalls, setMaxBalls] = useState(() => {
    const saved = sessionStorage.getItem('maxBalls');
    return saved ? parseInt(saved) : 0;
  });

  // History for undo functionality (array to support multiple undos)
  const [actionHistory, setActionHistory] = useState<
    Array<{
      type: 'ball' | 'wicket';
      ball: Ball;
      batsmanName: string;
      bowlerName: string;
      onStrikeWas: 'striker' | 'non-striker';
      batsmenStatsBefore: PlayerStats[];
      bowlerStatsBefore: BowlerStats[];
      fielderStatsBefore: FielderStats[];
      totalRunsBefore: number;
      wicketsBefore: number;
      extrasBefore: { wides: number; noBalls: number };
      totalBallsBefore: number;
      firstInningsBallsBefore: number;
      currentOverBefore: Ball[];
      allOversBefore: Ball[][];
    }>
  >([]);

  // Milestone popup state
  const [milestone, setMilestone] = useState<{
    playerName: string;
    milestone: number;
    type: 'batsman' | 'bowler';
  } | null>(null);

  // Wicket modal state
  const [wicketModalOpen, setWicketModalOpen] = useState(false);
  const [wicketModalFieldingPlayers, setWicketModalFieldingPlayers] = useState<
    string[]
  >([]);
  const [wicketModalBatsmanName, setWicketModalBatsmanName] = useState('');
  const [wicketModalForceDismissal, setWicketModalForceDismissal] = useState<
    'caught' | 'bowled' | 'run-out' | 'stumped' | 'hit-wicket' | undefined
  >(undefined);

  // Player select modals
  const [teamSetupModal, setTeamSetupModal] = useState<{
    fields: ('striker' | 'nonStriker' | 'bowler')[];
  } | null>(null);
  const [dismissedBatsmen, setDismissedBatsmen] = useState<string[]>([]);
  // Callback to run after a player is selected (used when ball is pending)
  const [pendingBallAfterSelect, setPendingBallAfterSelect] = useState<
    (() => void) | null
  >(null);

  // Fire pending ball callback once all required players are selected
  useEffect(() => {
    if (
      pendingBallAfterSelect &&
      currentBatsman &&
      nonStriker &&
      currentBowler &&
      !teamSetupModal
    ) {
      const cb = pendingBallAfterSelect;
      setTimeout(() => {
        setPendingBallAfterSelect(null);
        cb();
      }, 0);
    }
  }, [
    pendingBallAfterSelect,
    currentBatsman,
    nonStriker,
    currentBowler,
    teamSetupModal,
  ]);
  const [pendingWicketContext, setPendingWicketContext] = useState<{
    batsmanName: string;
    onStrikeWas: 'striker' | 'non-striker';
    previousBatsmenStats: PlayerStats[];
    previousBowlerStats: BowlerStats[];
    previousFielderStats: FielderStats[];
    previousTotalRuns: number;
    previousWickets: number;
    previousExtras: { wides: number; noBalls: number };
    previousTotalBalls: number;
    previousFirstInningsBalls: number;
    previousCurrentOver: Ball[];
    previousAllOvers: Ball[][];
    runsBeforeOut?: number;
  } | null>(null);

  // Persist to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('team1Name', team1Name);
    sessionStorage.setItem('team2Name', team2Name);
    sessionStorage.setItem('team3Name', team3Name);
    sessionStorage.setItem('batsmenStats', JSON.stringify(batsmenStats));
    sessionStorage.setItem('bowlerStats', JSON.stringify(bowlerStats));
    sessionStorage.setItem('fielderStats', JSON.stringify(fielderStats));
    sessionStorage.setItem('team1Players', JSON.stringify(team1Players));
    sessionStorage.setItem('team2Players', JSON.stringify(team2Players));
    sessionStorage.setItem('team3Players', JSON.stringify(team3Players));
    sessionStorage.setItem('matchTeamA', matchTeamA.toString());
    sessionStorage.setItem('matchTeamB', matchTeamB.toString());
    sessionStorage.setItem('matchOvers', matchOvers.toString());
    sessionStorage.setItem('currentBatsman', currentBatsman);
    sessionStorage.setItem('nonStriker', nonStriker);
    sessionStorage.setItem('onStrike', onStrike);
    sessionStorage.setItem('currentBowler', currentBowler);
    sessionStorage.setItem('totalRuns', totalRuns.toString());
    sessionStorage.setItem('wickets', wickets.toString());
    sessionStorage.setItem('currentOver', JSON.stringify(currentOver));
    sessionStorage.setItem('allOvers', JSON.stringify(allOvers));
    sessionStorage.setItem('extras', JSON.stringify(extras));
    sessionStorage.setItem('innings', innings.toString());
    sessionStorage.setItem('firstInningsBalls', firstInningsBalls.toString());
    sessionStorage.setItem(
      'innings1BatsmenStats',
      JSON.stringify(innings1BatsmenStats),
    );
    sessionStorage.setItem(
      'innings1BowlerStats',
      JSON.stringify(innings1BowlerStats),
    );
    sessionStorage.setItem(
      'innings1FielderStats',
      JSON.stringify(innings1FielderStats),
    );
    sessionStorage.setItem('innings1Score', innings1Score.toString());
    sessionStorage.setItem('innings1Wickets', innings1Wickets.toString());
    sessionStorage.setItem('innings1Overs', innings1Overs);
    sessionStorage.setItem('innings2Score', innings2Score.toString());
    sessionStorage.setItem('innings2Wickets', innings2Wickets.toString());
    sessionStorage.setItem('innings2Overs', innings2Overs);
    sessionStorage.setItem('targetMode', JSON.stringify(targetMode));
    sessionStorage.setItem('target', target.toString());
    sessionStorage.setItem('totalBalls', totalBalls.toString());
    sessionStorage.setItem('maxBalls', maxBalls.toString());
    sessionStorage.setItem('matchStarted', JSON.stringify(matchStarted));
    sessionStorage.setItem('matchCompleted', JSON.stringify(matchCompleted));
    if (tossWinner !== null) {
      sessionStorage.setItem('tossWinner', tossWinner.toString());
    }
  }, [
    team1Name,
    team2Name,
    team3Name,
    batsmenStats,
    bowlerStats,
    fielderStats,
    team1Players,
    team2Players,
    team3Players,
    matchTeamA,
    matchTeamB,
    matchOvers,
    tossWinner,
    currentBatsman,
    nonStriker,
    onStrike,
    currentBowler,
    totalRuns,
    wickets,
    currentOver,
    allOvers,
    extras,
    innings,
    firstInningsBalls,
    innings1BatsmenStats,
    innings1BowlerStats,
    innings1FielderStats,
    innings1Score,
    innings1Wickets,
    innings1Overs,
    innings2Score,
    innings2Wickets,
    innings2Overs,
    targetMode,
    target,
    totalBalls,
    maxBalls,
    matchStarted,
    matchCompleted,
  ]);

  const getTeamName = (teamNum: 1 | 2 | 3): string => {
    if (teamNum === 1) return team1Name;
    if (teamNum === 2) return team2Name;
    return team3Name;
  };

  const getTeamPlayersList = (teamNum: 1 | 2 | 3): string[] => {
    if (teamNum === 1) return team1Players;
    if (teamNum === 2) return team2Players;
    return team3Players;
  };

  // Active team names for the current match
  const activeTeamAName = getTeamName(matchTeamA);
  const activeTeamBName = getTeamName(matchTeamB);

  const addPlayerToTeam = (team: 1 | 2 | 3) => {
    if (!newPlayerName.trim()) {
      alert('Please enter a player name!');
      return;
    }

    const players = getTeamPlayersList(team);

    // Check if team already has 11 players
    if (players.length >= 11) {
      alert('Maximum 11 players allowed per team!');
      return;
    }

    if (players.includes(newPlayerName.trim())) {
      alert('Player already exists in this team!');
      return;
    }

    if (team === 1) {
      setTeam1Players([...team1Players, newPlayerName.trim()]);
    } else if (team === 2) {
      setTeam2Players([...team2Players, newPlayerName.trim()]);
    } else {
      setTeam3Players([...team3Players, newPlayerName.trim()]);
    }
    setNewPlayerName('');
    setAddingToTeam(null);
  };

  const addPlayerToTeamByName = (team: 1 | 2 | 3, playerName: string) => {
    const players = getTeamPlayersList(team);

    // Check if team already has 11 players
    if (players.length >= 11) {
      alert('Maximum 11 players allowed per team!');
      return;
    }

    if (players.includes(playerName)) {
      alert('Player already exists in this team!');
      return;
    }

    if (team === 1) {
      setTeam1Players([...team1Players, playerName]);
    } else if (team === 2) {
      setTeam2Players([...team2Players, playerName]);
    } else {
      setTeam3Players([...team3Players, playerName]);
    }
  };

  const movePlayerToTeam = (
    playerName: string,
    fromTeam: 1 | 2 | 3,
    toTeam: 1 | 2 | 3,
  ) => {
    const toPlayers = getTeamPlayersList(toTeam);

    // Check if destination team already has 11 players
    if (toPlayers.length >= 11) {
      alert(
        `Cannot move! ${getTeamName(toTeam)} already has maximum 11 players.`,
      );
      return;
    }

    // Remove from source team
    if (fromTeam === 1) {
      setTeam1Players(team1Players.filter((p) => p !== playerName));
    } else if (fromTeam === 2) {
      setTeam2Players(team2Players.filter((p) => p !== playerName));
    } else {
      setTeam3Players(team3Players.filter((p) => p !== playerName));
    }

    // Add to destination team
    if (toTeam === 1) {
      setTeam1Players([
        ...team1Players.filter((p) => p !== playerName),
        playerName,
      ]);
    } else if (toTeam === 2) {
      setTeam2Players([
        ...team2Players.filter((p) => p !== playerName),
        playerName,
      ]);
    } else {
      setTeam3Players([
        ...team3Players.filter((p) => p !== playerName),
        playerName,
      ]);
    }
  };

  const removePlayerFromTeam = (team: 1 | 2 | 3, playerName: string) => {
    if (team === 1) {
      setTeam1Players(team1Players.filter((p) => p !== playerName));
    } else if (team === 2) {
      setTeam2Players(team2Players.filter((p) => p !== playerName));
    } else {
      setTeam3Players(team3Players.filter((p) => p !== playerName));
    }
  };

  const startMatch = () => {
    if (matchTeamA === matchTeamB) {
      alert('Please select two different teams to play!');
      return;
    }
    const teamAPlayers = getTeamPlayersList(matchTeamA);
    const teamBPlayers = getTeamPlayersList(matchTeamB);
    if (teamAPlayers.length === 0 || teamBPlayers.length === 0) {
      alert(
        'Please add at least one player to each selected team before starting!',
      );
      return;
    }
    if (!matchOvers || matchOvers <= 0) {
      alert('Please set the number of overs for the match!');
      return;
    }
    if (tossWinner === null) {
      alert('Please select which team won the toss and chose to bat first!');
      return;
    }
    // Set maxBalls for first innings based on overs
    setMaxBalls(matchOvers * 6);
    setMatchStarted(true);
    setTimeout(() => {
      setTeamSetupModal({ fields: ['striker', 'nonStriker', 'bowler'] });
    }, 100);
  };

  const getBattingTeamPlayers = () => {
    // First innings: team that won toss bats (A=1, B=2)
    // Second innings: other team bats
    if (innings === 1) {
      return tossWinner === 1
        ? getTeamPlayersList(matchTeamA)
        : getTeamPlayersList(matchTeamB);
    } else {
      return tossWinner === 1
        ? getTeamPlayersList(matchTeamB)
        : getTeamPlayersList(matchTeamA);
    }
  };

  const getBowlingTeamPlayers = () => {
    // First innings: team that lost toss bowls
    // Second innings: other team bowls
    if (innings === 1) {
      return tossWinner === 1
        ? getTeamPlayersList(matchTeamB)
        : getTeamPlayersList(matchTeamA);
    } else {
      return tossWinner === 1
        ? getTeamPlayersList(matchTeamA)
        : getTeamPlayersList(matchTeamB);
    }
  };

  const updateBatsmanStats = (
    runs: number,
    isFour: boolean,
    isSix: boolean,
  ) => {
    const activeBatsman = onStrike === 'striker' ? currentBatsman : nonStriker;
    const existingBatsman = batsmenStats.find(
      (b) => b.name === activeBatsman && b.innings === innings,
    );
    const isDotBall = runs === 0;
    if (existingBatsman) {
      const previousRuns = existingBatsman.runs;
      const newRuns = previousRuns + runs;

      // Check for milestones: 30, 50, 100
      [30, 50, 100].forEach((milestone) => {
        if (previousRuns < milestone && newRuns >= milestone) {
          setMilestone({
            playerName: activeBatsman,
            milestone,
            type: 'batsman',
          });
        }
      });

      setBatsmenStats(
        batsmenStats.map((b) =>
          b.name === activeBatsman && b.innings === innings
            ? {
                ...b,
                runs: newRuns,
                balls: b.balls + 1,
                fours: b.fours + (isFour ? 1 : 0),
                sixes: b.sixes + (isSix ? 1 : 0),
                dotBalls: b.dotBalls + (isDotBall ? 1 : 0),
              }
            : b,
        ),
      );
    } else {
      const newRuns = runs;

      // Check for milestones on first scoring
      [30, 50, 100].forEach((milestone) => {
        if (newRuns >= milestone) {
          setMilestone({
            playerName: activeBatsman,
            milestone,
            type: 'batsman',
          });
        }
      });

      setBatsmenStats([
        ...batsmenStats,
        {
          name: activeBatsman,
          runs,
          balls: 1,
          fours: isFour ? 1 : 0,
          sixes: isSix ? 1 : 0,
          dotBalls: isDotBall ? 1 : 0,
          innings: innings,
        },
      ]);
    }
  };

  const updateBowlerStats = (
    runs: number,
    isWicket: boolean,
    isLegal: boolean,
    ballType: BallType,
  ) => {
    const existingBowler = bowlerStats.find(
      (b) => b.name === currentBowler && b.innings === innings,
    );
    if (existingBowler) {
      const newBalls = existingBowler.balls + (isLegal ? 1 : 0);
      const previousWickets = existingBowler.wickets;
      const newWickets = previousWickets + (isWicket ? 1 : 0);

      // Check for bowling milestones: 3 and 5 wickets
      if (isWicket) {
        [3, 5].forEach((milestone) => {
          if (previousWickets < milestone && newWickets >= milestone) {
            setMilestone({
              playerName: currentBowler,
              milestone,
              type: 'bowler',
            });
          }
        });
      }

      setBowlerStats(
        bowlerStats.map((b) =>
          b.name === currentBowler && b.innings === innings
            ? {
                ...b,
                runsConceded: b.runsConceded + runs,
                wickets: newWickets,
                balls: newBalls,
                overs: Math.floor(newBalls / 6) + (newBalls % 6) / 10,
                wides: b.wides + (ballType === 'WD' ? 1 : 0),
                noBalls: b.noBalls + (ballType === 'NB' ? 1 : 0),
              }
            : b,
        ),
      );
    } else {
      const newWickets = isWicket ? 1 : 0;

      // Check for milestones on first wicket stats
      if (isWicket) {
        [3, 5].forEach((milestone) => {
          if (newWickets >= milestone) {
            setMilestone({
              playerName: currentBowler,
              milestone,
              type: 'bowler',
            });
          }
        });
      }

      setBowlerStats([
        ...bowlerStats,
        {
          name: currentBowler,
          runsConceded: runs,
          wickets: newWickets,
          balls: isLegal ? 1 : 0,
          overs: isLegal ? 0.1 : 0,
          innings: innings,
          wides: ballType === 'WD' ? 1 : 0,
          noBalls: ballType === 'NB' ? 1 : 0,
        },
      ]);
    }
  };

  const updateFielderStats = (fielderName: string) => {
    const existingFielder = fielderStats.find(
      (f) => f.name === fielderName && f.innings === innings,
    );
    if (existingFielder) {
      setFielderStats(
        fielderStats.map((f) =>
          f.name === fielderName && f.innings === innings
            ? { ...f, catches: f.catches + 1 }
            : f,
        ),
      );
    } else {
      setFielderStats([
        ...fielderStats,
        {
          name: fielderName,
          catches: 1,
          innings: innings,
        },
      ]);
    }
  };

  const addBall = (type: BallType, runs: number, batsmanRuns?: number) => {
    // Check if current over is already complete (6 legal balls)
    const currentLegalBalls = currentOver.filter(
      (b) => b.type !== 'WD' && b.type !== 'NB',
    ).length;

    if (currentLegalBalls >= 6) {
      return;
    }

    // Validate players — open setup modal with missing fields
    const missingFields: ('striker' | 'nonStriker' | 'bowler')[] = [];
    if (!currentBatsman) missingFields.push('striker');
    if (!nonStriker) missingFields.push('nonStriker');
    if (!currentBowler) missingFields.push('bowler');
    if (missingFields.length > 0) {
      setPendingBallAfterSelect(() => () => addBall(type, runs, batsmanRuns));
      setTeamSetupModal({ fields: missingFields });
      return;
    }

    // Save state before making changes (for undo)
    const batsmanName = onStrike === 'striker' ? currentBatsman : nonStriker;
    const previousBatsmenStats = JSON.parse(JSON.stringify(batsmenStats));
    const previousBowlerStats = JSON.parse(JSON.stringify(bowlerStats));
    const previousFielderStats = JSON.parse(JSON.stringify(fielderStats));
    const previousTotalRuns = totalRuns;
    const previousWickets = wickets;
    const previousExtras = JSON.parse(JSON.stringify(extras));
    const previousTotalBalls = totalBalls;
    const previousFirstInningsBalls = firstInningsBalls;
    const previousCurrentOver = JSON.parse(JSON.stringify(currentOver));
    const previousAllOvers = JSON.parse(JSON.stringify(allOvers));

    const newBall: Ball = { type, runs };
    const updatedOver = [...currentOver, newBall];

    const newTotalRuns = totalRuns + runs;
    setTotalRuns(newTotalRuns);
    setCurrentOver(updatedOver);

    // Save action for undo - add to history array
    setActionHistory([
      ...actionHistory,
      {
        type: 'ball',
        ball: newBall,
        batsmanName,
        bowlerName: currentBowler,
        onStrikeWas: onStrike,
        batsmenStatsBefore: previousBatsmenStats,
        bowlerStatsBefore: previousBowlerStats,
        fielderStatsBefore: previousFielderStats,
        totalRunsBefore: previousTotalRuns,
        wicketsBefore: previousWickets,
        extrasBefore: previousExtras,
        totalBallsBefore: previousTotalBalls,
        firstInningsBallsBefore: previousFirstInningsBalls,
        currentOverBefore: previousCurrentOver,
        allOversBefore: previousAllOvers,
      },
    ]);

    // Update extras — always 1 penalty regardless of runs scored off the ball
    if (type === 'WD') {
      setExtras({ ...extras, wides: extras.wides + 1 });
    } else if (type === 'NB') {
      setExtras({ ...extras, noBalls: extras.noBalls + 1 });
    }

    // Update player stats
    const isLegal = type !== 'WD' && type !== 'NB';

    // Determine runs to credit to batsman and runs for rotation
    let runsForBatsman = runs;
    let runsForRotation = runs;

    if (batsmanRuns !== undefined) {
      // Wall scenario: batsmanRuns < runs (e.g., batsmanRuns=2, runs=3 for wall)
      if (isLegal && batsmanRuns < runs) {
        // Wall: credit total runs to batsman, but rotate based on actual runs made
        runsForBatsman = runs; // Total runs including wall bonus
        runsForRotation = batsmanRuns; // Actual runs batsman made (for rotation)
      } else {
        // WD/NB with batsman runs, or other scenarios
        runsForBatsman = batsmanRuns;
        runsForRotation = batsmanRuns;
      }
    } else if (!isLegal) {
      // Simple WD or NB without batsman runs - no runs to batsman
      runsForBatsman = 0;
      runsForRotation = 0;
    }

    if (isLegal) {
      updateBatsmanStats(runsForBatsman, type === '4', type === '6');

      // Strike rotation based on actual runs made by batsman
      if ([1, 3, 5].includes(runsForRotation)) {
        setOnStrike(onStrike === 'striker' ? 'non-striker' : 'striker');
      }
    } else if (batsmanRuns !== undefined && batsmanRuns > 0) {
      // WD or NB with batsman runs - update batsman stats
      updateBatsmanStats(runsForBatsman, false, false);
      // Rotate strike on odd batsman runs
      if ([1, 3, 5].includes(runsForRotation)) {
        setOnStrike(onStrike === 'striker' ? 'non-striker' : 'striker');
      }
    }

    updateBowlerStats(runs, false, isLegal, type);

    // Check if target is achieved in 2nd innings (win by wickets) - AFTER stats updated
    if (targetMode && newTotalRuns >= target) {
      // Calculate final balls for 2nd innings
      const totalBalls2nd =
        (innings === 2 ? totalBalls : 0) +
        (type !== 'WD' && type !== 'NB' ? 1 : 0);

      // Save second innings data before showing summary
      setInnings2Score(newTotalRuns);
      setInnings2Wickets(wickets);
      setInnings2Overs(`${Math.floor(totalBalls2nd / 6)}.${totalBalls2nd % 6}`);

      setTimeout(() => {
        setMatchCompleted(true);
      }, 500);
      return; // Don't process rest of the ball logic
    }

    // Track total balls (for both innings)
    let newTotalBalls = totalBalls;
    let newFirstInningsBalls = firstInningsBalls;
    if (type !== 'WD' && type !== 'NB') {
      if (innings === 1) {
        newFirstInningsBalls = firstInningsBalls + 1;
        setFirstInningsBalls(newFirstInningsBalls);

        // Check if overs completed in 1st innings
        if (newFirstInningsBalls >= maxBalls) {
          setTimeout(() => {
            alert(
              'Overs completed! Click "Start 2nd Innings" to begin the chase.',
            );
          }, 500);
        }
      } else {
        newTotalBalls = totalBalls + 1;
        setTotalBalls(newTotalBalls);

        // Check if balls exhausted in 2nd innings (bowling team wins)
        if (targetMode && newTotalBalls >= maxBalls && newTotalRuns < target) {
          // Save second innings data before showing summary
          setInnings2Score(newTotalRuns);
          setInnings2Wickets(wickets);
          setInnings2Overs(
            `${Math.floor(newTotalBalls / 6)}.${newTotalBalls % 6}`,
          );

          setTimeout(() => {
            setMatchCompleted(true);
          }, 500);
          return; // Don't process rest
        }
      }
    }

    // Complete over after 6 legal balls (excluding wides and no-balls)
    const legalBalls = updatedOver.filter(
      (b) => b.type !== 'WD' && b.type !== 'NB',
    );
    if (legalBalls.length === 6) {
      // Delay moving to next over so user can see the 6th ball
      setTimeout(() => {
        setAllOvers([...allOvers, updatedOver]);
        setCurrentOver([]);
        setOnStrike((prev) => (prev === 'striker' ? 'non-striker' : 'striker'));
        // Prompt for new bowler after over ends
        setTeamSetupModal({ fields: ['bowler'] });
      }, 500);
    }
  };

  // Opens the wicket modal after validation
  const handleWicketButtonClick = () => {
    // Check if current over is already complete (6 legal balls)
    const currentLegalBalls = currentOver.filter(
      (b) => b.type !== 'WD' && b.type !== 'NB',
    ).length;

    if (currentLegalBalls >= 6) {
      return;
    }

    // Validate players
    const missingFields: ('striker' | 'nonStriker' | 'bowler')[] = [];
    if (!currentBatsman) missingFields.push('striker');
    if (!nonStriker) missingFields.push('nonStriker');
    if (!currentBowler) missingFields.push('bowler');
    if (missingFields.length > 0) {
      setPendingBallAfterSelect(() => handleWicketButtonClick);
      setTeamSetupModal({ fields: missingFields });
      return;
    }

    // Save state before making changes (for undo)
    const batsmanName = onStrike === 'striker' ? currentBatsman : nonStriker;
    setPendingWicketContext({
      batsmanName,
      onStrikeWas: onStrike,
      previousBatsmenStats: JSON.parse(JSON.stringify(batsmenStats)),
      previousBowlerStats: JSON.parse(JSON.stringify(bowlerStats)),
      previousFielderStats: JSON.parse(JSON.stringify(fielderStats)),
      previousTotalRuns: totalRuns,
      previousWickets: wickets,
      previousExtras: JSON.parse(JSON.stringify(extras)),
      previousTotalBalls: totalBalls,
      previousFirstInningsBalls: firstInningsBalls,
      previousCurrentOver: JSON.parse(JSON.stringify(currentOver)),
      previousAllOvers: JSON.parse(JSON.stringify(allOvers)),
    });
    setWicketModalBatsmanName(batsmanName);
    setWicketModalFieldingPlayers(getBowlingTeamPlayers());
    setWicketModalForceDismissal(undefined);
    setWicketModalOpen(true);
  };

  const handleRunOutWithRuns = (runsCompleted: number) => {
    const currentLegalBalls = currentOver.filter(
      (b) => b.type !== 'WD' && b.type !== 'NB',
    ).length;
    if (currentLegalBalls >= 6) {
      alert(
        'Over is complete! Please wait for the new over to start or refresh if stuck.',
      );
      return;
    }
    if (!currentBatsman || currentBatsman === '') {
      alert('Please select the striker batsman before scoring!');
      return;
    }
    if (!nonStriker || nonStriker === '') {
      alert('Please select the non-striker batsman before scoring!');
      return;
    }
    if (!currentBowler || currentBowler === '') {
      alert('Please select the bowler before scoring!');
      return;
    }
    const batsmanName = onStrike === 'striker' ? currentBatsman : nonStriker;
    setPendingWicketContext({
      batsmanName,
      onStrikeWas: onStrike,
      previousBatsmenStats: JSON.parse(JSON.stringify(batsmenStats)),
      previousBowlerStats: JSON.parse(JSON.stringify(bowlerStats)),
      previousFielderStats: JSON.parse(JSON.stringify(fielderStats)),
      previousTotalRuns: totalRuns,
      previousWickets: wickets,
      previousExtras: JSON.parse(JSON.stringify(extras)),
      previousTotalBalls: totalBalls,
      previousFirstInningsBalls: firstInningsBalls,
      previousCurrentOver: JSON.parse(JSON.stringify(currentOver)),
      previousAllOvers: JSON.parse(JSON.stringify(allOvers)),
      runsBeforeOut: runsCompleted,
    });
    setWicketModalBatsmanName(batsmanName);
    setWicketModalFieldingPlayers(getBowlingTeamPlayers());
    setWicketModalForceDismissal('run-out');
    setWicketModalOpen(true);
  };

  const processWicket = (
    dismissalType:
      | 'caught'
      | 'bowled'
      | 'lbw'
      | 'run-out'
      | 'stumped'
      | 'hit-wicket',
    fielderName: string,
  ) => {
    setWicketModalOpen(false);
    if (!pendingWicketContext) return;

    const {
      batsmanName,
      onStrikeWas,
      previousBatsmenStats,
      previousBowlerStats,
      previousFielderStats,
      previousTotalRuns,
      previousWickets,
      previousExtras,
      previousTotalBalls,
      previousFirstInningsBalls,
      previousCurrentOver,
      previousAllOvers,
      runsBeforeOut,
    } = pendingWicketContext;
    setPendingWicketContext(null);

    const extraRuns = runsBeforeOut ?? 0;
    const newBall: Ball = {
      type: 'W',
      runs: extraRuns,
      fielder: fielderName || undefined,
      dismissalType,
    };
    const updatedOver = [...currentOver, newBall];

    setWickets(wickets + 1);
    setCurrentOver(updatedOver);
    if (extraRuns > 0) {
      setTotalRuns(previousTotalRuns + extraRuns);
    }

    // Save action for undo
    setActionHistory([
      ...actionHistory,
      {
        type: 'wicket',
        ball: newBall,
        batsmanName,
        bowlerName: currentBowler,
        onStrikeWas,
        batsmenStatsBefore: previousBatsmenStats,
        bowlerStatsBefore: previousBowlerStats,
        fielderStatsBefore: previousFielderStats,
        totalRunsBefore: previousTotalRuns,
        wicketsBefore: previousWickets,
        extrasBefore: previousExtras,
        totalBallsBefore: previousTotalBalls,
        firstInningsBallsBefore: previousFirstInningsBalls,
        currentOverBefore: previousCurrentOver,
        allOversBefore: previousAllOvers,
      },
    ]);

    // Update player stats
    updateBatsmanStats(extraRuns, false, false);
    if (extraRuns > 0 && [1, 3, 5].includes(extraRuns)) {
      setOnStrike(onStrikeWas === 'striker' ? 'non-striker' : 'striker');
    }
    // Run-out does NOT count as a wicket for the bowler (cricket rule)
    updateBowlerStats(extraRuns, dismissalType !== 'run-out', true, 'W');

    // Update fielder stats if fielder was selected
    if (fielderName) {
      updateFielderStats(fielderName);
    }

    // Determine all-out threshold based on actual team size
    const battingPlayers = getBattingTeamPlayers();
    const allOutWickets = Math.max(battingPlayers.length - 1, 1);
    const newWickets = wickets + 1;

    // Check if 1st innings all out — still track the ball then stop
    if (!targetMode && newWickets >= allOutWickets) {
      // Track total balls for this final wicket ball
      const newFirstInningsBalls = firstInningsBalls + 1;
      setFirstInningsBalls(newFirstInningsBalls);
      // Complete the over if needed
      const legalBallsFinal = updatedOver.filter(
        (b) => b.type !== 'WD' && b.type !== 'NB',
      );
      if (legalBallsFinal.length === 6) {
        setTimeout(() => {
          setAllOvers([...allOvers, updatedOver]);
          setCurrentOver([]);
          setOnStrike(onStrikeWas === 'striker' ? 'non-striker' : 'striker');
        }, 500);
      }
      return;
    }

    // New batsman comes on strike — open setup modal only if someone is available
    const newDismissed =
      onStrikeWas === 'striker'
        ? [...dismissedBatsmen, currentBatsman]
        : [...dismissedBatsmen, nonStriker];

    const allBatters = getBattingTeamPlayers();
    const currentNonStriker =
      onStrikeWas === 'striker' ? nonStriker : currentBatsman;
    const stillAvailable = allBatters.filter(
      (p) => !newDismissed.includes(p) && p !== currentNonStriker,
    );

    const needsNewBatsman = stillAvailable.length > 0;
    const batsmanField: 'striker' | 'nonStriker' =
      onStrikeWas === 'striker' ? 'striker' : 'nonStriker';

    if (onStrikeWas === 'striker') {
      setDismissedBatsmen(newDismissed);
      setCurrentBatsman('');
    } else {
      setDismissedBatsmen(newDismissed);
      setNonStriker('');
      setOnStrike('non-striker');
    }

    // Track total balls
    if (innings === 1) {
      setFirstInningsBalls(firstInningsBalls + 1);
    } else {
      setTotalBalls(totalBalls + 1);
    }

    // Complete over after 6 legal balls
    const legalBalls = updatedOver.filter(
      (b) => b.type !== 'WD' && b.type !== 'NB',
    );
    if (legalBalls.length === 6) {
      // Over ends + wicket: combine batsman & bowler into one modal so neither gets overwritten
      setTimeout(() => {
        setAllOvers([...allOvers, updatedOver]);
        setCurrentOver([]);
        setOnStrike(onStrikeWas === 'striker' ? 'non-striker' : 'striker');
        if (needsNewBatsman) {
          setTeamSetupModal({ fields: [batsmanField, 'bowler'] });
        } else {
          setTeamSetupModal({ fields: ['bowler'] });
        }
      }, 500);
    } else if (needsNewBatsman) {
      // Mid-over wicket: only need a new batsman
      setTeamSetupModal({ fields: [batsmanField] });
    }
  };

  const resetMatch = () => {
    setTotalRuns(0);
    setWickets(0);
    setCurrentOver([]);
    setAllOvers([]);
    setExtras({ wides: 0, noBalls: 0 });
    setTotalBalls(0);
    setActionHistory([]);
    setTossWinner(null);
    sessionStorage.removeItem('tossWinner');

    // Reset stats but keep teams
    setBatsmenStats([]);
    setBowlerStats([]);
    setFielderStats([]);
    sessionStorage.removeItem('batsmenStats');
    sessionStorage.removeItem('bowlerStats');
    sessionStorage.removeItem('fielderStats');

    // Reset player selections
    setCurrentBatsman('');
    setNonStriker('');
    setCurrentBowler('');
    setOnStrike('striker');

    // Go back to player setup
    setMatchStarted(false);
  };

  const startSecondInnings = () => {
    // Validate that first innings was played (check if there's a target to set)
    if (totalRuns === 0 && firstInningsBalls === 0) {
      alert('⚠️ Cannot start 2nd innings! No runs scored in the 1st innings.');
      return;
    }

    // Save first innings stats for match summary
    setInnings1BatsmenStats(JSON.parse(JSON.stringify(batsmenStats)));
    setInnings1BowlerStats(JSON.parse(JSON.stringify(bowlerStats)));
    setInnings1FielderStats(JSON.parse(JSON.stringify(fielderStats)));
    setInnings1Score(totalRuns);
    setInnings1Wickets(wickets);
    const totalOvers1st = allOvers.length;
    const currentOverBalls1st = getLegalBallsCount();
    setInnings1Overs(`${totalOvers1st}.${currentOverBalls1st}`);

    // Set target (first innings + 1)
    setTarget(totalRuns + 1);
    // Second innings always gets the full match overs allocation
    setMaxBalls(matchOvers * 6);
    setTargetMode(true);
    setInnings(2);

    // Reset match data for second innings
    setTotalRuns(0);
    setWickets(0);
    setCurrentOver([]);
    setAllOvers([]);
    setExtras({ wides: 0, noBalls: 0 });
    setTotalBalls(0);
    setActionHistory([]);

    // Reset stats for second innings
    setBatsmenStats([]);
    setBowlerStats([]);
    setFielderStats([]);
    sessionStorage.removeItem('batsmenStats');
    sessionStorage.removeItem('bowlerStats');
    sessionStorage.removeItem('fielderStats');

    // Reset player selections but stay in match
    setCurrentBatsman('');
    setNonStriker('');
    setCurrentBowler('');
    setOnStrike('striker');
    setDismissedBatsmen([]);

    // Show player selection modals for 2nd innings
    setTimeout(() => {
      setTeamSetupModal({ fields: ['striker', 'nonStriker', 'bowler'] });
    }, 100);
  };

  const resetFullMatch = () => {
    resetMatch();
    setInnings(1);
    setFirstInningsBalls(0);
    setTargetMode(false);
    setTarget(0);
    setMaxBalls(0);
  };

  const endMatch = () => {
    // Save 2nd innings data and complete match
    const totalBalls2nd = totalBalls;
    setInnings2Score(totalRuns);
    setInnings2Wickets(wickets);
    setInnings2Overs(`${Math.floor(totalBalls2nd / 6)}.${totalBalls2nd % 6}`);
    setTimeout(() => {
      setMatchCompleted(true);
    }, 100);
  };

  // Uncomment if you want a separate "Reset Everything" button
  // const resetEverything = () => {
  //   // Reset all match data
  //   resetMatch();
  //   setInnings(1);
  //   setFirstInningsBalls(0);
  //   setTargetMode(false);
  //   setTarget(0);
  //   setMaxBalls(0);

  //   // Reset player names
  //   setCurrentBatsman('');
  //   setNonStriker('');
  //   setCurrentBowler('');
  //   setOnStrike('striker');

  //   // Go back to player setup (keeps team rosters)
  //   setMatchStarted(false);

  //   // Reset stats only (keep team rosters and names)
  //   setBatsmenStats([]);
  //   setBowlerStats([]);

  //   // Clear only stats from sessionStorage, preserve team data
  //   sessionStorage.removeItem('batsmenStats');
  //   sessionStorage.removeItem('bowlerStats');
  // };

  const undoLastBall = () => {
    if (actionHistory.length === 0) {
      alert('Nothing to undo!');
      return;
    }

    // Get the last action from history
    const lastAction = actionHistory[actionHistory.length - 1];

    // Restore all state from before the last action
    setBatsmenStats(lastAction.batsmenStatsBefore);
    setBowlerStats(lastAction.bowlerStatsBefore);
    setFielderStats(lastAction.fielderStatsBefore);
    setTotalRuns(lastAction.totalRunsBefore);
    setWickets(lastAction.wicketsBefore);
    setExtras(lastAction.extrasBefore);
    setTotalBalls(lastAction.totalBallsBefore);
    setFirstInningsBalls(lastAction.firstInningsBallsBefore);
    setCurrentOver(lastAction.currentOverBefore);
    setAllOvers(lastAction.allOversBefore);

    // Restore the batsman who got out (if it was a wicket)
    if (lastAction.ball.type === 'W') {
      if (lastAction.onStrikeWas === 'striker') {
        setCurrentBatsman(lastAction.batsmanName);
      } else {
        setNonStriker(lastAction.batsmanName);
      }
    }

    // Restore strike if needed
    setOnStrike(lastAction.onStrikeWas);

    // Remove the last action from history
    setActionHistory(actionHistory.slice(0, -1));
  };

  const getBallDisplay = (ball: Ball) => {
    if (ball.type === 'W') return ball.runs > 0 ? `${ball.runs}W` : 'W';
    if (ball.type === 'WD') {
      const extra = ball.runs - 1;
      return extra > 0 ? `WD+${extra}` : 'WD';
    }
    if (ball.type === 'NB') {
      const extra = ball.runs - 1;
      return extra > 0 ? `NB+${extra}` : 'NB';
    }
    return ball.runs.toString();
  };

  const calculateManOfTheMatch = () => {
    // Combine all batsmen and bowlers from both innings
    const allBatsmen = [...innings1BatsmenStats, ...batsmenStats];
    const allBowlers = [...innings1BowlerStats, ...bowlerStats];

    // Determine winning team
    const team2Won = innings2Score >= target;
    const winningTeamIndex = team2Won ? 2 : 1;

    // Calculate points for each batsman
    const batsmenWithPoints = allBatsmen.map((batsman) => {
      let points = 0;

      // Base points: 1 point per run
      points += batsman.runs;

      // Bonus for milestones
      if (batsman.runs >= 50) points += 20;
      else if (batsman.runs >= 30) points += 10;

      // Strike rate bonus (if SR > 150)
      if (batsman.balls > 0) {
        const strikeRate = (batsman.runs / batsman.balls) * 100;
        if (strikeRate > 150) points += 15;
        else if (strikeRate > 120) points += 10;
      }

      // Boundaries bonus
      points += batsman.fours * 2;
      points += batsman.sixes * 4;

      // Winning team bonus
      if (batsman.innings === winningTeamIndex) points += 15;

      return { ...batsman, points };
    });

    // Calculate points for each bowler
    const bowlersWithPoints = allBowlers.map((bowler) => {
      let points = 0;

      // Base points: 20 points per wicket
      points += bowler.wickets * 20;

      // Bonus for multiple wickets
      if (bowler.wickets >= 3) points += 25;
      else if (bowler.wickets >= 2) points += 10;

      // Economy rate bonus (if economy < 6)
      if (bowler.overs > 0) {
        const economy = bowler.runsConceded / bowler.overs;
        if (economy < 4) points += 20;
        else if (economy < 6) points += 10;
      }

      // Penalty for expensive bowling (economy > 10)
      if (bowler.overs > 0) {
        const economy = bowler.runsConceded / bowler.overs;
        if (economy > 10) points -= 10;
      }

      // Winning team bonus
      if (bowler.innings === winningTeamIndex) points += 15;

      return { ...bowler, points };
    });

    // Find player with highest points
    const topBatsman = batsmenWithPoints.reduce(
      (prev, current) => (current.points > prev.points ? current : prev),
      {
        name: '',
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        innings: 1,
        points: 0,
      },
    );

    const topBowler = bowlersWithPoints.reduce(
      (prev, current) => (current.points > prev.points ? current : prev),
      {
        name: '',
        runsConceded: 0,
        wickets: 0,
        balls: 0,
        overs: 0,
        innings: 1,
        points: 0,
        wides: 0,
        noBalls: 0,
      },
    );

    // Compare and select MOTM
    if (topBatsman.points > topBowler.points) {
      const strikeRate =
        topBatsman.balls > 0
          ? ((topBatsman.runs / topBatsman.balls) * 100).toFixed(1)
          : '0.0';
      return {
        name: topBatsman.name,
        reason: `${topBatsman.runs} runs (${topBatsman.balls}b, ${topBatsman.fours}×4, ${topBatsman.sixes}×6, SR: ${strikeRate})`,
      };
    } else if (topBowler.wickets > 0) {
      const economy =
        topBowler.overs > 0
          ? (topBowler.runsConceded / topBowler.overs).toFixed(2)
          : '0.00';
      return {
        name: topBowler.name,
        reason: `${topBowler.wickets} wicket${
          topBowler.wickets !== 1 ? 's' : ''
        } for ${topBowler.runsConceded} runs (Econ: ${economy})`,
      };
    } else {
      // Fallback to highest scorer if no bowler took wickets
      const strikeRate =
        topBatsman.balls > 0
          ? ((topBatsman.runs / topBatsman.balls) * 100).toFixed(1)
          : '0.0';
      return {
        name: topBatsman.name || 'No standout performance',
        reason: topBatsman.name
          ? `${topBatsman.runs} runs (${topBatsman.balls}b, SR: ${strikeRate})`
          : 'Match completed',
      };
    }
  };

  const getMatchResult = () => {
    // Chasing team = team that bats in innings 2
    const chasingTeamNum = tossWinner === 1 ? matchTeamB : matchTeamA;
    const defendingTeamNum = tossWinner === 1 ? matchTeamA : matchTeamB;
    const chasingTeamName = getTeamName(chasingTeamNum);
    const defendingTeamName = getTeamName(defendingTeamNum);

    const chasingTeamWon = innings2Score >= target;
    const winningTeam = chasingTeamWon ? chasingTeamName : defendingTeamName;

    let winMargin = '';
    if (chasingTeamWon) {
      // Calculate wickets remaining based on actual chasing team size
      const chasingTeamPlayers = getTeamPlayersList(chasingTeamNum);
      const totalWickets = chasingTeamPlayers.length - 1;
      const wicketsRemaining = totalWickets - innings2Wickets;
      winMargin = `by ${wicketsRemaining} wicket${
        wicketsRemaining !== 1 ? 's' : ''
      }`;
    } else {
      const runsDifference = target - innings2Score - 1;
      winMargin = `by ${runsDifference} run${runsDifference !== 1 ? 's' : ''}`;
    }

    return { winningTeam, winMargin };
  };

  const handleNewMatchFromSummary = () => {
    // Clear all session storage when starting a new match
    sessionStorage.clear();

    // Reset all match state
    setMatchCompleted(false);
    setMatchStarted(false);
    setInnings(1);
    setTargetMode(false);
    setTarget(0);
    setMaxBalls(0);
    setFirstInningsBalls(0);
    setTotalRuns(0);
    setWickets(0);
    setCurrentOver([]);
    setAllOvers([]);
    setExtras({ wides: 0, noBalls: 0 });
    setTotalBalls(0);
    setActionHistory([]);
    setTossWinner(null);

    // Clear innings stats
    setInnings1BatsmenStats([]);
    setInnings1BowlerStats([]);
    setInnings1FielderStats([]);
    setInnings1Score(0);
    setInnings1Wickets(0);
    setInnings1Overs('');
    setInnings2Score(0);
    setInnings2Wickets(0);
    setInnings2Overs('');

    // Reset current stats
    setBatsmenStats([]);
    setBowlerStats([]);
    setFielderStats([]);

    // Reset player selections
    setCurrentBatsman('');
    setNonStriker('');
    setCurrentBowler('');
    setOnStrike('striker');
  };

  const getLegalBallsCount = () => {
    return currentOver.filter((b) => b.type !== 'WD' && b.type !== 'NB').length;
  };

  const runsRequired = target - totalRuns;
  const ballsRemaining = targetMode ? Math.max(0, maxBalls - totalBalls) : 0;
  const battingTeamSize =
    innings === 2 ? team2Players.length : team1Players.length;
  const wicketsLeft = Math.max(0, battingTeamSize - 1 - wickets);
  const runRate =
    (innings === 1 ? firstInningsBalls : totalBalls) > 0
      ? (
          (totalRuns / (innings === 1 ? firstInningsBalls : totalBalls)) *
          6
        ).toFixed(2)
      : '0.00';
  const requiredRunRate =
    targetMode && ballsRemaining > 0
      ? ((runsRequired / ballsRemaining) * 6).toFixed(2)
      : '0.00';

  const totalOvers = allOvers.length;
  const currentOverNumber = getLegalBallsCount();
  const oversDisplay = `${totalOvers}.${currentOverNumber}`;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getThemeBg()} flex items-center justify-center p-4`}
    >
      <ThemeColorPicker
        theme={theme}
        onThemeChange={setTheme}
        getTextColor={getTextColor}
        getGlassColor={getGlassColor}
        getBorderColor={getBorderColor}
      />

      <div className='w-full max-w-6xl'>
        <div
          className={`${getGlassColor()} backdrop-blur-xl rounded-3xl border ${getBorderColor()} shadow-2xl p-6 md:p-8`}
        >
          <div className='text-center mb-8'>
            <h1
              className={`text-4xl md:text-5xl font-bold ${getTextColor()} mb-2`}
            >
              🏏 Flateby Cricket
            </h1>
            <p className={`text-xl ${getTextColorLight()}`}>Scoreboard</p>
          </div>

          {!matchStarted ? (
            <PlayerSetup
              team1Name={team1Name}
              team2Name={team2Name}
              team3Name={team3Name}
              team1Players={team1Players}
              team2Players={team2Players}
              team3Players={team3Players}
              matchTeamA={matchTeamA}
              matchTeamB={matchTeamB}
              matchOvers={matchOvers}
              tossWinner={tossWinner}
              onTeam1NameChange={setTeam1Name}
              onTeam2NameChange={setTeam2Name}
              onTeam3NameChange={setTeam3Name}
              onMatchTeamAChange={setMatchTeamA}
              onMatchTeamBChange={setMatchTeamB}
              onMatchOversChange={setMatchOvers}
              onTossWinnerChange={setTossWinner}
              onAddPlayer={addPlayerToTeam}
              onAddPlayerByName={addPlayerToTeamByName}
              onMovePlayer={movePlayerToTeam}
              onRemovePlayer={removePlayerFromTeam}
              newPlayerName={newPlayerName}
              onNewPlayerNameChange={setNewPlayerName}
              addingToTeam={addingToTeam}
              onSetAddingToTeam={setAddingToTeam}
              onStartMatch={startMatch}
              getGlassColor={getGlassColor}
              getBorderColor={getBorderColor}
              getTextColor={getTextColor}
              getTextColorLight={getTextColorLight}
              getPlaceholderColor={getPlaceholderColor}
            />
          ) : matchCompleted ? (
            <MatchSummary
              team1Name={tossWinner === 1 ? activeTeamAName : activeTeamBName}
              team2Name={tossWinner === 1 ? activeTeamBName : activeTeamAName}
              team1Score={innings1Score}
              team1Wickets={innings1Wickets}
              team2Score={innings2Score}
              team2Wickets={innings2Wickets}
              team1Overs={innings1Overs}
              team2Overs={innings2Overs}
              winningTeam={getMatchResult().winningTeam}
              winMargin={getMatchResult().winMargin}
              innings1BatsmenStats={innings1BatsmenStats}
              innings1BowlerStats={innings1BowlerStats}
              innings1FielderStats={innings1FielderStats}
              innings2BatsmenStats={batsmenStats}
              innings2BowlerStats={bowlerStats}
              innings2FielderStats={fielderStats}
              manOfTheMatch={calculateManOfTheMatch()}
              onNewMatch={handleNewMatchFromSummary}
              getTextColor={getTextColor}
              getTextColorLight={getTextColorLight}
              getGlassColor={getGlassColor}
              getBorderColor={getBorderColor}
            />
          ) : (
            <>
              <TeamNameInput
                team1Name={activeTeamAName}
                team2Name={activeTeamBName}
                innings={innings}
                tossWinner={tossWinner}
                onTeam1Change={setTeam1Name}
                onTeam2Change={setTeam2Name}
                getGlassColor={getGlassColor}
                getBorderColor={getBorderColor}
                getTextColor={getTextColor}
                getTextColorLight={getTextColorLight}
                getPlaceholderColor={getPlaceholderColor}
              />

              <ScoreDisplay
                totalRuns={totalRuns}
                wickets={wickets}
                oversDisplay={oversDisplay}
                innings={innings}
                targetMode={targetMode}
                target={target}
                runsRequired={runsRequired}
                ballsRemaining={ballsRemaining}
                wicketsLeft={wicketsLeft}
                runRate={runRate}
                requiredRunRate={requiredRunRate}
                matchOvers={matchOvers}
                theme={theme}
                getGlassColor={getGlassColor}
                getBorderColor={getBorderColor}
                getTextColor={getTextColor}
                getTextColorLight={getTextColorLight}
              />

              <ExtrasDisplay
                wides={extras.wides}
                noBalls={extras.noBalls}
                getGlassColor={getGlassColor}
                getBorderColor={getBorderColor}
                getTextColor={getTextColor}
              />

              <BatsmanInput
                currentBatsman={currentBatsman}
                nonStriker={nonStriker}
                onStrike={onStrike}
                onCurrentBatsmanChange={setCurrentBatsman}
                onNonStrikerChange={setNonStriker}
                onStrikeToggle={() =>
                  setOnStrike(
                    onStrike === 'striker' ? 'non-striker' : 'striker',
                  )
                }
                availablePlayers={getBattingTeamPlayers()}
                getGlassColor={getGlassColor}
                getBorderColor={getBorderColor}
                getTextColor={getTextColor}
                getTextColorLight={getTextColorLight}
                getPlaceholderColor={getPlaceholderColor}
              />

              <BowlerInput
                currentBowler={currentBowler}
                onBowlerChange={setCurrentBowler}
                availablePlayers={getBowlingTeamPlayers()}
                getGlassColor={getGlassColor}
                getBorderColor={getBorderColor}
                getTextColor={getTextColor}
                getTextColorLight={getTextColorLight}
                getPlaceholderColor={getPlaceholderColor}
              />

              <CurrentOver
                currentOver={currentOver}
                legalBallsCount={getLegalBallsCount()}
                theme={theme}
                getGlassColor={getGlassColor}
                getBorderColor={getBorderColor}
                getTextColor={getTextColor}
                getBallDisplay={getBallDisplay}
              />

              <BallTypeButtons
                onBallClick={addBall}
                onWicket={handleWicketButtonClick}
                onRunOutWithRuns={handleRunOutWithRuns}
                getTextColor={getTextColor}
                getTextColorLight={getTextColorLight}
                getGlassColor={getGlassColor}
                getBorderColor={getBorderColor}
                getPlaceholderColor={getPlaceholderColor}
              />

              <ActionButtons
                innings={innings}
                onUndo={undoLastBall}
                onResetMatch={resetMatch}
                onStartSecondInnings={startSecondInnings}
                onResetFullMatch={resetFullMatch}
                onEndMatch={endMatch}
                getTextColor={getTextColor}
              />

              <PreviousOvers
                allOvers={allOvers}
                theme={theme}
                getGlassColor={getGlassColor}
                getBorderColor={getBorderColor}
                getTextColor={getTextColor}
                getTextColorLight={getTextColorLight}
                getBallDisplay={getBallDisplay}
              />

              <Statistics
                batsmenStats={batsmenStats}
                bowlerStats={bowlerStats}
                theme={theme}
                getGlassColor={getGlassColor}
                getBorderColor={getBorderColor}
                getTextColor={getTextColor}
                getTextColorLight={getTextColorLight}
              />

              <div className='text-center pt-6 border-t border-white/20'>
                <p className='text-white/60 flex items-center justify-center gap-2'>
                  Made with love by Ahmed Waqar 🖤
                  <a
                    href='https://www.linkedin.com/in/waqarmalyk/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-400 hover:text-blue-300 transition-colors'
                    title='Connect on LinkedIn'
                  >
                    <svg
                      className='w-5 h-5'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                    </svg>
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Milestone Popup */}
      {milestone && (
        <MilestonePopup
          playerName={milestone.playerName}
          milestone={milestone.milestone}
          type={milestone.type}
          onClose={() => setMilestone(null)}
        />
      )}

      {/* Wicket Modal */}
      {wicketModalOpen && (
        <WicketModal
          fieldingPlayers={wicketModalFieldingPlayers}
          batsmanName={wicketModalBatsmanName}
          onConfirm={processWicket}
          forceDismissal={wicketModalForceDismissal}
          onCancel={() => {
            setWicketModalOpen(false);
            setPendingWicketContext(null);
          }}
          getTextColor={getTextColor}
          getGlassColor={getGlassColor}
          getBorderColor={getBorderColor}
        />
      )}

      {/* Team Setup Modal (striker / non-striker / bowler) */}
      {teamSetupModal && (
        <TeamSetupModal
          battingPlayers={getBattingTeamPlayers()}
          bowlingPlayers={getBowlingTeamPlayers()}
          dismissedBatsmen={dismissedBatsmen}
          initialStriker={currentBatsman}
          initialNonStriker={nonStriker}
          initialBowler={currentBowler}
          fields={teamSetupModal.fields}
          onConfirm={(s, ns, b) => {
            if (teamSetupModal.fields.includes('striker')) setCurrentBatsman(s);
            if (teamSetupModal.fields.includes('nonStriker')) setNonStriker(ns);
            if (teamSetupModal.fields.includes('bowler')) setCurrentBowler(b);
            setTeamSetupModal(null);
          }}
          onCancel={() => {
            setTeamSetupModal(null);
            setPendingBallAfterSelect(null);
          }}
          getTextColor={getTextColor}
          getGlassColor={getGlassColor}
          getBorderColor={getBorderColor}
        />
      )}
    </div>
  );
}

export default App;
