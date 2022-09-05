import React from "react";
import StandingItem from "./StandingItem";

export default function RegularSeason({
  activeSeason,
  seasonTeams,
  seasonStandings,
}) {
  return (
    <div className="max-w-full lg:h-full lg:w-full">
      <div className="title m-4 text-xl font-medium lg:m-9 lg:mb-4">
        Standings
      </div>
      {seasonStandings.length && seasonTeams.length ? (
        seasonStandings.map((standing) => {
          const { TeamId, placement } = standing;
          // find team obj from seasonTeams
          const team = seasonTeams.find((t) => t.id === TeamId);
          const { id, tricode, teamName, groupStageWins, groupStageLosses } =
            team;
          return (
            <StandingItem
              key={`season-${activeSeason}-team-${teamName}`}
              tricode={tricode}
              teamName={teamName}
              id={id}
              // if no W/Ls yet, show a dash
              ordinal={
                groupStageWins?.length || groupStageLosses?.length
                  ? `${placement}`
                  : "-"
              }
              wins={groupStageWins?.length}
              losses={groupStageLosses?.length}
            />
          );
        })
      ) : (
        <h1 className="m-8 flex justify-center text-2xl font-light text-white">
          No teams registered for this season yet...
        </h1>
      )}
    </div>
  );
}
