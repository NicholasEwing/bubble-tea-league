import React from "react";
import { dateInPast, isToday } from "../../../lib/utils";
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
    <div>
      <p className="text-white">banner here</p>
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
                    <p className="text-white" key={match.id}>
                      future match
                    </p>
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
