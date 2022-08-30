import Image from "next/image";
import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";

export default function LiveMatchBannerItem({
  teamOne,
  teamTwo,
  bestOf,
  scheduledTime,
  date,
  season,
}) {
  const time = new Date(scheduledTime);
  const hourMinuteAMPM = time.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const [hour, minute, ampm] = hourMinuteAMPM.match(/\d+|\w+/g);

  return (
    <>
      <div className="EventWidgetMatch day-section-start relative h-full border-r border-r-[#252c32] text-white">
        <a
          href="https://www.twitch.tv/thebubbletealeague"
          className="match live flex w-60 flex-col items-center justify-center bg-black p-4 before:absolute before:left-0 before:top-0 before:block before:h-full before:w-[4px] before:bg-[#de2f2f]"
        >
          <div className="header -mb-[6px] flex items-center">
            <span className="bullet -mt-1 align-middle text-3xl text-[#de2f2f]">
              •
            </span>
            <span className="label ml-1 text-sm font-medium tracking-widest">
              TODAY - {hour}:{minute} {ampm}
            </span>
          </div>
          <div className="teams my-3 flex flex-row items-center justify-center font-medium tracking-tight">
            <div className="team flex flex-row-reverse items-center justify-center">
              <TeamLogo tbd={!teamOne} tricode={teamOne?.tricode} />
              <span className="code1 mr-1">{teamOne.tricode}</span>
            </div>
            <div className="vs mx-2 text-center text-xs text-[#8fa3b0]">VS</div>
            <div className="team flex flex-row items-center justify-center">
              <TeamLogo tbd={!teamTwo} tricode={teamTwo?.tricode} />
              <span className="code ml-1">{teamTwo.tricode}</span>
            </div>
          </div>
          <p className="season text-xs tracking-widest">SEASON {season}</p>
        </a>
      </div>
    </>
  );
}
