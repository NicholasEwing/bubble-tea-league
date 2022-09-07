import React, { useState } from "react";
import { dateInPast, isToday } from "../../../lib/utils";
import FutureMatchBannerItem from "./FutureMatchBannerItem";
import LeftArrow from "./LeftArrow";
import LiveMatchBannerItem from "./LiveMatchBannerItem";
import RightArrow from "./RightArrow";

export default function ScheduleBanner({ schedule, teams }) {
  const today = new Date();
  const [slideControls, setSlideControls] = useState(0);

  const handleSlideLeft = () => {
    setSlideControls(--slideControls);
  };

  const handleSlideRight = () => {
    if (slideControls >= schedule.length - 1) return;
    setSlideControls(++slideControls);
  };

  return (
    <div
      className={`max-height-36 relative z-10 flex h-36 overflow-hidden border-y border-y-[#252c32] bg-[#0a0e13]`}
    >
      <LeftArrow hide={!slideControls} handleSlideLeft={handleSlideLeft} />
      <div
        style={{ left: -(slideControls * 144) }}
        className={`absolute flex h-full flex-row overflow-hidden whitespace-nowrap transition-all duration-100`}
      >
        {schedule.length &&
          schedule.map((dateObj) => {
            const date = new Date(Object.keys(dateObj)[0]);

            if (isToday(date)) {
              return (
                <React.Fragment key={date}>
                  {Object.values(dateObj)
                    .flat()
                    .map((match) => (
                      <LiveMatchBannerItem
                        key={match.id}
                        teamOne={teams.find((t) => t.id === match.teamOneId)}
                        teamTwo={teams.find((t) => t.id === match.teamTwoId)}
                        bestOf={match.isPlayoffsMatch ? "Bo3" : "Bo1"}
                        scheduledTime={match.scheduledTime}
                        date={date}
                        season={match.season}
                      />
                    ))}
                </React.Fragment>
              );
            } else if (!dateInPast(date, today)) {
              return (
                <React.Fragment key={date}>
                  {Object.values(dateObj)
                    .flat()
                    .map((match) => (
                      <FutureMatchBannerItem
                        key={`Future-${match.id}`}
                        teamOne={teams.find((t) => t.id === match.teamOneId)}
                        teamTwo={teams.find((t) => t.id === match.teamTwoId)}
                        bestOf={match.isPlayoffsMatch ? "Bo3" : "Bo1"}
                        scheduledTime={match.scheduledTime}
                        date={date}
                      />
                    ))}
                </React.Fragment>
              );
            } else {
              return (
                <h1 key={date} className="text-xl text-white">
                  A <code>dateObj</code> was found with a null / undefined / non
                  Date Object key. Please yell at Nick to fix this.
                </h1>
              );
            }
          })}
      </div>
      <RightArrow
        handleSlideRight={handleSlideRight}
        hide={slideControls >= schedule.length - 1}
      />
    </div>
  );
}
