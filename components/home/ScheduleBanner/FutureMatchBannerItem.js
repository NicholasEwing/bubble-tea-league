import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";
import Time from "../../schedule/Time";

export default function FutureMatchBannerItem({
  teamOne,
  teamTwo,
  bestOf,
  scheduledTime,
  date,
}) {
  const weekDay = date.toLocaleString("en-us", { weekday: "long" });
  const month = date.toLocaleString("en-us", { month: "short" });
  const day = date.toLocaleString("en-us", { day: "numeric" });

  const time = new Date(scheduledTime);
  const hourMinuteAMPM = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const [hour, minute, ampm] = hourMinuteAMPM.match(/\d+|\w+/g);

  return (
    <div className="EventWidgetMatch day-section-start relative h-full border-r border-r-[#252c32] bg-[#0a0e13] text-white">
      <div className="match future h-full w-36 pt-7 pl-8">
        <div className="date absolute top-auto left-auto -translate-y-1/2 text-xs uppercase tracking-widest text-[#8fa3b0]">
          {month} {day}
        </div>
        <div className="teams pt-3 font-medium tracking-tight">
          <div className="team flex pt-1">
            <TeamLogo
              tbd={!teamOne}
              tricode={teamOne?.tricode}
              width="24"
              height="24"
            />
            <span className="code">{teamOne?.tricode || "TBD"}</span>
          </div>
          <div className="team flex pt-1">
            <TeamLogo
              tbd={!teamTwo}
              tricode={teamTwo?.tricode}
              width="24"
              height="24"
            />
            <span className="code">{teamTwo?.tricode || "TBD"}</span>
          </div>
        </div>
        <div className="time mt-1 ml-2 text-xs tracking-widest">
          <span className="hour">{hour}:</span>
          <span>{minute}</span> <span className="ampm">{ampm}</span>{" "}
          <span className="italics text-[6px] tracking-widest">EST</span>
        </div>
      </div>
    </div>
  );
}
