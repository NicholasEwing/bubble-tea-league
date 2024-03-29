import Link from "next/link";
import React from "react";
import Score from "./Score";
import SeasonMatchInfo from "./SeasonMatchInfo";
import Team from "./Team";
import Time from "./Time";

export default function FutureMatch({
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
    <div className="flex h-20 flex-col justify-center border-y border-y-[#252c32] bg-[#0f1519] text-white lg:h-28">
      <div className="relative mx-4 flex w-auto items-center lg:mx-8">
        <Time hour={hour} minute={minute} ampm={ampm} approx />
        <div className="teams relative flex w-[calc(((100%-165px)/12)*4+60px)] grow flex-col justify-center text-center lg:w-auto lg:flex-row">
          <Team
            teamName={teamOne?.teamName}
            tricode={teamOne?.tricode}
            wins={teamOneSeasonalGroupStageWins}
            losses={teamOneSeasonalGroupStageLosses}
          />
          <div className="versus hidden w-20 items-center justify-center text-sm tracking-widest text-[#8fa3b0] lg:flex">
            VS
          </div>
          <Team
            teamName={teamTwo?.teamName}
            tricode={teamTwo?.tricode}
            wins={teamTwoSeasonalGroupStageWins}
            losses={teamTwoSeasonalGroupStageLosses}
          />
        </div>
        <div className="w-[calc(((100%-195px)/12)*4+45px)] lg:w-auto">
          <SeasonMatchInfo seasonNumber={seasonNumber} format={bestOf} />
        </div>
      </div>
    </div>
  );
}
