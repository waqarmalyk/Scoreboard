import { jsPDF } from 'jspdf';
import type { PlayerStats, BowlerStats, FielderStats } from '../types';

interface MatchSummaryProps {
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team1Wickets: number;
  team2Score: number;
  team2Wickets: number;
  team1Overs: string;
  team2Overs: string;
  winningTeam: string;
  winMargin: string;
  innings1BatsmenStats: PlayerStats[];
  innings1BowlerStats: BowlerStats[];
  innings1FielderStats: FielderStats[];
  innings2BatsmenStats: PlayerStats[];
  innings2BowlerStats: BowlerStats[];
  innings2FielderStats: FielderStats[];
  manOfTheMatch: { name: string; reason: string };
  onNewMatch: () => void;
  getTextColor: () => string;
  getTextColorLight: () => string;
  getGlassColor: () => string;
  getBorderColor: () => string;
}

export const MatchSummary: React.FC<MatchSummaryProps> = ({
  team1Name,
  team2Name,
  team1Score,
  team1Wickets,
  team2Score,
  team2Wickets,
  team1Overs,
  team2Overs,
  winningTeam,
  winMargin,
  innings1BatsmenStats,
  innings1BowlerStats,
  innings1FielderStats,
  innings2BatsmenStats,
  innings2BowlerStats,
  innings2FielderStats,
  manOfTheMatch,
  onNewMatch,
  getTextColor,
  getTextColorLight,
  getGlassColor,
  getBorderColor,
}) => {
  const generatePDF = () => {
    try {
      const pdf = new jsPDF();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Match Summary', 105, yPosition, { align: 'center' });
      yPosition += 15;

      // Match Result
      pdf.setFontSize(16);
      pdf.text(`${winningTeam} Won!`, 105, yPosition, { align: 'center' });
      yPosition += 8;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(winMargin, 105, yPosition, { align: 'center' });
      yPosition += 15;

      // Scorecard
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Scorecard', 20, yPosition);
      yPosition += 8;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `${team1Name}: ${team1Score}/${team1Wickets} (${team1Overs} overs)`,
        20,
        yPosition
      );
      yPosition += 6;
      pdf.text(
        `${team2Name}: ${team2Score}/${team2Wickets} (${team2Overs} overs)`,
        20,
        yPosition
      );
      yPosition += 12;

      // Man of the Match
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Man of the Match', 20, yPosition);
      yPosition += 8;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `${manOfTheMatch.name} - ${manOfTheMatch.reason}`,
        20,
        yPosition
      );
      yPosition += 15;

      // 1st Innings
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`1st Innings - ${team1Name} Batting`, 20, yPosition);
      yPosition += 8;

      // Batting table header
      pdf.setFontSize(10);
      pdf.text('Batsman', 20, yPosition);
      pdf.text('R', 90, yPosition);
      pdf.text('B', 105, yPosition);
      pdf.text('4s', 120, yPosition);
      pdf.text('6s', 135, yPosition);
      pdf.text('SR', 150, yPosition);
      yPosition += 6;

      // Batting stats
      pdf.setFont('helvetica', 'normal');
      innings1BatsmenStats.forEach((batsman) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        const sr =
          batsman.balls > 0
            ? ((batsman.runs / batsman.balls) * 100).toFixed(1)
            : '0.0';
        pdf.text(batsman.name.substring(0, 20), 20, yPosition);
        pdf.text(batsman.runs.toString(), 90, yPosition);
        pdf.text(batsman.balls.toString(), 105, yPosition);
        pdf.text(batsman.fours.toString(), 120, yPosition);
        pdf.text(batsman.sixes.toString(), 135, yPosition);
        pdf.text(sr, 150, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      // Bowling table header
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bowler', 20, yPosition);
      pdf.text('O', 85, yPosition);
      pdf.text('R', 100, yPosition);
      pdf.text('W', 115, yPosition);
      pdf.text('WD', 130, yPosition);
      pdf.text('NB', 145, yPosition);
      pdf.text('Econ', 160, yPosition);
      yPosition += 6;

      // Bowling stats
      pdf.setFont('helvetica', 'normal');
      innings1BowlerStats.forEach((bowler) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        const econ =
          bowler.overs > 0
            ? (bowler.runsConceded / bowler.overs).toFixed(2)
            : '0.00';
        pdf.text(bowler.name.substring(0, 20), 20, yPosition);
        pdf.text(bowler.overs.toFixed(1), 85, yPosition);
        pdf.text(bowler.runsConceded.toString(), 100, yPosition);
        pdf.text(bowler.wickets.toString(), 115, yPosition);
        pdf.text(bowler.wides?.toString() || '0', 130, yPosition);
        pdf.text(bowler.noBalls?.toString() || '0', 145, yPosition);
        pdf.text(econ, 160, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      // Fielding stats for 1st innings
      if (innings1FielderStats.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Fielding', 20, yPosition);
        yPosition += 6;
        pdf.text('Fielder', 20, yPosition);
        pdf.text('Catches', 100, yPosition);
        yPosition += 6;

        pdf.setFont('helvetica', 'normal');
        innings1FielderStats.forEach((fielder) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(fielder.name.substring(0, 20), 20, yPosition);
          pdf.text(fielder.catches.toString(), 100, yPosition);
          yPosition += 5;
        });
      }
      yPosition += 10;

      // Check if we need a new page
      if (yPosition > 220) {
        pdf.addPage();
        yPosition = 20;
      }

      // 2nd Innings
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`2nd Innings - ${team2Name} Batting`, 20, yPosition);
      yPosition += 8;

      // Batting table header
      pdf.setFontSize(10);
      pdf.text('Batsman', 20, yPosition);
      pdf.text('R', 90, yPosition);
      pdf.text('B', 105, yPosition);
      pdf.text('4s', 120, yPosition);
      pdf.text('6s', 135, yPosition);
      pdf.text('SR', 150, yPosition);
      yPosition += 6;

      // Batting stats
      pdf.setFont('helvetica', 'normal');
      innings2BatsmenStats.forEach((batsman) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        const sr =
          batsman.balls > 0
            ? ((batsman.runs / batsman.balls) * 100).toFixed(1)
            : '0.0';
        pdf.text(batsman.name.substring(0, 20), 20, yPosition);
        pdf.text(batsman.runs.toString(), 90, yPosition);
        pdf.text(batsman.balls.toString(), 105, yPosition);
        pdf.text(batsman.fours.toString(), 120, yPosition);
        pdf.text(batsman.sixes.toString(), 135, yPosition);
        pdf.text(sr, 150, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      // Bowling table header
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bowler', 20, yPosition);
      pdf.text('O', 85, yPosition);
      pdf.text('R', 100, yPosition);
      pdf.text('W', 115, yPosition);
      pdf.text('WD', 130, yPosition);
      pdf.text('NB', 145, yPosition);
      pdf.text('Econ', 160, yPosition);
      yPosition += 6;

      // Bowling stats
      pdf.setFont('helvetica', 'normal');
      innings2BowlerStats.forEach((bowler) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        const econ =
          bowler.overs > 0
            ? (bowler.runsConceded / bowler.overs).toFixed(2)
            : '0.00';
        pdf.text(bowler.name.substring(0, 20), 20, yPosition);
        pdf.text(bowler.overs.toFixed(1), 85, yPosition);
        pdf.text(bowler.runsConceded.toString(), 100, yPosition);
        pdf.text(bowler.wickets.toString(), 115, yPosition);
        pdf.text(bowler.wides?.toString() || '0', 130, yPosition);
        pdf.text(bowler.noBalls?.toString() || '0', 145, yPosition);
        pdf.text(econ, 160, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      // Fielding stats for 2nd innings
      if (innings2FielderStats.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Fielding', 20, yPosition);
        yPosition += 6;
        pdf.text('Fielder', 20, yPosition);
        pdf.text('Catches', 100, yPosition);
        yPosition += 6;

        pdf.setFont('helvetica', 'normal');
        innings2FielderStats.forEach((fielder) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(fielder.name.substring(0, 20), 20, yPosition);
          pdf.text(fielder.catches.toString(), 100, yPosition);
          yPosition += 5;
        });
      }

      // Add footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        pdf.text('Generated by Flateby Cricket Scoreboard', 105, 285, {
          align: 'center',
        });
      }

      // Save the PDF
      const fileName = `${team1Name}_vs_${team2Name}_Match_Summary.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
    }
  };

  const generateCSV = () => {
    try {
      let csv = '';

      // Player Statistics Header - matching the format
      csv +=
        'SpillerNavn,RunsScored,BallsFaced,TotalSixes,TotalFours,OversBowled,RunsGiven,WicketsTaken,Wides,NoBalls,Catches\n';

      // Create a map to combine all stats per player
      const playerStatsMap = new Map();

      // Add 1st innings batsmen (Team 1)
      innings1BatsmenStats.forEach((batsman) => {
        const key = `${batsman.name}_${team1Name}_1`;
        playerStatsMap.set(key, {
          name: batsman.name,
          team: team1Name,
          innings: 1,
          runs: batsman.runs,
          balls: batsman.balls,
          fours: batsman.fours,
          sixes: batsman.sixes,
          overs: 0,
          runsConceded: 0,
          wickets: 0,
          wides: 0,
          noBalls: 0,
          catches: 0,
        });
      });

      // Add 1st innings bowlers (Team 2)
      innings1BowlerStats.forEach((bowler) => {
        const key = `${bowler.name}_${team2Name}_1`;
        const existing = playerStatsMap.get(key) || {
          name: bowler.name,
          team: team2Name,
          innings: 1,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          overs: 0,
          runsConceded: 0,
          wickets: 0,
          wides: 0,
          noBalls: 0,
          catches: 0,
        };
        existing.overs = bowler.overs;
        existing.runsConceded = bowler.runsConceded;
        existing.wickets = bowler.wickets;
        existing.wides = bowler.wides || 0;
        existing.noBalls = bowler.noBalls || 0;
        playerStatsMap.set(key, existing);
      });

      // Add 1st innings fielders (Team 2)
      innings1FielderStats.forEach((fielder) => {
        const key = `${fielder.name}_${team2Name}_1`;
        const existing = playerStatsMap.get(key) || {
          name: fielder.name,
          team: team2Name,
          innings: 1,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          overs: 0,
          runsConceded: 0,
          wickets: 0,
          wides: 0,
          noBalls: 0,
          catches: 0,
        };
        existing.catches = fielder.catches;
        playerStatsMap.set(key, existing);
      });

      // Add 2nd innings batsmen (Team 2)
      innings2BatsmenStats.forEach((batsman) => {
        const key = `${batsman.name}_${team2Name}_2`;
        playerStatsMap.set(key, {
          name: batsman.name,
          team: team2Name,
          innings: 2,
          runs: batsman.runs,
          balls: batsman.balls,
          fours: batsman.fours,
          sixes: batsman.sixes,
          overs: 0,
          runsConceded: 0,
          wickets: 0,
          wides: 0,
          noBalls: 0,
          catches: 0,
        });
      });

      // Add 2nd innings bowlers (Team 1)
      innings2BowlerStats.forEach((bowler) => {
        const key = `${bowler.name}_${team1Name}_2`;
        const existing = playerStatsMap.get(key) || {
          name: bowler.name,
          team: team1Name,
          innings: 2,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          overs: 0,
          runsConceded: 0,
          wickets: 0,
          wides: 0,
          noBalls: 0,
          catches: 0,
        };
        existing.overs = bowler.overs;
        existing.runsConceded = bowler.runsConceded;
        existing.wickets = bowler.wickets;
        existing.wides = bowler.wides || 0;
        existing.noBalls = bowler.noBalls || 0;
        playerStatsMap.set(key, existing);
      });

      // Add 2nd innings fielders (Team 1)
      innings2FielderStats.forEach((fielder) => {
        const key = `${fielder.name}_${team1Name}_2`;
        const existing = playerStatsMap.get(key) || {
          name: fielder.name,
          team: team1Name,
          innings: 2,
          runs: 0,
          balls: 0,
          fours: 0,
          sixes: 0,
          overs: 0,
          runsConceded: 0,
          wickets: 0,
          wides: 0,
          noBalls: 0,
          catches: 0,
        };
        existing.catches = fielder.catches;
        playerStatsMap.set(key, existing);
      });

      // Write all players to CSV in the new format
      playerStatsMap.forEach((player) => {
        csv += `${player.name},${player.runs},${player.balls},${player.sixes},${
          player.fours
        },${player.overs.toFixed(1)},${player.runsConceded},${player.wickets},${
          player.wides
        },${player.noBalls},${player.catches}\n`;
      });

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `${team1Name}_vs_${team2Name}_formatted_for_Stats_Indoor_INPUT.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Error generating CSV. Please check the console for details.');
    }
  };

  return (
    <div className='space-y-6'>
      {/* Match Result */}
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6 text-center`}
      >
        <h2 className={`text-3xl font-bold ${getTextColor()} mb-2`}>
          🏆 {winningTeam} Won! 🏆
        </h2>
        <p className={`text-xl ${getTextColorLight()}`}>{winMargin}</p>
      </div>

      {/* Match Scorecard */}
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6`}
      >
        <h3 className={`text-2xl font-bold ${getTextColor()} mb-4`}>
          Scorecard
        </h3>
        <div className='space-y-3'>
          <div className={`${getTextColor()}`}>
            <span className='font-semibold'>{team1Name}:</span> {team1Score}/
            {team1Wickets} ({team1Overs} overs)
          </div>
          <div className={`${getTextColor()}`}>
            <span className='font-semibold'>{team2Name}:</span> {team2Score}/
            {team2Wickets} ({team2Overs} overs)
          </div>
        </div>
      </div>

      {/* Man of the Match */}
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border border-yellow-300/70 p-6 text-center bg-gradient-to-r from-yellow-500/10 to-orange-500/10`}
      >
        <div className='text-4xl mb-2'>⭐</div>
        <h3 className={`text-2xl font-bold ${getTextColor()} mb-2`}>
          Man of the Match
        </h3>
        <p className={`text-xl font-semibold ${getTextColor()}`}>
          {manOfTheMatch.name}
        </p>
        <p className={`${getTextColorLight()} mt-1`}>{manOfTheMatch.reason}</p>
      </div>

      {/* First Innings Stats */}
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6`}
      >
        <h3 className={`text-xl font-bold ${getTextColor()} mb-4`}>
          1st Innings - {team1Name} Batting
        </h3>

        {/* Batting Stats */}
        <h4 className={`text-lg font-semibold ${getTextColor()} mb-2`}>
          Batting
        </h4>
        <div className='overflow-x-auto mb-4'>
          <table className='w-full text-sm'>
            <thead>
              <tr
                className={`${getTextColorLight()} border-b ${getBorderColor()}`}
              >
                <th className='text-left py-2'>Batsman</th>
                <th className='text-center py-2'>R</th>
                <th className='text-center py-2'>B</th>
                <th className='text-center py-2'>4s</th>
                <th className='text-center py-2'>6s</th>
                <th className='text-center py-2'>SR</th>
              </tr>
            </thead>
            <tbody className={getTextColor()}>
              {innings1BatsmenStats.map((batsman, idx) => (
                <tr key={idx} className='border-b border-white/10'>
                  <td className='py-2'>{batsman.name}</td>
                  <td className='text-center'>{batsman.runs}</td>
                  <td className='text-center'>{batsman.balls}</td>
                  <td className='text-center'>{batsman.fours}</td>
                  <td className='text-center'>{batsman.sixes}</td>
                  <td className='text-center'>
                    {batsman.balls > 0
                      ? ((batsman.runs / batsman.balls) * 100).toFixed(1)
                      : '0.0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bowling Stats */}
        <h4 className={`text-lg font-semibold ${getTextColor()} mb-2 mt-4`}>
          Bowling
        </h4>
        <div className='overflow-x-auto mb-4'>
          <table className='w-full text-sm'>
            <thead>
              <tr
                className={`${getTextColorLight()} border-b ${getBorderColor()}`}
              >
                <th className='text-left py-2'>Bowler</th>
                <th className='text-center py-2'>O</th>
                <th className='text-center py-2'>R</th>
                <th className='text-center py-2'>W</th>
                <th className='text-center py-2'>WD</th>
                <th className='text-center py-2'>NB</th>
                <th className='text-center py-2'>Econ</th>
              </tr>
            </thead>
            <tbody className={getTextColor()}>
              {innings1BowlerStats.map((bowler, idx) => (
                <tr key={idx} className='border-b border-white/10'>
                  <td className='py-2'>{bowler.name}</td>
                  <td className='text-center'>{bowler.overs.toFixed(1)}</td>
                  <td className='text-center'>{bowler.runsConceded}</td>
                  <td className='text-center'>{bowler.wickets}</td>
                  <td className='text-center'>{bowler.wides || 0}</td>
                  <td className='text-center'>{bowler.noBalls || 0}</td>
                  <td className='text-center'>
                    {bowler.overs > 0
                      ? (bowler.runsConceded / bowler.overs).toFixed(2)
                      : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fielding Stats */}
        {innings1FielderStats.length > 0 && (
          <>
            <h4 className={`text-lg font-semibold ${getTextColor()} mb-2 mt-4`}>
              Fielding
            </h4>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr
                    className={`${getTextColorLight()} border-b ${getBorderColor()}`}
                  >
                    <th className='text-left py-2'>Fielder</th>
                    <th className='text-center py-2'>Catches</th>
                  </tr>
                </thead>
                <tbody className={getTextColor()}>
                  {innings1FielderStats.map((fielder, idx) => (
                    <tr key={idx} className='border-b border-white/10'>
                      <td className='py-2'>{fielder.name}</td>
                      <td className='text-center'>{fielder.catches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Second Innings Stats */}
      <div
        className={`${getGlassColor()} backdrop-blur-md rounded-xl border ${getBorderColor()} p-6`}
      >
        <h3 className={`text-xl font-bold ${getTextColor()} mb-4`}>
          2nd Innings - {team2Name} Batting
        </h3>

        {/* Batting Stats */}
        <h4 className={`text-lg font-semibold ${getTextColor()} mb-2`}>
          Batting
        </h4>
        <div className='overflow-x-auto mb-4'>
          <table className='w-full text-sm'>
            <thead>
              <tr
                className={`${getTextColorLight()} border-b ${getBorderColor()}`}
              >
                <th className='text-left py-2'>Batsman</th>
                <th className='text-center py-2'>R</th>
                <th className='text-center py-2'>B</th>
                <th className='text-center py-2'>4s</th>
                <th className='text-center py-2'>6s</th>
                <th className='text-center py-2'>SR</th>
              </tr>
            </thead>
            <tbody className={getTextColor()}>
              {innings2BatsmenStats.map((batsman, idx) => (
                <tr key={idx} className='border-b border-white/10'>
                  <td className='py-2'>{batsman.name}</td>
                  <td className='text-center'>{batsman.runs}</td>
                  <td className='text-center'>{batsman.balls}</td>
                  <td className='text-center'>{batsman.fours}</td>
                  <td className='text-center'>{batsman.sixes}</td>
                  <td className='text-center'>
                    {batsman.balls > 0
                      ? ((batsman.runs / batsman.balls) * 100).toFixed(1)
                      : '0.0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bowling Stats */}
        <h4 className={`text-lg font-semibold ${getTextColor()} mb-2 mt-4`}>
          Bowling
        </h4>
        <div className='overflow-x-auto mb-4'>
          <table className='w-full text-sm'>
            <thead>
              <tr
                className={`${getTextColorLight()} border-b ${getBorderColor()}`}
              >
                <th className='text-left py-2'>Bowler</th>
                <th className='text-center py-2'>O</th>
                <th className='text-center py-2'>R</th>
                <th className='text-center py-2'>W</th>
                <th className='text-center py-2'>WD</th>
                <th className='text-center py-2'>NB</th>
                <th className='text-center py-2'>Econ</th>
              </tr>
            </thead>
            <tbody className={getTextColor()}>
              {innings2BowlerStats.map((bowler, idx) => (
                <tr key={idx} className='border-b border-white/10'>
                  <td className='py-2'>{bowler.name}</td>
                  <td className='text-center'>{bowler.overs.toFixed(1)}</td>
                  <td className='text-center'>{bowler.runsConceded}</td>
                  <td className='text-center'>{bowler.wickets}</td>
                  <td className='text-center'>{bowler.wides || 0}</td>
                  <td className='text-center'>{bowler.noBalls || 0}</td>
                  <td className='text-center'>
                    {bowler.overs > 0
                      ? (bowler.runsConceded / bowler.overs).toFixed(2)
                      : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fielding Stats */}
        {innings2FielderStats.length > 0 && (
          <>
            <h4 className={`text-lg font-semibold ${getTextColor()} mb-2 mt-4`}>
              Fielding
            </h4>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr
                    className={`${getTextColorLight()} border-b ${getBorderColor()}`}
                  >
                    <th className='text-left py-2'>Fielder</th>
                    <th className='text-center py-2'>Catches</th>
                  </tr>
                </thead>
                <tbody className={getTextColor()}>
                  {innings2FielderStats.map((fielder, idx) => (
                    <tr key={idx} className='border-b border-white/10'>
                      <td className='py-2'>{fielder.name}</td>
                      <td className='text-center'>{fielder.catches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <button
          className='w-full bg-blue-500/50 hover:bg-blue-500/70 border-2 border-blue-300/50 rounded-lg px-6 py-4 font-bold text-white text-lg transition-all'
          onClick={generatePDF}
        >
          📄 Download PDF
        </button>
        <button
          className='w-full bg-purple-500/50 hover:bg-purple-500/70 border-2 border-purple-300/50 rounded-lg px-6 py-4 font-bold text-white text-lg transition-all'
          onClick={generateCSV}
        >
          📊 Download CSV
        </button>
        <button
          className='w-full bg-green-500/50 hover:bg-green-500/70 border-2 border-green-300/50 rounded-lg px-6 py-4 font-bold text-white text-lg transition-all'
          onClick={onNewMatch}
        >
          🏏 New Match
        </button>
      </div>
    </div>
  );
};
