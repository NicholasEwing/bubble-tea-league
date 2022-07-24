import React from "react";
import StandingItem from "./StandingItem";

export default function RegularSeason({ activeSeason, seasonTeams }) {
  return (
    <div className="max-w-full lg:w-full lg:h-full">
      <div className="title m-4 lg:m-9 lg:mb-4 font-medium text-xl">
        Standings
      </div>
      {seasonTeams.length ? (
        seasonTeams.map((team, i) => (
          <StandingItem
            key={`season-${activeSeason}-team-${team.teamName}`}
            tricode={team.tricode}
            teamName={team.teamName}
            id={team.id}
            // if no W/Ls yet, show a dash
            ordinal={
              team.groupStageWins?.length || team.groupStageLosses?.length
                ? `${i + 1}`
                : "-"
            }
            wins={team.groupStageWins?.length}
            losses={team.groupStageLosses?.length}
          />
        ))
      ) : (
        <h1 className="flex justify-center text-white font-thin text-5xl m-8">
          No teams registered for this season yet.
        </h1>
      )}
    </div>
  );
}
