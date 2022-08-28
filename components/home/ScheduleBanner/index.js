import React from "react";
import { dateInPast, isToday } from "../../../lib/utils";
import FutureMatchBannerItem from "./FutureMatchBannerItem";
import LiveMatchBannerItem from "./LiveMatchBannerItem";

export default function ScheduleBanner({ schedule }) {
  // for each match inside a date object, display a match
  const today = new Date();

  // remove past items from schedule
  const futureSchedule = schedule.filter((s) => {
    const date = new Date(Object.keys(s)[0]);
    return !dateInPast(date, today);
  });

  return (
    <div className="max-height-36 relative z-10 flex h-36 overflow-hidden border-y border-y-[#252c32] bg-[#0a0e13]">
      {futureSchedule.length &&
        futureSchedule.map((dateObj) => {
          const date = new Date(Object.keys(dateObj)[0]);

          if (isToday(date)) {
            return (
              <React.Fragment key={date}>
                {Object.values(dateObj)
                  .flat()
                  .map((match) => (
                    <LiveMatchBannerItem key={match.id} />
                    // <LiveMatch
                    //   key={`Live-${match.id}`}
                    //   MatchId={match.id}
                    //   teamOne={teams.find((t) => t.id === match.teamOne)}
                    //   teamTwo={teams.find((t) => t.id === match.teamTwo)}
                    //   bestOf={match.isPlayoffsMatch ? "Bo3" : "Bo1"}
                    //   seasonNumber={match.seasonNumber}
                    //   matchRounds={match.matchRounds}
                    //   matchWinnerTeamId={match.matchWinnerTeamId}
                    //   matchLoserTeamId={match.matchLoserTeamId}
                    //   scheduledTime={match.scheduledTime}
                    // />
                  ))}
              </React.Fragment>
            );
          } else if (!dateInPast(date, today)) {
            return (
              <React.Fragment key={date}>
                {Object.values(dateObj)
                  .flat()
                  .map((match) => (
                    <FutureMatchBannerItem key={match.id} />
                    // <FutureMatch
                    //   key={`Future-${match.id}`}
                    //   MatchId={match.id}
                    //   teamOne={teams.find((t) => t.id === match.teamOne)}
                    //   teamTwo={teams.find((t) => t.id === match.teamTwo)}
                    //   bestOf={match.isPlayoffsMatch ? "Bo3" : "Bo1"}
                    //   seasonNumber={match.seasonNumber}
                    //   matchRounds={match.matchRounds}
                    //   scheduledTime={match.scheduledTime}
                    // />
                  ))}
              </React.Fragment>
            );
          } else {
            return (
              <h1 className="text-xl text-white">
                A <code>dateObj</code> was found with a null / undefined / non
                Date Object key. Please yell at Nick to fix this.
              </h1>
            );
          }
        })}
    </div>
  );
}
