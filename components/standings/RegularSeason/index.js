import React from "react";
import StandingItem from "./StandingItem";

export default function RegularSeason({ activeSeason, seasonTeams }) {
  return (
    <div className="max-w-full">
      <div className="title m-4 font-medium text-xl">Standings</div>
      {seasonTeams &&
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
        ))}
    </div>
  );
}
