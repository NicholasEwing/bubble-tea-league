import React from "react";
import TeamLogo from "../match-results/TeamHeader/TeamLogo";

export default function PastMatch() {
  return (
    <div className="EventMatch text-white bg-[#0f1519] border-y border-y-[#252c32]">
      <a
        className="single past event mx-4 w-auto h-20 flex flex-row items-center relative"
        href="/vod/108206581965039699/1"
      >
        <div className="EventTime w-[calc(((100%-165px)/12)*4+60px)] flex-none inline-block">
          <div className="time text-3xl relative font-medium">
            <span className="hour">7</span>
            <span className="minute relative text-xs -top-[.85rem] pl-1 tracking-widest">
              30
            </span>
            <span className="ampm relative text-xs -top-[.85rem] pl-1 tracking-widest">
              PM
            </span>
          </div>
        </div>
        <div className="teams winner-team2 w-[calc(((100%-165px)/12)*4+60px)] flex flex-col justify-center grow text-center relative">
          <div className="team team1 flex flex-row text-right justify-start items-center font-medium">
            <div className="flex w-4 h-4">
              <TeamLogo />
            </div>
            <div className="team-info pl-1 pr-0">
              <h2 className="text-[#8fa3b0]">
                <span className="name hidden">Dignitas</span>
                <span className="tricode block lg:hidden">DIG</span>
              </h2>
              <div className="winloss hidden lg:block text-[#8fa3b0] tracking-widest font-medium">
                2W-9L
              </div>
            </div>
          </div>
          <div className="score w-[calc(((100%-312px)/12*2+24px)] ml-24 text-white absolute flex flex-col items-center justify-center tracking-widest font-medium">
            <span className="scoreTeam1 text-[#8fa3b0] mb-1">0</span>
            <span className="hyphen hidden lg:inline">-</span>
            <span className="scoreTeam2 text-[#c79e57]">1</span>
          </div>
          <div className="team team2 flex flex-row text-right justify-start items-center font-medium">
            <div className="flex w-4 h-4">
              <TeamLogo />
            </div>
            <div className="team-info pl-1 pr-0">
              <h2 className="text-white">
                <span className="name hidden">FlyQuest</span>
                <span className="tricode block lg:hidden">FLY</span>
              </h2>
              <div className="winloss hidden lg:block text-[#8fa3b0] tracking-widest font-medium">
                7W-4L
              </div>
            </div>
          </div>
        </div>
        <div
          role="button"
          className="league w-[calc(((100%-195px)/12)*4+45px)] h-12 basis-28 grow-0 shrink-0 tracking-widest font-medium text-right text-[#8fa3b0]"
        >
          <div className="name uppercase text-xs">Season 1</div>
          <div className="strategy uppercase text-xs">Bo1</div>
        </div>
      </a>
    </div>
  );
}
