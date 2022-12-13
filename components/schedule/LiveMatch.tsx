import Link from "next/link";
import { BestOf, TeamWithInfo } from "../../types";
import SeasonMatchInfo from "./SeasonMatchInfo";
import TeamInfo from "./TeamInfo";

interface LiveMatchProps {
  teamOne: TeamWithInfo;
  teamTwo: TeamWithInfo;
  seasonNumber: string;
  bestOf: BestOf;
}

export default function LiveMatch({
  teamOne,
  teamTwo,
  seasonNumber,
  bestOf,
}: LiveMatchProps) {
  // Find ALL wins / losses for the season
  const teamOneSeasonalGroupStageWins = teamOne.groupStageWins.length;
  const teamOneSeasonalGroupStageLosses = teamOne.groupStageWins.length;

  const teamTwoSeasonalGroupStageWins = teamTwo.groupStageWins.length;
  const teamTwoSeasonalGroupStageLosses = teamTwo.groupStageLosses.length;

  return (
    <div className="flex h-20 flex-col justify-center border-y border-l-4 border-y-[#252c32] border-l-[#de2f2f] bg-gradient-to-t from-[#0f1519] to-black bg-cover bg-no-repeat lg:h-28">
      <Link href="https://www.twitch.tv/thebubbletealeague">
        <a
          href="#"
          className="relative mx-4 flex w-auto items-center text-white lg:mx-8"
        >
          <div className="inline-block w-[calc(((100%-165px)/12)*4+60px)] flex-none font-medium tracking-widest lg:w-40">
            <span className="bullet align-top text-4xl leading-5 text-[#de2f2f]">
              •
            </span>
            <span className="live-label pr-2 pl-1 text-sm uppercase text-white">
              TODAY
            </span>
            <span className="game-number hidden lg:block">GAME 1</span>
          </div>
          <div className="teams relative flex w-[calc(((100%-165px)/12)*4+60px)] grow flex-col justify-center text-center lg:w-auto lg:flex-row">
            <TeamInfo
              teamName={teamOne.teamName}
              tricode={teamOne.tricode}
              wins={teamOneSeasonalGroupStageWins}
              losses={teamOneSeasonalGroupStageLosses}
            />
            <div className="versus w-[calc(((100%-312px)/12*2+24px)] ml-24 hidden flex-col items-center justify-center text-sm tracking-widest text-[#8fa3b0] lg:static lg:ml-0 lg:flex lg:w-20 lg:flex-row">
              VS
            </div>
            <TeamInfo
              teamName={teamTwo.teamName}
              tricode={teamTwo.tricode}
              wins={teamTwoSeasonalGroupStageWins}
              losses={teamTwoSeasonalGroupStageLosses}
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
