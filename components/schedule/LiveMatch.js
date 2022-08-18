import Link from "next/link";
import React from "react";
import SeasonMatchInfo from "./SeasonMatchInfo";
import Team from "./Team";

export default function LiveMatch({
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

  return (
    <div className="">
      <Link href={`/match-results/${MatchId}`}>
        <a
          href="#"
          className="text-white bg-gradient-to-t from-[#0f1519] to-black h-20 pt-4 pr-4 pb-0 pl-3 block border-l-4 border-l-[#de2f2f] overflow-hidden bg-no-repeat bg-cover relative border-y border-y-[#252c32] w-auto"
        >
          <div className="top absolute w-[calc(((100%-195px)/12)*12+165px)] table text-[#8fa3b0] tracking-widest font-medium">
            <div className="game table-cell w-1/3 align-top">
              <span className="bullet text-[#de2f2f] text-4xl leading-5 align-top">
                •
              </span>
              <span className="live-label pr-2 pl-1 text-sm text-white uppercase">
                TODAY
              </span>
              <span className="game-number hidden lg:block">GAME 1</span>
            </div>
            <div className="league table-cell w-1/3 text-right uppercase text-xs pt-1 align-top">
              <SeasonMatchInfo seasonNumber={seasonNumber} format={bestOf} />
            </div>
          </div>
          <div className="teams ml-[calc(((100%-165px)/12)*4+60px)] w-[calc(((100%-165px)/12)*4+60px)] flex flex-col justify-center grow text-center relative">
            <Team
              teamName={teamOne.teamName}
              tricode={teamOne.tricode}
              wins={teamOneSeasonalGroupStageWins}
              losses={teamOneSeasonalGroupStageLosses}
            />
            <div className="versus hidden lg:flex lg:align-center lg:justify-center lg:w-[calc(((100%-312px)/12)*2+24px)]">
              VS
            </div>
            <Team
              teamName={teamTwo.teamName}
              tricode={teamTwo.tricode}
              wins={teamTwoSeasonalGroupStageWins}
              losses={teamTwoSeasonalGroupStageLosses}
            />
          </div>
        </a>
      </Link>
    </div>
  );
}
