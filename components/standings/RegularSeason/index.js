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
            // if no W/Ls yet, show a dash
            ordinal={
              team.wins?.length || team.losses?.length ? `${i + 1}` : "-"
            }
            wins={team.wins?.length}
            losses={team.losses?.length}
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
