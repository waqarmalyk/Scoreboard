import { useState, useEffect } from 'react';
import './App.css';

type BallType = '0' | '1' | '2' | '3' | '4' | '5' | '6' | 'W' | 'WD' | 'NB';

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
  }, [team1Name, team2Name, batsmenStats, bowlerStats]);

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
    <div className='app-container'>
      <div className='app'>
        <div className='scoreboard'>
          <div className='header'>
            <h1>🏏 Flateby Cricket</h1>
            <p className='sub-heading'>Scoreboard</p>
          </div>

          <div className='teams-section'>
            <div className='team-input'>
              <div className='team-icon'>🏏</div>
              <div className='team-info'>
                <label> Team 1</label>
                <input
                  type='text'
                  value={innings === 1 ? team1Name : team2Name}
                  onChange={(e) =>
                    innings === 1
                      ? setTeam1Name(e.target.value)
                      : setTeam2Name(e.target.value)
                  }
                  placeholder='Team Name'
                />
              </div>
            </div>
            <div className='team-input'>
              <div className='team-icon'>⚾</div>
              <div className='team-info'>
                <label> Team 2</label>
                <input
                  type='text'
                  value={innings === 1 ? team2Name : team1Name}
                  onChange={(e) =>
                    innings === 1
                      ? setTeam2Name(e.target.value)
                      : setTeam1Name(e.target.value)
                  }
                  placeholder='Team Name'
                />
              </div>
            </div>
          </div>

          <div className='score-display'>
            <div className='score-innings-row'>
              <div className='main-score'>
                <span className='runs'>{totalRuns}</span>
                <span className='wickets'>/{wickets}</span>
              </div>
              <div className='innings-indicator'>
                {innings === 1 ? '1st Innings' : '2nd Innings'}
              </div>
            </div>
            <div className='overs'>
              <span className='overs-label'>Overs:</span>
              <span className='overs-value'>{oversDisplay}</span>
            </div>
            {targetMode && (
              <div className='target-info'>
                <div className='target-item'>
                  <span className='target-label'>Target:</span>
                  <span className='target-value'>{target}</span>
                </div>
                <div className='target-item'>
                  <span className='target-label'>Need:</span>
                  <span className='target-value'>
                    {runsRequired > 0 ? runsRequired : 0} runs
                  </span>
                </div>
                <div className='target-item'>
                  <span className='target-label'>Balls Left:</span>
                  <span className='target-value'>{ballsRemaining}</span>
                </div>
                <div className='target-item'>
                  <span className='target-label'>CRR:</span>
                  <span className='target-value'>{runRate}</span>
                </div>
                <div className='target-item'>
                  <span className='target-label'>RRR:</span>
                  <span className='target-value'>{requiredRunRate}</span>
                </div>
              </div>
            )}
          </div>

          <div className='extras-display'>
            <div className='extra-item'>Wides: {extras.wides}</div>
            <div className='extra-item'>No Balls: {extras.noBalls}</div>
          </div>

          <div className='players-section'>
            <div
              className={`player-card batsman-card ${
                onStrike === 'striker' ? 'on-strike' : ''
              }`}
            >
              <div className='player-icon'>🏏</div>
              <div className='player-info'>
                <label>
                  {onStrike === 'striker' ? 'Striker ⭐' : 'Non-Striker'}
                </label>
                <input
                  type='text'
                  value={currentBatsman}
                  onChange={(e) => setCurrentBatsman(e.target.value)}
                  placeholder='Batsman 1'
                />
              </div>
            </div>
            <button
              className='btn-switch'
              onClick={() =>
                setOnStrike(onStrike === 'striker' ? 'non-striker' : 'striker')
              }
              title='Switch Strike'
            >
              🔄
            </button>
            <div
              className={`player-card batsman-card ${
                onStrike === 'non-striker' ? 'on-strike' : ''
              }`}
            >
              <div className='player-icon'>🏏</div>
              <div className='player-info'>
                <label>
                  {onStrike === 'non-striker' ? 'Striker ⭐' : 'Non-Striker'}
                </label>
                <input
                  type='text'
                  value={nonStriker}
                  onChange={(e) => setNonStriker(e.target.value)}
                  placeholder='Batsman 2'
                />
              </div>
            </div>
            <div className='player-card bowler-card'>
              <div className='player-icon'>⚾</div>
              <div className='player-info'>
                <label>Current Bowler:</label>
                <input
                  type='text'
                  value={currentBowler}
                  onChange={(e) => setCurrentBowler(e.target.value)}
                  placeholder='Bowler Name'
                />
              </div>
            </div>
          </div>

          <div className='current-over'>
            <h3>Current Over</h3>
            <div className='balls-container'>
              {currentOver.map((ball, index) => (
                <div
                  key={index}
                  className={`ball ${ball.type === 'W' ? 'wicket' : ''} 
                  ${ball.type === '4' ? 'four' : ''} 
                  ${ball.type === '6' ? 'six' : ''}
                  ${ball.type === 'WD' || ball.type === 'NB' ? 'extra' : ''}
                  ${ball.type === '0' ? 'dot' : ''}`}
                >
                  {getBallDisplay(ball)}
                </div>
              ))}
              {[...Array(6 - getLegalBallsCount())].map((_, i) => (
                <div key={`empty-${i}`} className='ball empty'>
                  -
                </div>
              ))}
            </div>
          </div>

          <div className='controls'>
            <h3>Ball Types</h3>
            <div className='button-grid'>
              <button className='btn btn-dot' onClick={() => addBall('0', 0)}>
                <div>0</div>
                <small>dot</small>
              </button>
              <button className='btn btn-run' onClick={() => addBall('1', 1)}>
                <div>1</div>
                <small>run</small>
              </button>
              <button className='btn btn-run' onClick={() => addBall('2', 2)}>
                <div>2</div>
                <small>runs</small>
              </button>
              <button className='btn btn-run' onClick={() => addBall('3', 3)}>
                <div>3</div>
                <small>runs</small>
              </button>
              <button className='btn btn-run' onClick={() => addBall('5', 5)}>
                <div>5</div>
                <small>runs</small>
              </button>
              <button className='btn btn-four' onClick={() => addBall('4', 4)}>
                <div>4</div>
                <small>runs</small>
              </button>
              <button className='btn btn-six' onClick={() => addBall('6', 6)}>
                <div>6</div>
                <small>runs</small>
              </button>
              <button className='btn btn-wicket' onClick={addWicket}>
                <div>W</div>
                <small>wicket</small>
              </button>
              <button
                className='btn btn-extra'
                onClick={() => addBall('WD', 1)}
              >
                <div>WD</div>
                <small>wide</small>
              </button>
              <button
                className='btn btn-extra'
                onClick={() => addBall('WD', 5)}
              >
                <div>WD4</div>
                <small>wide</small>
              </button>
              <button
                className='btn btn-extra'
                onClick={() => addBall('NB', 1)}
              >
                <div>NB</div>
                <small>no ball</small>
              </button>
              <button
                className='btn btn-extra'
                onClick={() => addBall('NB', 5)}
              >
                <div>NB4</div>
                <small>no ball</small>
              </button>
              <button
                className='btn btn-extra'
                onClick={() => addBall('NB', 7)}
              >
                <div>NB6</div>
                <small>no ball</small>
              </button>
            </div>
          </div>

          <div className='action-buttons'>
            <button className='btn btn-undo' onClick={undoLastBall}>
              ↶ Undo
            </button>
            {innings === 1 ? (
              <>
                <button className='btn btn-reset' onClick={resetMatch}>
                  🔄 New Match
                </button>
                <button
                  className='btn btn-start-chase'
                  onClick={startSecondInnings}
                >
                  🏁 Start 2nd Innings
                </button>
              </>
            ) : (
              <button className='btn btn-exit-target' onClick={resetFullMatch}>
                ❌ New Match
              </button>
            )}
            <button className='btn btn-reset-all' onClick={resetEverything}>
              🗑️ Reset Everything
            </button>
          </div>

          {allOvers.length > 0 && (
            <div className='previous-overs'>
              <h3>Previous Overs</h3>
              <div className='overs-list'>
                {allOvers.map((over, overIndex) => (
                  <div key={overIndex} className='over-summary'>
                    <span className='over-number'>Over {overIndex + 1}:</span>
                    <div className='over-balls'>
                      {over.map((ball, ballIndex) => (
                        <span
                          key={ballIndex}
                          className={`ball-summary ${
                            ball.type === 'W' ? 'wicket' : ''
                          } 
                          ${ball.type === '4' ? 'four' : ''} 
                          ${ball.type === '6' ? 'six' : ''}
                          ${
                            ball.type === 'WD' || ball.type === 'NB'
                              ? 'extra'
                              : ''
                          }
                          ${ball.type === '0' ? 'dot' : ''}`}
                        >
                          {getBallDisplay(ball)}
                        </span>
                      ))}
                    </div>
                    <span className='over-runs'>
                      ({over.reduce((sum, ball) => sum + ball.runs, 0)} runs)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(batsmenStats.length > 0 || bowlerStats.length > 0) && (
            <div className='player-stats-section'>
              {/* Display stats for all innings */}
              {[1, 2].map(
                (inning) =>
                  (batsmenStats.filter((b) => b.innings === inning).length >
                    0 ||
                    bowlerStats.filter((b) => b.innings === inning).length >
                      0) && (
                    <div key={inning} style={{ width: '100%' }}>
                      <h2
                        style={{
                          textAlign: 'center',
                          color: '#667eea',
                          margin: '1rem 0',
                          fontSize: '1.5rem',
                        }}
                      >
                        Innings {inning} Statistics
                      </h2>
                      <div
                        style={{
                          display: 'flex',
                          gap: '2rem',
                          justifyContent: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        {batsmenStats.filter((b) => b.innings === inning)
                          .length > 0 && (
                          <div className='stats-card'>
                            <h3>🏏 Batting</h3>
                            <div className='stats-table'>
                              <div className='stats-header'>
                                <span>Batsman</span>
                                <span>Runs</span>
                                <span>Balls</span>
                                <span>4s</span>
                                <span>6s</span>
                                <span>SR</span>
                              </div>
                              {batsmenStats
                                .filter((b) => b.innings === inning)
                                .map((batsman, index) => (
                                  <div key={index} className='stats-row'>
                                    <span className='player-name'>
                                      {batsman.name}
                                    </span>
                                    <span>{batsman.runs}</span>
                                    <span>{batsman.balls}</span>
                                    <span>{batsman.fours}</span>
                                    <span>{batsman.sixes}</span>
                                    <span>
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
                          <div className='stats-card'>
                            <h3>⚾ Bowling</h3>
                            <div className='stats-table'>
                              <div className='stats-header'>
                                <span>Bowler</span>
                                <span>Overs</span>
                                <span>Runs</span>
                                <span>Wickets</span>
                                <span>Econ</span>
                              </div>
                              {bowlerStats
                                .filter((b) => b.innings === inning)
                                .map((bowler, index) => (
                                  <div key={index} className='stats-row'>
                                    <span className='player-name'>
                                      {bowler.name}
                                    </span>
                                    <span>
                                      {Math.floor(bowler.balls / 6)}.
                                      {bowler.balls % 6}
                                    </span>
                                    <span>{bowler.runsConceded}</span>
                                    <span>{bowler.wickets}</span>
                                    <span>
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
        </div>
      </div>
    </div>
  );
}

export default App;
