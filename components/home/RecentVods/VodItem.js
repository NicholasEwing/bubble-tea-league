import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";

export default function VodItem({
  MatchId,
  matchRounds,
  teamOne,
  teamTwo,
  season,
  bestOf,
  scheduledTime,
  matchWinnerTeamId,
  matchLoserTeamId,
  vodLink,
}) {
  return (
    <a href={vodLink} target="_blank" rel="noreferrer">
      <div className="match flex">
        <div className="HomeVodsMatch relative flex w-full cursor-pointer pb-4 font-medium">
          <div className="thumbnail relative h-20 w-32">
            <div className="background absolute left-0 top-0 z-0 h-full w-full overflow-hidden">
              <div className="image-wrapper absolute -top-[26%] -left-[4.5%] z-[1] h-[111%] w-1/2 rotate-[10deg] scale-[1.3] overflow-hidden">
                <div
                  className={`team-image absolute top-0 left-[9%] h-[200%] w-[200%] -rotate-[10deg] scale-[.77] bg-btl-blue bg-contain bg-no-repeat opacity-50 [background-position-x:-25px]`}
                  style={{
                    backgroundImage: `url(
                  "/teams/${teamOne?.tricode ? teamOne.tricode : "null"}.png"
                )`,
                  }}
                ></div>
              </div>
              <div className="image-wrapper absolute -top-[30%] -right-[10.5%] z-0 h-[130%] w-1/2 rotate-[10deg] scale-[1.3] overflow-hidden">
                <div
                  className={`team-image absolute right-0 top-[11%] -left-[87%] h-[200%] w-[200%] -rotate-[10deg] scale-[.77] bg-btl-pink bg-contain bg-no-repeat opacity-50 [background-position-x:42px]`}
                  style={{
                    backgroundImage: `url(
                  "/teams/${teamTwo?.tricode ? teamTwo.tricode : "null"}.png"
                )`,
                  }}
                ></div>
              </div>
            </div>
            <div className="teams absolute left-1/2 top-1/2 flex w-full -translate-y-1/2 -translate-x-1/2 flex-row items-center justify-center">
              <div className="team z-[1]">
                <TeamLogo width="30" height="30" tricode={teamOne?.tricode} />
              </div>
              <div className="vs px-2 text-sm uppercase opacity-40">VS</div>
              <div className="team z-[1]">
                <TeamLogo width="30" height="30" tricode={teamTwo?.tricode} />
              </div>
            </div>
          </div>
          <div className="description relative flex flex-col pl-4">
            <div className="league text-sm uppercase tracking-widest text-[#8fa3b0]">
              Season {season} - {bestOf}
            </div>
            <div className="match-title">
              {teamOne?.tricode} vs {teamTwo?.tricode}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
