import Link from "next/link";
import React from "react";
import Score from "./Score";
import SeasonMatchInfo from "./SeasonMatchInfo";
import Team from "./Team";
import Time from "./Time";

export default function PastMatch({
  matchId,
  matchRounds,
  teamOne,
  teamTwo,
  seasonNumber,
  bestOf,
  scheduledTime,
  matchWinnerTeamId,
  matchLoserTeamId,
}) {
  // Find ALL wins / losses for the season
  const teamOneSeasonalGroupStageWins = teamOne.groupStageWins.length;
  const teamOneSeasonalGroupStageLosses = teamOne.groupStageWins.length;

  const teamTwoSeasonalGroupStageWins = teamTwo.groupStageWins.length;
  const teamTwoSeasonalGroupStageLosses = teamTwo.groupStageLosses.length;

  const time = new Date(scheduledTime);
  const hourMinuteAMPM = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const [hour, minute, ampm] = hourMinuteAMPM.match(/\d+|\w+/g);

  let teamOneScore, teamTwoScore;

  if (bestOf === "Bo1") {
    teamOneScore = teamOne.id === matchWinnerTeamId ? 1 : 0;
    teamTwoScore = teamTwo.id === matchWinnerTeamId ? 1 : 0;
  } else {
    // set w / l from playoffs match round info

    // find match rounds with MatchId
    const matchRoundsForThisMatch = matchRounds.filter(
      (mr) => mr.MatchId === MatchId
    );

    teamOneScore = matchRoundsForThisMatch.filter(
      (mr) => mr.winningTeamId === teamOne.id
    );
    teamTwoScore = matchRoundsForThisMatch.filter(
      (mr) => mr.winningTeamId === teamTwo.id
    );
  }

  return (
    <div className="flex h-20 flex-col justify-center border-y border-y-[#252c32] bg-[#0f1519] text-white lg:h-28">
      <Link href={`/match-results/${matchId}`}>
        <a className="relative mx-4 flex w-auto items-center lg:mx-8">
          <Time hour={hour} minute={minute} ampm={ampm} />
          <div className="teams relative flex w-[calc(((100%-165px)/12)*4+60px)] grow flex-col justify-center text-center lg:w-auto lg:flex-row">
            <Team
              teamName={teamOne.teamName}
              tricode={teamOne.tricode}
              wins={teamOneSeasonalGroupStageWins}
              losses={teamOneSeasonalGroupStageLosses}
              isWinner={teamOne.id === matchWinnerTeamId}
              isLoser={teamOne.id !== matchWinnerTeamId}
            />
            <Score teamOneScore={teamOneScore} teamTwoScore={teamTwoScore} />
            <Team
              teamName={teamTwo.teamName}
              tricode={teamTwo.tricode}
              wins={teamTwoSeasonalGroupStageWins}
              losses={teamTwoSeasonalGroupStageLosses}
              isWinner={teamTwo.id === matchWinnerTeamId}
              isLoser={teamTwo.id !== matchWinnerTeamId}
            />
          </div>
          <div className="w-[calc(((100%-195px)/12)*4+45px)] lg:w-auto">
            <SeasonMatchInfo seasonNumber={seasonNumber} format={bestOf} />
          </div>
        </a>
      </Link>
    </div>
  );
}
