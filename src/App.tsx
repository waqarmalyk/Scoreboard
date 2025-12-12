import { useState, useEffect } from 'react';
import './App.css';

type BallType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'W' | 'WD' | 'NB';
type ThemeColor =
  | 'purple'
  | 'teal'
  | 'emerald'
  | 'rose'
  | 'blue'
  | 'orange'
  | 'pink'
  | 'black'
  | 'white';

interface Ball {
  type: BallType;
  runs: number;
}

interface PlayerStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  innings: number;
}

interface BowlerStats {
  name: string;
  runsConceded: number;
  wickets: number;
  overs: number;
  balls: number;
  innings: number;
}

function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeColor>(
    () => (localStorage.getItem('theme') as ThemeColor) || 'black'
  );
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load from localStorage or use defaults
  const [team1Name, setTeam1Name] = useState(
    () => localStorage.getItem('team1Name') || 'Team 1'
  );
  const [team2Name, setTeam2Name] = useState(
    () => localStorage.getItem('team2Name') || 'Team 2'
  );
  const [currentBatsman, setCurrentBatsman] = useState('Batsman 1');
  const [nonStriker, setNonStriker] = useState('Batsman 2');
  const [onStrike, setOnStrike] = useState<'striker' | 'non-striker'>(
    'striker'
  );
  const [currentBowler, setCurrentBowler] = useState('Bowler 1');

  // Player statistics
  const [batsmenStats, setBatsmenStats] = useState<PlayerStats[]>(() => {
    const saved = localStorage.getItem('batsmenStats');
    return saved ? JSON.parse(saved) : [];
  });
  const [bowlerStats, setBowlerStats] = useState<BowlerStats[]>(() => {
    const saved = localStorage.getItem('bowlerStats');
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

  // Target mode state
  const [targetMode, setTargetMode] = useState(false);
  const [target, setTarget] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [maxBalls, setMaxBalls] = useState(0);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('team1Name', team1Name);
    localStorage.setItem('team2Name', team2Name);
    localStorage.setItem('batsmenStats', JSON.stringify(batsmenStats));
    localStorage.setItem('bowlerStats', JSON.stringify(bowlerStats));
    localStorage.setItem('theme', theme);
  }, [team1Name, team2Name, batsmenStats, bowlerStats, theme]);

  const changeTheme = (newTheme: ThemeColor) => {
    setTheme(newTheme);
    setShowColorPicker(false);
  };

  // Get background gradient based on theme
  const getThemeBg = () => {
    const gradients: Record<ThemeColor, string> = {
      purple: 'from-purple-600 via-violet-600 to-purple-700',
      teal: 'from-teal-400 via-cyan-500 to-blue-500',
      emerald: 'from-emerald-500 via-green-600 to-teal-600',
      rose: 'from-rose-500 via-pink-600 to-red-600',
      blue: 'from-blue-600 via-indigo-600 to-purple-700',
      orange: 'from-orange-500 via-amber-600 to-yellow-500',
      pink: 'from-pink-500 via-fuchsia-600 to-purple-600',
      black: 'from-gray-900 via-gray-800 to-black',
      white: 'from-gray-100 via-gray-50 to-white',
    };
    return gradients[theme];
  };

  const getTextColor = () =>
    theme === 'white' ? 'text-gray-900' : 'text-white';
  const getTextColorLight = () =>
    theme === 'white' ? 'text-gray-700' : 'text-white/80';
  const getPlaceholderColor = () =>
    theme === 'white' ? 'placeholder-gray-400' : 'placeholder-white/50';
  const getGlassColor = () =>
    theme === 'white' ? 'bg-gray-900/10' : 'bg-white/10';
  const getBorderColor = () =>
    theme === 'white' ? 'border-gray-900/20' : 'border-white/20';

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
    isLegal: boolean
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
        },
      ]);
    }
  };

  const addBall = (type: BallType, runs: number) => {
    // Validate batsman names
    if (currentBatsman === 'Batsman 1' || currentBatsman === 'New Batsman') {
      alert('Please set the striker batsman name before scoring!');
      return;
    }
    if (nonStriker === 'Batsman 2' || nonStriker === 'New Batsman') {
      alert('Please set the non-striker batsman name before scoring!');
      return;
    }

    // Validate bowler name
    if (currentBowler === 'Bowler 1') {
      alert('Please set the bowler name before scoring!');
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

    const newBall: Ball = { type, runs };
    const updatedOver = [...currentOver, newBall];

    const newTotalRuns = totalRuns + runs;
    setTotalRuns(newTotalRuns);
    setCurrentOver(updatedOver);

    // Check if target is achieved in 2nd innings
    if (targetMode && newTotalRuns >= target) {
      setTimeout(() => {
        alert(
          `🎉 Congratulations! ${
            innings === 1 ? team1Name : team2Name
          } wins by ${10 - wickets} wickets! 🎉`
        );
      }, 500);
    }

    // Update extras
    if (type === 'WD') {
      setExtras({ ...extras, wides: extras.wides + runs });
    } else if (type === 'NB') {
      setExtras({ ...extras, noBalls: extras.noBalls + runs });
    }

    // Update player stats
    const isLegal = type !== 'WD' && type !== 'NB';
    if (isLegal) {
      updateBatsmanStats(runs, type === '4', type === '6');
      // Rotate strike on odd runs (1, 3) or after completing over
      if ([1, 3].includes(runs)) {
        setOnStrike(onStrike === 'striker' ? 'non-striker' : 'striker');
      }
    }
    updateBowlerStats(runs, false, isLegal);

    // Track total balls (for both innings)
    if (type !== 'WD' && type !== 'NB') {
      if (innings === 1) {
        setFirstInningsBalls(firstInningsBalls + 1);
      } else {
        setTotalBalls(totalBalls + 1);
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
        // Rotate strike at end of over
        setOnStrike(onStrike === 'striker' ? 'non-striker' : 'striker');
      }, 500);
    }
  };

  const addWicket = () => {
    // Validate batsman names
    if (currentBatsman === 'Batsman 1' || currentBatsman === 'New Batsman') {
      alert('Please set the striker batsman name before scoring!');
      return;
    }
    if (nonStriker === 'Batsman 2' || nonStriker === 'New Batsman') {
      alert('Please set the non-striker batsman name before scoring!');
      return;
    }

    // Validate bowler name
    if (currentBowler === 'Bowler 1') {
      alert('Please set the bowler name before scoring!');
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

    const newBall: Ball = { type: 'W', runs: 0 };
    const updatedOver = [...currentOver, newBall];

    setWickets(wickets + 1);
    setCurrentOver(updatedOver);

    // Update player stats
    updateBatsmanStats(0, false, false);
    updateBowlerStats(0, true, true);

    // New batsman comes on strike
    if (onStrike === 'striker') {
      setCurrentBatsman('New Batsman');
    } else {
      setNonStriker('New Batsman');
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
  };

  const startSecondInnings = () => {
    // Set target (first innings + 1)
    setTarget(totalRuns + 1);
    setMaxBalls(firstInningsBalls);
    setTargetMode(true);
    setInnings(2);

    // Reset for second innings
    resetMatch();

    // Reset player names for new innings and prompt user
    setCurrentBatsman('Batsman 1');
    setNonStriker('Batsman 2');
    setCurrentBowler('Bowler 1');
    setOnStrike('striker');

    // Prompt user to set new players
    setTimeout(() => {
      alert(
        '⚠️ 2nd Innings Started! Please enter the names for new batsmen and bowler before scoring.'
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
    setBatsmenStats([]);
    setBowlerStats([]);
    localStorage.removeItem('batsmenStats');
    localStorage.removeItem('bowlerStats');
  };

  const resetEverything = () => {
    // Reset all match data
    resetMatch();
    setInnings(1);
    setFirstInningsBalls(0);
    setTargetMode(false);
    setTarget(0);
    setMaxBalls(0);

    // Reset player names
    setCurrentBatsman('Batsman 1');
    setNonStriker('Batsman 2');
    setCurrentBowler('Bowler 1');
    setOnStrike('striker');

    // Reset team names
    setTeam1Name('Team 1');
    setTeam2Name('Team 2');

    // Reset stats
    setBatsmenStats([]);
    setBowlerStats([]);

    // Clear all localStorage
    localStorage.clear();
  };

  const undoLastBall = () => {
    if (currentOver.length > 0) {
      const lastBall = currentOver[currentOver.length - 1];
      setTotalRuns(totalRuns - lastBall.runs);

      if (lastBall.type === 'W') {
        setWickets(wickets - 1);
      } else if (lastBall.type === 'WD') {
        setExtras({ ...extras, wides: extras.wides - lastBall.runs });
      } else if (lastBall.type === 'NB') {
        setExtras({ ...extras, noBalls: extras.noBalls - lastBall.runs });
      }

      // Update total balls based on innings
      if (lastBall.type !== 'WD' && lastBall.type !== 'NB') {
        if (innings === 1) {
          setFirstInningsBalls(Math.max(0, firstInningsBalls - 1));
        } else {
          setTotalBalls(Math.max(0, totalBalls - 1));
        }
      }

      setCurrentOver(currentOver.slice(0, -1));
    } else if (allOvers.length > 0) {
      const lastOver = allOvers[allOvers.length - 1];
      const lastBall = lastOver[lastOver.length - 1];

      setTotalRuns(totalRuns - lastBall.runs);

      if (lastBall.type === 'W') {
        setWickets(wickets - 1);
      }

      // Update total balls based on innings
      if (lastBall.type !== 'WD' && lastBall.type !== 'NB') {
        if (innings === 1) {
          setFirstInningsBalls(Math.max(0, firstInningsBalls - 1));
        } else {
          setTotalBalls(Math.max(0, totalBalls - 1));
        }
      }

      setCurrentOver(lastOver.slice(0, -1));
      setAllOvers(allOvers.slice(0, -1));
    }
  };

  const getBallDisplay = (ball: Ball) => {
    if (ball.type === 'W') return 'W';
    if (ball.type === 'WD') return `${ball.runs}WD`;
    if (ball.type === 'NB') return `${ball.runs}NB`;
    return ball.runs.toString();
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
      {/* Floating Color Picker */}
      <div className='fixed right-4 top-1/2 -translate-y-1/2 z-50'>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className={`${getGlassColor()} backdrop-blur-md ${getTextColor()} rounded-full w-14 h-14 flex items-center justify-center shadow-2xl border-2 ${getBorderColor()} ${
            theme === 'white' ? 'hover:bg-gray-900/20' : 'hover:bg-white/30'
          } transition-all duration-300 hover:scale-110 text-2xl`}
          title='Change Theme'
        >
          🎨
        </button>
        {showColorPicker && (
          <div className='absolute right-16 top-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/40 min-w-[200px]'>
            <h3 className='text-gray-800 font-bold mb-3 text-sm'>
              Choose Theme
            </h3>
            <div className='flex flex-col gap-2'>
              {[
                {
                  name: 'Purple',
                  value: 'purple' as ThemeColor,
                  gradient: 'from-purple-600 via-violet-600 to-purple-700',
                },
                {
                  name: 'Teal',
                  value: 'teal' as ThemeColor,
                  gradient: 'from-teal-400 via-cyan-500 to-blue-500',
                },
                {
                  name: 'Emerald',
                  value: 'emerald' as ThemeColor,
                  gradient: 'from-emerald-500 via-green-600 to-teal-600',
                },
                {
                  name: 'Rose',
                  value: 'rose' as ThemeColor,
                  gradient: 'from-rose-500 via-pink-600 to-red-600',
                },
                {
                  name: 'Blue',
                  value: 'blue' as ThemeColor,
                  gradient: 'from-blue-600 via-indigo-600 to-purple-700',
                },
                {
                  name: 'Orange',
                  value: 'orange' as ThemeColor,
                  gradient: 'from-orange-500 via-amber-600 to-yellow-500',
                },
                {
                  name: 'Pink',
                  value: 'pink' as ThemeColor,
                  gradient: 'from-pink-500 via-fuchsia-600 to-purple-600',
                },
                {
                  name: 'Black',
                  value: 'black' as ThemeColor,
                  gradient: 'from-gray-900 via-gray-800 to-black',
                },
                {
                  name: 'White',
                  value: 'white' as ThemeColor,
                  gradient: 'from-gray-100 via-gray-50 to-white',
                },
              ].map((color) => (
                <button
                  key={color.value}
                  onClick={() => changeTheme(color.value)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    theme === color.value
                      ? 'bg-gradient-to-r ' + color.gradient + ' text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${color.gradient}`}
                  ></div>
                  <span className='font-semibold text-sm'>{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

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
                      ? setTeam1Name(e.target.value)
                      : setTeam2Name(e.target.value)
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
                      ? setTeam2Name(e.target.value)
                      : setTeam1Name(e.target.value)
                  }
                  placeholder='Team Name'
                  className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
                />
              </div>
            </div>
          </div>

          <div
            className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 mb-6`}
          >
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-end gap-2'>
                <span
                  className={`text-6xl md:text-7xl font-bold ${getTextColor()}`}
                >
                  {totalRuns}
                </span>
                <span
                  className={`text-4xl md:text-5xl font-bold ${
                    theme === 'white' ? 'text-gray-600' : 'text-white/70'
                  }`}
                >
                  /{wickets}
                </span>
              </div>
              <div className='bg-purple-500/40 backdrop-blur-md border border-purple-300/50 rounded-lg px-4 py-2'>
                <span className={`${getTextColor()} font-semibold`}>
                  {innings === 1 ? '1st Innings' : '2nd Innings'}
                </span>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${getTextColor()} mb-4`}>
              <span className={getTextColorLight()}>Overs:</span>
              <span className='text-2xl font-semibold'>{oversDisplay}</span>
            </div>
            {targetMode && (
              <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
                <div
                  className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
                >
                  <span className={`${getTextColorLight()} text-sm block mb-1`}>
                    Target:
                  </span>
                  <span className={`${getTextColor()} font-bold text-lg`}>
                    {target}
                  </span>
                </div>
                <div
                  className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
                >
                  <span className={`${getTextColorLight()} text-sm block mb-1`}>
                    Need:
                  </span>
                  <span className={`${getTextColor()} font-bold text-lg`}>
                    {runsRequired > 0 ? runsRequired : 0} runs
                  </span>
                </div>
                <div
                  className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
                >
                  <span className={`${getTextColorLight()} text-sm block mb-1`}>
                    Balls Left:
                  </span>
                  <span className={`${getTextColor()} font-bold text-lg`}>
                    {ballsRemaining}
                  </span>
                </div>
                <div
                  className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
                >
                  <span className={`${getTextColorLight()} text-sm block mb-1`}>
                    CRR:
                  </span>
                  <span className={`${getTextColor()} font-bold text-lg`}>
                    {runRate}
                  </span>
                </div>
                <div
                  className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
                >
                  <span className={`${getTextColorLight()} text-sm block mb-1`}>
                    RRR:
                  </span>
                  <span className={`${getTextColor()} font-bold text-lg`}>
                    {requiredRunRate}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className='flex gap-4 mb-6'>
            <div
              className={`${getGlassColor()} backdrop-blur-md rounded-lg border ${getBorderColor()} px-4 py-2 ${getTextColor()} flex-1 text-center`}
            >
              Wides: {extras.wides}
            </div>
            <div
              className={`${getGlassColor()} backdrop-blur-md rounded-lg border ${getBorderColor()} px-4 py-2 ${getTextColor()} flex-1 text-center`}
            >
              No Balls: {extras.noBalls}
            </div>
          </div>

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
                <input
                  type='text'
                  value={currentBatsman}
                  onChange={(e) => setCurrentBatsman(e.target.value)}
                  placeholder='Batsman 1'
                  className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
                />
              </div>
            </div>
            <button
              className='bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-10 h-10 md:w-12 md:h-12 text-xl md:text-2xl transition-all duration-200 hover:scale-110 hover:rotate-180 flex items-center justify-center flex-shrink-0'
              onClick={() =>
                setOnStrike(onStrike === 'striker' ? 'non-striker' : 'striker')
              }
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
                <input
                  type='text'
                  value={nonStriker}
                  onChange={(e) => setNonStriker(e.target.value)}
                  placeholder='Batsman 2'
                  className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
                />
              </div>
            </div>
          </div>

          <div
            className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-4 flex items-center gap-3 mb-6`}
          >
            <div className='text-3xl flex-shrink-0'>⚾</div>
            <div className='flex-1 overflow-hidden'>
              <label className={`${getTextColorLight()} text-sm block mb-1`}>
                Current Bowler:
              </label>
              <input
                type='text'
                value={currentBowler}
                onChange={(e) => setCurrentBowler(e.target.value)}
                placeholder='Bowler Name'
                className={`w-full ${getGlassColor()} border ${getBorderColor()} rounded-lg px-3 py-2 ${getTextColor()} ${getPlaceholderColor()} focus:outline-none focus:ring-2 focus:ring-purple-300/50`}
              />
            </div>
          </div>

          <div
            className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 mb-6`}
          >
            <h3
              className={`text-xl font-semibold ${getTextColor()} mb-4 text-center`}
            >
              Current Over
            </h3>
            <div className='flex gap-4 justify-center flex-wrap'>
              {currentOver.map((ball, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${getTextColor()} border-2 ${
                    ball.type === 'W'
                      ? 'bg-red-500/70 border-red-300'
                      : ball.type === '4'
                      ? 'bg-blue-500/70 border-blue-300'
                      : ball.type === '6'
                      ? 'bg-green-500/70 border-green-300'
                      : ball.type === 'WD' || ball.type === 'NB'
                      ? 'bg-yellow-500/70 border-yellow-300'
                      : ball.type === '0'
                      ? 'bg-gray-500/70 border-gray-300'
                      : 'bg-purple-500/70 border-purple-300'
                  }`}
                >
                  {getBallDisplay(ball)}
                </div>
              ))}
              {[...Array(6 - getLegalBallsCount())].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'white' ? 'text-gray-300' : 'text-white/30'
                  } border-2 ${getBorderColor()} ${getGlassColor()}`}
                >
                  -
                </div>
              ))}
            </div>
          </div>

          <div
            className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 mb-6`}
          >
            <h3
              className={`text-xl font-semibold ${getTextColor()} mb-4 text-center`}
            >
              Ball Types
            </h3>
            <div className='flex flex-wrap gap-4 justify-center'>
              <button
                className={`bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('0', 0)}
              >
                <div className='text-2xl font-bold leading-none'>0</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  dot
                </small>
              </button>
              <button
                className={`bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('1', 1)}
              >
                <div className='text-2xl font-bold leading-none'>1</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  run
                </small>
              </button>
              <button
                className={`bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('2', 2)}
              >
                <div className='text-2xl font-bold leading-none'>2</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  runs
                </small>
              </button>
              <button
                className={`bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('3', 3)}
              >
                <div className='text-2xl font-bold leading-none'>3</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  runs
                </small>
              </button>
              <button
                className={`bg-purple-500/40 backdrop-blur-md border-2 border-purple-300/50 hover:bg-purple-500/60 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('5', 5)}
              >
                <div className='text-2xl font-bold leading-none'>5</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  runs
                </small>
              </button>
              <button
                className={`bg-blue-500/50 backdrop-blur-md border-2 border-blue-300/50 hover:bg-blue-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('4', 4)}
              >
                <div className='text-2xl font-bold leading-none'>4</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  runs
                </small>
              </button>
              <button
                className={`bg-green-500/50 backdrop-blur-md border-2 border-green-300/50 hover:bg-green-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('6', 6)}
              >
                <div className='text-2xl font-bold leading-none'>6</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  runs
                </small>
              </button>
              <button
                className={`bg-red-500/50 backdrop-blur-md border-2 border-red-300/50 hover:bg-red-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={addWicket}
              >
                <div className='text-2xl font-bold leading-none'>W</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  wicket
                </small>
              </button>
              <button
                className={`bg-yellow-500/50 backdrop-blur-md border-2 border-yellow-300/50 hover:bg-yellow-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('WD', 1)}
              >
                <div className='text-xl font-bold leading-none'>WD</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  wide
                </small>
              </button>
              <button
                className={`bg-yellow-500/50 backdrop-blur-md border-2 border-yellow-300/50 hover:bg-yellow-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('WD', 5)}
              >
                <div className='text-xl font-bold leading-none'>WD4</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  wide
                </small>
              </button>
              <button
                className={`bg-yellow-500/50 backdrop-blur-md border-2 border-yellow-300/50 hover:bg-yellow-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('NB', 1)}
              >
                <div className='text-xl font-bold leading-none'>NB</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  no ball
                </small>
              </button>
              <button
                className={`bg-yellow-500/50 backdrop-blur-md border-2 border-yellow-300/50 hover:bg-yellow-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('NB', 5)}
              >
                <div className='text-xl font-bold leading-none'>NB4</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  no ball
                </small>
              </button>
              <button
                className={`bg-yellow-500/50 backdrop-blur-md border-2 border-yellow-300/50 hover:bg-yellow-500/70 rounded-full w-20 h-20 md:w-24 md:h-24 ${getTextColor()} transition-all duration-200 hover:scale-110 flex flex-col items-center justify-center gap-0.5`}
                onClick={() => addBall('NB', 7)}
              >
                <div className='text-xl font-bold leading-none'>NB6</div>
                <small
                  className={`text-[0.6rem] ${getTextColorLight()} lowercase`}
                >
                  no ball
                </small>
              </button>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 md:gap-4 mb-6'>
            <button
              className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105`}
              onClick={undoLastBall}
            >
              ↶ Undo
            </button>
            {innings === 1 ? (
              <>
                <button
                  className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105`}
                  onClick={resetMatch}
                >
                  🔄 New Match
                </button>
                <button
                  className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105 col-span-2`}
                  onClick={startSecondInnings}
                >
                  🏁 Start 2nd Innings
                </button>
              </>
            ) : (
              <button
                className={`bg-purple-500/40 backdrop-blur-md border border-purple-300/50 hover:bg-purple-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105 col-span-2`}
                onClick={resetFullMatch}
              >
                ❌ New Match
              </button>
            )}
            <button
              className={`bg-red-500/40 backdrop-blur-md border border-red-300/50 hover:bg-red-500/60 rounded-lg px-4 md:px-6 py-3 md:py-4 ${getTextColor()} font-semibold transition-all duration-200 hover:scale-105 col-span-2`}
              onClick={resetEverything}
            >
              🗑️ Reset Everything
            </button>
          </div>

          {allOvers.length > 0 && (
            <div
              className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 mb-6`}
            >
              <h3 className={`text-xl font-semibold ${getTextColor()} mb-4`}>
                Previous Overs
              </h3>
              <div className='space-y-3'>
                {allOvers.map((over, overIndex) => (
                  <div
                    key={overIndex}
                    className={`${getGlassColor()} rounded-lg p-3 border ${getBorderColor()}`}
                  >
                    <span className={`${getTextColorLight()} font-semibold`}>
                      Over {overIndex + 1}:
                    </span>
                    <div className='flex gap-2 flex-wrap my-2'>
                      {over.map((ball, ballIndex) => (
                        <span
                          key={ballIndex}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getTextColor()} ${
                            ball.type === 'W'
                              ? 'bg-red-500/70'
                              : ball.type === '4'
                              ? 'bg-blue-500/70'
                              : ball.type === '6'
                              ? 'bg-green-500/70'
                              : ball.type === 'WD' || ball.type === 'NB'
                              ? 'bg-yellow-500/70'
                              : ball.type === '0'
                              ? 'bg-gray-500/70'
                              : 'bg-purple-500/70'
                          }`}
                        >
                          {getBallDisplay(ball)}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`${
                        theme === 'white' ? 'text-gray-500' : 'text-white/60'
                      } text-sm`}
                    >
                      ({over.reduce((sum, ball) => sum + ball.runs, 0)} runs)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(batsmenStats.length > 0 || bowlerStats.length > 0) && (
            <div className='mb-6'>
              {/* Display stats for all innings */}
              {[1, 2].map(
                (inning) =>
                  (batsmenStats.filter((b) => b.innings === inning).length >
                    0 ||
                    bowlerStats.filter((b) => b.innings === inning).length >
                      0) && (
                    <div key={inning} className='w-full mb-6'>
                      <h2
                        className={`text-center ${getTextColor()} text-2xl md:text-3xl font-bold my-4`}
                      >
                        Innings {inning} Statistics
                      </h2>
                      <div className='flex gap-6 justify-center flex-wrap'>
                        {batsmenStats.filter((b) => b.innings === inning)
                          .length > 0 && (
                          <div
                            className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 flex-1 min-w-[300px]`}
                          >
                            <h3
                              className={`text-xl font-semibold ${getTextColor()} mb-4`}
                            >
                              🏏 Batting
                            </h3>
                            <div className='overflow-x-auto'>
                              <div
                                className={`grid grid-cols-7 gap-2 ${getTextColorLight()} text-sm font-semibold mb-2 pb-2 border-b ${getBorderColor()}`}
                              >
                                <span className='col-span-2'>Batsman</span>
                                <span className='text-center'>Runs</span>
                                <span className='text-center'>Balls</span>
                                <span className='text-center'>4s</span>
                                <span className='text-center'>6s</span>
                                <span className='text-center'>SR</span>
                              </div>
                              {batsmenStats
                                .filter((b) => b.innings === inning)
                                .map((batsman, index) => (
                                  <div
                                    key={index}
                                    className={`grid grid-cols-7 gap-2 ${getTextColor()} py-2 border-b ${
                                      theme === 'white'
                                        ? 'border-gray-900/10'
                                        : 'border-white/10'
                                    }`}
                                  >
                                    <span className='font-medium col-span-2'>
                                      {batsman.name}
                                    </span>
                                    <span className='text-center'>
                                      {batsman.runs}
                                    </span>
                                    <span className='text-center'>
                                      {batsman.balls}
                                    </span>
                                    <span className='text-center'>
                                      {batsman.fours}
                                    </span>
                                    <span className='text-center'>
                                      {batsman.sixes}
                                    </span>
                                    <span className='text-center'>
                                      {batsman.balls > 0
                                        ? (
                                            (batsman.runs / batsman.balls) *
                                            100
                                          ).toFixed(1)
                                        : '0.0'}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {bowlerStats.filter((b) => b.innings === inning)
                          .length > 0 && (
                          <div
                            className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 flex-1 min-w-[300px]`}
                          >
                            <h3
                              className={`text-xl font-semibold ${getTextColor()} mb-4`}
                            >
                              ⚾ Bowling
                            </h3>
                            <div className='overflow-x-auto'>
                              <div
                                className={`grid grid-cols-6 gap-2 ${getTextColorLight()} text-sm font-semibold mb-2 pb-2 border-b ${getBorderColor()}`}
                              >
                                <span className='col-span-2'>Bowler</span>
                                <span className='text-center'>Overs</span>
                                <span className='text-center'>Runs</span>
                                <span className='text-center'>Wickets</span>
                                <span className='text-center'>Econ</span>
                              </div>
                              {bowlerStats
                                .filter((b) => b.innings === inning)
                                .map((bowler, index) => (
                                  <div
                                    key={index}
                                    className={`grid grid-cols-6 gap-2 ${getTextColor()} py-2 border-b ${
                                      theme === 'white'
                                        ? 'border-gray-900/10'
                                        : 'border-white/10'
                                    }`}
                                  >
                                    <span className='font-medium col-span-2'>
                                      {bowler.name}
                                    </span>
                                    <span className='text-center'>
                                      {Math.floor(bowler.balls / 6)}.
                                      {bowler.balls % 6}
                                    </span>
                                    <span className='text-center'>
                                      {bowler.runsConceded}
                                    </span>
                                    <span className='text-center'>
                                      {bowler.wickets}
                                    </span>
                                    <span className='text-center'>
                                      {bowler.balls > 0
                                        ? (
                                            bowler.runsConceded /
                                            (bowler.balls / 6)
                                          ).toFixed(2)
                                        : '0.00'}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
              )}
            </div>
          )}

          <div className='text-center pt-6 border-t border-white/20'>
            <p className='text-white/60'>Made with love by Ahmed Waqar 🖤</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
