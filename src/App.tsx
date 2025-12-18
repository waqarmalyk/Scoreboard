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
  const [matchStarted, setMatchStarted] = useState(false);
  const [matchCompleted, setMatchCompleted] = useState(false);
  const [team1Players, setTeam1Players] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('team1Players');
    return saved ? JSON.parse(saved) : [];
  });
  const [team2Players, setTeam2Players] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('team2Players');
    return saved ? JSON.parse(saved) : [];
  });
  const [newPlayerName, setNewPlayerName] = useState('');
  const [addingToTeam, setAddingToTeam] = useState<1 | 2 | null>(null);

  // Load from sessionStorage or use defaults
  const [team1Name, setTeam1Name] = useState(
    () => sessionStorage.getItem('team1Name') || 'Team 1'
  );
  const [team2Name, setTeam2Name] = useState(
    () => sessionStorage.getItem('team2Name') || 'Team 2'
  );
  const [currentBatsman, setCurrentBatsman] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [onStrike, setOnStrike] = useState<'striker' | 'non-striker'>(
    'striker'
  );
  const [currentBowler, setCurrentBowler] = useState('');

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

  const [totalRuns, setTotalRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [currentOver, setCurrentOver] = useState<Ball[]>([]);
  const [allOvers, setAllOvers] = useState<Ball[][]>([]);
  const [extras, setExtras] = useState({
    wides: 0,
    noBalls: 0,
  });

  // Innings management
  const [innings, setInnings] = useState<1 | 2>(1);
  const [firstInningsBalls, setFirstInningsBalls] = useState(0);

  // Saved stats from innings
  const [innings1BatsmenStats, setInnings1BatsmenStats] = useState<
    PlayerStats[]
  >([]);
  const [innings1BowlerStats, setInnings1BowlerStats] = useState<BowlerStats[]>(
    []
  );
  const [innings1FielderStats, setInnings1FielderStats] = useState<
    FielderStats[]
  >([]);
  const [innings1Score, setInnings1Score] = useState(0);
  const [innings1Wickets, setInnings1Wickets] = useState(0);
  const [innings1Overs, setInnings1Overs] = useState('');

  const [innings2Score, setInnings2Score] = useState(0);
  const [innings2Wickets, setInnings2Wickets] = useState(0);
  const [innings2Overs, setInnings2Overs] = useState('');

  // Match configuration
  const [matchOvers, setMatchOvers] = useState(() => {
    const saved = sessionStorage.getItem('matchOvers');
    return saved ? parseInt(saved) : 0;
  });

  // Target mode state
  const [targetMode, setTargetMode] = useState(false);
  const [target, setTarget] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [maxBalls, setMaxBalls] = useState(0);

  // History for undo functionality
  const [lastAction, setLastAction] = useState<{
    type: 'ball' | 'wicket';
    ball: Ball;
    batsmanName: string;
    bowlerName: string;
    onStrikeWas: 'striker' | 'non-striker';
    batsmenStatsBefore: PlayerStats[];
    bowlerStatsBefore: BowlerStats[];
    fielderStatsBefore: FielderStats[];
  } | null>(null);

  // Persist to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('team1Name', team1Name);
    sessionStorage.setItem('team2Name', team2Name);
    sessionStorage.setItem('batsmenStats', JSON.stringify(batsmenStats));
    sessionStorage.setItem('bowlerStats', JSON.stringify(bowlerStats));
    sessionStorage.setItem('fielderStats', JSON.stringify(fielderStats));
    sessionStorage.setItem('team1Players', JSON.stringify(team1Players));
    sessionStorage.setItem('team2Players', JSON.stringify(team2Players));
    sessionStorage.setItem('matchOvers', matchOvers.toString());
  }, [
    team1Name,
    team2Name,
    batsmenStats,
    bowlerStats,
    fielderStats,
    team1Players,
    team2Players,
    matchOvers,
  ]);

  const addPlayerToTeam = (team: 1 | 2) => {
    if (!newPlayerName.trim()) {
      alert('Please enter a player name!');
      return;
    }

    const players = team === 1 ? team1Players : team2Players;

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
    } else {
      setTeam2Players([...team2Players, newPlayerName.trim()]);
    }
    setNewPlayerName('');
    setAddingToTeam(null);
  };

  const removePlayerFromTeam = (team: 1 | 2, playerName: string) => {
    if (team === 1) {
      setTeam1Players(team1Players.filter((p) => p !== playerName));
    } else {
      setTeam2Players(team2Players.filter((p) => p !== playerName));
    }
  };

  const startMatch = () => {
    if (team1Players.length === 0 || team2Players.length === 0) {
      alert('Please add at least one player to each team before starting!');
      return;
    }
    if (!matchOvers || matchOvers <= 0) {
      alert('Please set the number of overs for the match!');
      return;
    }
    // Set maxBalls for first innings based on overs
    setMaxBalls(matchOvers * 6);
    setMatchStarted(true);
  };

  const getBattingTeamPlayers = () => {
    return innings === 1 ? team1Players : team2Players;
  };

  const getBowlingTeamPlayers = () => {
    return innings === 1 ? team2Players : team1Players;
  };

  const updateBatsmanStats = (
    runs: number,
    isFour: boolean,
    isSix: boolean
  ) => {
    const activeBatsman = onStrike === 'striker' ? currentBatsman : nonStriker;
    const existingBatsman = batsmenStats.find(
      (b) => b.name === activeBatsman && b.innings === innings
    );
    if (existingBatsman) {
      setBatsmenStats(
        batsmenStats.map((b) =>
          b.name === activeBatsman && b.innings === innings
            ? {
                ...b,
                runs: b.runs + runs,
                balls: b.balls + 1,
                fours: b.fours + (isFour ? 1 : 0),
                sixes: b.sixes + (isSix ? 1 : 0),
              }
            : b
        )
      );
    } else {
      setBatsmenStats([
        ...batsmenStats,
        {
          name: activeBatsman,
          runs,
          balls: 1,
          fours: isFour ? 1 : 0,
          sixes: isSix ? 1 : 0,
          innings: innings,
        },
      ]);
    }
  };

  const updateBowlerStats = (
    runs: number,
    isWicket: boolean,
    isLegal: boolean,
    ballType: BallType
  ) => {
    const existingBowler = bowlerStats.find(
      (b) => b.name === currentBowler && b.innings === innings
    );
    if (existingBowler) {
      const newBalls = existingBowler.balls + (isLegal ? 1 : 0);
      setBowlerStats(
        bowlerStats.map((b) =>
          b.name === currentBowler && b.innings === innings
            ? {
                ...b,
                runsConceded: b.runsConceded + runs,
                wickets: b.wickets + (isWicket ? 1 : 0),
                balls: newBalls,
                overs: Math.floor(newBalls / 6) + (newBalls % 6) / 10,
                wides: b.wides + (ballType === 'WD' ? 1 : 0),
                noBalls: b.noBalls + (ballType === 'NB' ? 1 : 0),
              }
            : b
        )
      );
    } else {
      setBowlerStats([
        ...bowlerStats,
        {
          name: currentBowler,
          runsConceded: runs,
          wickets: isWicket ? 1 : 0,
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
      (f) => f.name === fielderName && f.innings === innings
    );
    if (existingFielder) {
      setFielderStats(
        fielderStats.map((f) =>
          f.name === fielderName && f.innings === innings
            ? { ...f, catches: f.catches + 1 }
            : f
        )
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
      (b) => b.type !== 'WD' && b.type !== 'NB'
    ).length;

    if (currentLegalBalls >= 6) {
      alert(
        'Over is complete! Please wait for the new over to start or refresh if stuck.'
      );
      return;
    }

    // Validate batsman names
    if (!currentBatsman || currentBatsman === '') {
      alert('Please select the striker batsman before scoring!');
      return;
    }
    if (!nonStriker || nonStriker === '') {
      alert('Please select the non-striker batsman before scoring!');
      return;
    }

    // Validate bowler name
    if (!currentBowler || currentBowler === '') {
      alert('Please select the bowler before scoring!');
      return;
    }

    // Prompt for bowler name at the start of a new over (after first over)
    if (currentOver.length === 0 && allOvers.length > 0) {
      const lastBowler = bowlerStats[bowlerStats.length - 1]?.name;
      if (lastBowler && currentBowler === lastBowler) {
        const confirmSameBowler = window.confirm(
          `Continue with same bowler (${currentBowler})? Click Cancel to change bowler.`
        );
        if (!confirmSameBowler) {
          alert('Please update the bowler name before starting the new over!');
          return;
        }
      }
    }

    // Save state before making changes (for undo)
    const batsmanName = onStrike === 'striker' ? currentBatsman : nonStriker;
    const previousBatsmenStats = JSON.parse(JSON.stringify(batsmenStats));
    const previousBowlerStats = JSON.parse(JSON.stringify(bowlerStats));
    const previousFielderStats = JSON.parse(JSON.stringify(fielderStats));

    const newBall: Ball = { type, runs };
    const updatedOver = [...currentOver, newBall];

    const newTotalRuns = totalRuns + runs;
    setTotalRuns(newTotalRuns);
    setCurrentOver(updatedOver);

    // Save action for undo
    setLastAction({
      type: 'ball',
      ball: newBall,
      batsmanName,
      bowlerName: currentBowler,
      onStrikeWas: onStrike,
      batsmenStatsBefore: previousBatsmenStats,
      bowlerStatsBefore: previousBowlerStats,
      fielderStatsBefore: previousFielderStats,
    });

    // Update extras
    if (type === 'WD') {
      setExtras({ ...extras, wides: extras.wides + runs });
    } else if (type === 'NB') {
      setExtras({ ...extras, noBalls: extras.noBalls + runs });
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
              'Overs completed! Click "Start 2nd Innings" to begin the chase.'
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
            `${Math.floor(newTotalBalls / 6)}.${newTotalBalls % 6}`
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
      (b) => b.type !== 'WD' && b.type !== 'NB'
    );
    if (legalBalls.length === 6) {
      // Delay moving to next over so user can see the 6th ball
      setTimeout(() => {
        setAllOvers([...allOvers, updatedOver]);
        setCurrentOver([]);

        // Strike rotation at end of over:
        // At the end of every over, strike ALWAYS rotates because bowling switches to the other end
        // - If last ball had odd runs (1,3,5): batsmen crossed during ball, then rotate again = same player retains strike
        // - If last ball had even runs (0,2,4,6): batsmen didn't cross, then rotate once = other player gets strike
        setOnStrike((prev) => (prev === 'striker' ? 'non-striker' : 'striker'));
      }, 500);
    }
  };

  const addWicket = () => {
    // Check if current over is already complete (6 legal balls)
    const currentLegalBalls = currentOver.filter(
      (b) => b.type !== 'WD' && b.type !== 'NB'
    ).length;

    if (currentLegalBalls >= 6) {
      alert(
        'Over is complete! Please wait for the new over to start or refresh if stuck.'
      );
      return;
    }

    // Validate batsman names
    if (!currentBatsman || currentBatsman === '') {
      alert('Please select the striker batsman before scoring!');
      return;
    }
    if (!nonStriker || nonStriker === '') {
      alert('Please select the non-striker batsman before scoring!');
      return;
    }

    // Validate bowler name
    if (!currentBowler || currentBowler === '') {
      alert('Please select the bowler before scoring!');
      return;
    }

    // Prompt for bowler name at the start of a new over (after first over)
    if (currentOver.length === 0 && allOvers.length > 0) {
      const lastBowler = bowlerStats[bowlerStats.length - 1]?.name;
      if (lastBowler && currentBowler === lastBowler) {
        const confirmSameBowler = window.confirm(
          `Continue with same bowler (${currentBowler})? Click Cancel to change bowler.`
        );
        if (!confirmSameBowler) {
          alert('Please update the bowler name before starting the new over!');
          return;
        }
      }
    }

    // Save state before making changes (for undo)
    const batsmanName = onStrike === 'striker' ? currentBatsman : nonStriker;
    const previousBatsmenStats = JSON.parse(JSON.stringify(batsmenStats));
    const previousBowlerStats = JSON.parse(JSON.stringify(bowlerStats));
    const previousFielderStats = JSON.parse(JSON.stringify(fielderStats));

    // Get fielding team players
    const fieldingTeamPlayers = getBowlingTeamPlayers();

    // Prompt for fielder who took the catch - keep prompting until valid input
    let fielderName = '';
    if (fieldingTeamPlayers.length > 0) {
      let validInput = false;

      while (!validInput) {
        const fielderPrompt = `Who took the catch?\n\n${fieldingTeamPlayers
          .map((p, i) => `${i + 1}. ${p}`)
          .join('\n')}\n\nEnter number (1-${
          fieldingTeamPlayers.length
        }) or type name:`;
        const fielderInput = window.prompt(fielderPrompt);

        // If user cancels, exit without recording wicket
        if (fielderInput === null) {
          return;
        }

        if (fielderInput) {
          const trimmedInput = fielderInput.trim();

          // If empty after trim, show error and continue loop
          if (!trimmedInput) {
            alert('Fielder name cannot be empty!');
            continue;
          }

          const fielderIndex = parseInt(trimmedInput) - 1;

          // Check if input is a number
          if (
            !isNaN(fielderIndex) &&
            trimmedInput === (fielderIndex + 1).toString()
          ) {
            // It's a number input - validate it's in range
            if (
              fielderIndex >= 0 &&
              fielderIndex < fieldingTeamPlayers.length
            ) {
              fielderName = fieldingTeamPlayers[fielderIndex];
              validInput = true;
            } else {
              alert(
                `Invalid selection! Please enter a number between 1 and ${fieldingTeamPlayers.length}`
              );
              // Continue loop to re-prompt
            }
          } else {
            // It's a name input - accept it
            fielderName = trimmedInput;
            validInput = true;
          }
        } else {
          alert('Fielder name cannot be empty!');
        }
      }
    }

    const newBall: Ball = {
      type: 'W',
      runs: 0,
      fielder: fielderName,
    };
    const updatedOver = [...currentOver, newBall];

    setWickets(wickets + 1);
    setCurrentOver(updatedOver);

    // Save action for undo
    setLastAction({
      type: 'wicket',
      ball: newBall,
      batsmanName,
      bowlerName: currentBowler,
      onStrikeWas: onStrike,
      batsmenStatsBefore: previousBatsmenStats,
      bowlerStatsBefore: previousBowlerStats,
      fielderStatsBefore: previousFielderStats,
    });

    setWickets(wickets + 1);
    setCurrentOver(updatedOver);

    // Update player stats
    updateBatsmanStats(0, false, false);
    updateBowlerStats(0, true, true, 'W');

    // Update fielder stats if fielder was selected
    if (fielderName) {
      updateFielderStats(fielderName);
    }

    // Check if all out in 2nd innings (bowling team wins)
    const newWickets = wickets + 1;
    if (targetMode && newWickets >= 10) {
      // Save second innings data before showing summary
      setInnings2Score(totalRuns);
      setInnings2Wickets(newWickets);
      const totalBalls2nd = totalBalls + 1;
      setInnings2Overs(`${Math.floor(totalBalls2nd / 6)}.${totalBalls2nd % 6}`);

      setTimeout(() => {
        setMatchCompleted(true);
      }, 500);
      return; // Don't process rest
    }

    // Check if 1st innings all out
    if (!targetMode && newWickets >= 10) {
      setTimeout(() => {
        alert('All out! Click "Start 2nd Innings" to begin the chase.');
      }, 500);
    }

    // New batsman comes on strike - clear the selection
    if (onStrike === 'striker') {
      setCurrentBatsman('');
    } else {
      setNonStriker('');
      // After wicket, new batsman is on strike
      setOnStrike('non-striker');
    }

    // Track total balls (for both innings)
    if (innings === 1) {
      setFirstInningsBalls(firstInningsBalls + 1);
    } else {
      setTotalBalls(totalBalls + 1);
    }

    // Complete over after 6 legal balls
    const legalBalls = updatedOver.filter(
      (b) => b.type !== 'WD' && b.type !== 'NB'
    );
    if (legalBalls.length === 6) {
      // Delay moving to next over so user can see the 6th ball
      setTimeout(() => {
        setAllOvers([...allOvers, updatedOver]);
        setCurrentOver([]);
        // Rotate strike at end of over
        setOnStrike(onStrike === 'striker' ? 'non-striker' : 'striker');
      }, 500);
    }
  };

  const resetMatch = () => {
    setTotalRuns(0);
    setWickets(0);
    setCurrentOver([]);
    setAllOvers([]);
    setExtras({ wides: 0, noBalls: 0 });
    setTotalBalls(0);
    setLastAction(null);

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
    // Use the lesser of: match overs OR first innings balls (in case first innings ended early)
    setMaxBalls(Math.min(matchOvers * 6, firstInningsBalls));
    setTargetMode(true);
    setInnings(2);

    // Reset match data for second innings
    setTotalRuns(0);
    setWickets(0);
    setCurrentOver([]);
    setAllOvers([]);
    setExtras({ wides: 0, noBalls: 0 });
    setTotalBalls(0);
    setLastAction(null);

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

    // Prompt user to set new players
    setTimeout(() => {
      alert(
        '⚠️ 2nd Innings Started! Please select the new batsmen and bowler before scoring.'
      );
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
    if (!lastAction) {
      alert('Nothing to undo!');
      return;
    }

    // Restore player stats from before the last action
    setBatsmenStats(lastAction.batsmenStatsBefore);
    setBowlerStats(lastAction.bowlerStatsBefore);
    setFielderStats(lastAction.fielderStatsBefore);

    // Get the ball to undo
    const ballToUndo = lastAction.ball;

    // Undo the runs
    setTotalRuns(totalRuns - ballToUndo.runs);

    // Undo wicket if applicable
    if (ballToUndo.type === 'W') {
      setWickets(wickets - 1);

      // Restore the batsman who got out
      if (lastAction.onStrikeWas === 'striker') {
        setCurrentBatsman(lastAction.batsmanName);
      } else {
        setNonStriker(lastAction.batsmanName);
      }
    }

    // Undo extras
    if (ballToUndo.type === 'WD') {
      setExtras({ ...extras, wides: extras.wides - ballToUndo.runs });
    } else if (ballToUndo.type === 'NB') {
      setExtras({ ...extras, noBalls: extras.noBalls - ballToUndo.runs });
    }

    // Undo total balls count
    const isLegal = ballToUndo.type !== 'WD' && ballToUndo.type !== 'NB';
    if (isLegal) {
      if (innings === 1) {
        setFirstInningsBalls(Math.max(0, firstInningsBalls - 1));
      } else {
        setTotalBalls(Math.max(0, totalBalls - 1));
      }
    }

    // Undo strike rotation if needed
    if (isLegal && [1, 3, 5].includes(ballToUndo.runs)) {
      setOnStrike(onStrike === 'striker' ? 'non-striker' : 'striker');
    }

    // Remove the ball from current over
    if (currentOver.length > 0) {
      setCurrentOver(currentOver.slice(0, -1));
    } else if (allOvers.length > 0) {
      // Ball was in a completed over, need to bring it back
      const lastOver = allOvers[allOvers.length - 1];
      const restoredOver = lastOver.slice(0, -1);

      if (restoredOver.length > 0) {
        setCurrentOver(restoredOver);
        setAllOvers(allOvers.slice(0, -1));
      } else {
        // The over only had one ball, remove it completely
        setAllOvers(allOvers.slice(0, -1));
      }

      // Undo end-of-over strike rotation
      // Need to check what the last legal ball of that over was
      const legalBalls = lastOver.filter(
        (b) => b.type !== 'WD' && b.type !== 'NB'
      );
      if (legalBalls.length > 0) {
        const lastLegalBall = legalBalls[legalBalls.length - 1];
        const hadOddRuns = [1, 3, 5].includes(lastLegalBall.runs);

        // Only undo the rotation if it actually happened
        // (it happens when last ball had even runs)
        if (!hadOddRuns) {
          setOnStrike(onStrike === 'striker' ? 'non-striker' : 'striker');
        }
      }
    }

    // Clear last action
    setLastAction(null);
  };

  const getBallDisplay = (ball: Ball) => {
    if (ball.type === 'W') return 'W';
    if (ball.type === 'WD') return `${ball.runs}WD`;
    if (ball.type === 'NB') return `${ball.runs}NB`;
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
      { name: '', runs: 0, balls: 0, fours: 0, sixes: 0, innings: 1, points: 0 }
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
      }
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
    const team2Won = innings2Score >= target;
    const winningTeam = team2Won ? team2Name : team1Name;

    let winMargin = '';
    if (team2Won) {
      // Calculate wickets remaining based on actual team size
      const team2TotalWickets = team2Players.length - 1;
      const wicketsRemaining = team2TotalWickets - innings2Wickets;
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
    setLastAction(null);

    // Clear innings stats
    setInnings1BatsmenStats([]);
    setInnings1BowlerStats([]);
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
    sessionStorage.removeItem('batsmenStats');
    sessionStorage.removeItem('bowlerStats');
    sessionStorage.removeItem('fielderStats');

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
              team1Players={team1Players}
              team2Players={team2Players}
              matchOvers={matchOvers}
              onTeam1NameChange={setTeam1Name}
              onTeam2NameChange={setTeam2Name}
              onMatchOversChange={setMatchOvers}
              onAddPlayer={addPlayerToTeam}
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
              team1Name={team1Name}
              team2Name={team2Name}
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
                team1Name={team1Name}
                team2Name={team2Name}
                innings={innings}
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
                    onStrike === 'striker' ? 'non-striker' : 'striker'
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
                onWicket={addWicket}
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
    </div>
  );
}

export default App;
