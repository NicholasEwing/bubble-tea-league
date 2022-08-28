import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";

export default function FutureMatchBannerItem() {
  return (
    <div className="EventWidgetMatch day-section-start relative h-full border-r border-r-[#252c32] bg-[#0a0e13] text-white">
      <div className="match future h-full w-36 pt-7 pl-8">
        <div className="date absolute top-auto left-auto -translate-y-1/2 text-xs tracking-widest text-[#8fa3b0]">
          TOMORROW
        </div>
        <div className="teams pt-3 font-medium tracking-tight">
          <div className="team flex pt-1">
            <TeamLogo small />
            <span className="code">100</span>
          </div>
          <div className="team flex pt-1">
            <TeamLogo small />
            <span className="code">TL</span>
          </div>
        </div>
        <div className="time mt-1 ml-2 text-xs tracking-widest">
          <span className="hour">6</span> <span className="ampm">PM</span>
        </div>
      </div>
    </div>
  );
}
