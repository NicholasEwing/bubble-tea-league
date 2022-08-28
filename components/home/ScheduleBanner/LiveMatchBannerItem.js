import Image from "next/image";
import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";

export default function LiveMatchBannerItem() {
  return (
    <>
      <div className="EventWidgetMatch day-section-start relative h-full text-white">
        <a
          href="/live/lcs"
          className="match live flex w-60 flex-col items-center justify-center bg-black p-4 before:absolute before:left-0 before:top-0 before:block before:h-full before:w-[4px] before:bg-[#de2f2f]"
        >
          <div className="header -mb-[6px] flex items-center">
            <span className="bullet -mt-1 align-middle text-3xl text-[#de2f2f]">
              •
            </span>
            <span className="label ml-1 text-sm font-medium tracking-widest">
              TODAY
            </span>
          </div>
          <div className="teams my-3 flex flex-row items-center justify-center font-medium tracking-tight">
            <div className="team flex flex-row-reverse items-center justify-center">
              <TeamLogo />
              <span className="code1 mr-1">CLG</span>
            </div>
            <div className="vs mx-2 text-center text-xs text-[#8fa3b0]">VS</div>
            <div className="team flex flex-row items-center justify-center">
              <TeamLogo />
              <span className="code ml-1">GG</span>
            </div>
          </div>
          <p className="season text-xs tracking-widest">SEASON 1</p>
        </a>
      </div>
    </>
  );
}
