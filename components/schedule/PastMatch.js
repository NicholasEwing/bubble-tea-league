import Link from "next/link";
import React from "react";
import Score from "./Score";
import SeasonMatchInfo from "./SeasonMatchInfo";
import Team from "./Team";
import Time from "./Time";

export default function PastMatch({
  MatchId,
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
    <div className="text-white bg-[#0f1519] border-y border-y-[#252c32]">
      <Link href={`/match-results/${MatchId}`}>
        <a className="single past event mx-4 w-auto h-20 flex flex-row items-center relative">
          <Time hour={hour} minute={minute} ampm={ampm} />
          <div className="teams w-[calc(((100%-165px)/12)*4+60px)] flex flex-col justify-center grow text-center relative">
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
          <div className="w-[calc(((100%-195px)/12)*4+45px)]">
            <SeasonMatchInfo seasonNumber={seasonNumber} format={bestOf} />
          </div>
        </a>
      </Link>
    </div>
  );
}
