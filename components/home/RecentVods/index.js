import Image from "next/image";
import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";
import VodItem from "./VodItem";

export default function RecentVods({ teams, pastSchedule }) {
  return (
    <div className="HomeVods w-full text-white">
      <div className="title pt-9 pl-4 font-medium uppercase tracking-widest text-[#8fa3b0]">
        RECENT MATCH VODS
      </div>
      <div className="vods-list grid gap-x-4 py-4 pl-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:flex-row">
        {pastSchedule.map((dateObj) => {
          return Object.values(dateObj)
            .flat()
            .map((match) => (
              <VodItem
                key={`VOD-${match.id}`}
                MatchId={match.id}
                teamOne={teams.find((t) => t.id === match.teamOne)}
                teamTwo={teams.find((t) => t.id === match.teamTwo)}
                bestOf={match.isPlayoffsMatch ? "Bo3" : "Bo1"}
                season={match.season}
                matchRounds={match.matchRounds}
                scheduledTime={match.scheduledTime}
                vodLink={match.vodLink}
              />
            ));
        })}
      </div>
    </div>
  );
}
