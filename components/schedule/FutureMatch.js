import Link from "next/link";
import React from "react";
import Score from "./Score";
import SeasonMatchInfo from "./SeasonMatchInfo";
import Team from "./Team";
import Time from "./Time";

export default function FutureMatch({
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
  const teamOneSeasonalGroupStageWins = teamOne?.groupStageWins.length;
  const teamOneSeasonalGroupStageLosses = teamOne?.groupStageWins.length;

  const teamTwoSeasonalGroupStageWins = teamTwo?.groupStageWins.length;
  const teamTwoSeasonalGroupStageLosses = teamTwo?.groupStageLosses.length;

  const time = new Date(scheduledTime);
  const hourMinuteAMPM = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const [hour, minute, ampm] = hourMinuteAMPM.match(/\d+|\w+/g);

  let teamOneScore, teamTwoScore;

  return (
    <div className="text-white bg-[#0f1519] border-y border-y-[#252c32]">
      <Link href={`/match-results/${MatchId}`}>
        <a className="single past event mx-4 w-auto h-20 flex flex-row items-center relative">
          <Time hour={hour} minute={minute} ampm={ampm} approx />
          <div className="teams w-[calc(((100%-165px)/12)*4+60px)] flex flex-col justify-center grow text-center relative">
            <Team
              teamName={teamOne?.teamName}
              tricode={teamOne?.tricode}
              wins={teamOneSeasonalGroupStageWins}
              losses={teamOneSeasonalGroupStageLosses}
            />
            <Team
              teamName={teamTwo?.teamName}
              tricode={teamTwo?.tricode}
              wins={teamTwoSeasonalGroupStageWins}
              losses={teamTwoSeasonalGroupStageLosses}
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
