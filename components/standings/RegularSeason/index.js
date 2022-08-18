import React from "react";
import StandingItem from "./StandingItem";

export default function RegularSeason({ activeSeason, seasonTeams }) {
  return (
    <div className="max-w-full lg:h-full lg:w-full">
      <div className="title m-4 text-xl font-medium lg:m-9 lg:mb-4">
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
        <h1 className="m-8 flex justify-center text-5xl font-thin text-white">
          No teams registered for this season yet.
        </h1>
      )}
    </div>
  );
}
