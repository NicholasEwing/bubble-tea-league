import Image from "next/image";
import React from "react";
import PlayerStats from "./PlayerStats";

export default function TeamPlayerStats({ matchRoundPlayerStats }) {
  // split players into blue / red teams
  const bluePlayers = matchRoundPlayerStats.filter(
    (player) => player.teamSide === "blue"
  );
  const redPlayers = matchRoundPlayerStats.filter(
    (player) => player.teamSide === "red"
  );

  console.log("BLUE PLAYERS", bluePlayers);
  console.log("RED pLYAERS", redPlayers);

  // sort by role
  // top
  // jg
  // mid
  // bottom
  // supp

  return (
    <section className="player-stats relative flex bg-[#0a0e13] text-white cursor-pointer">
      <div className="blue-team flex-1 border-r border-r-[#252c32]">
        {bluePlayers.map((p) => (
          <PlayerStats key={p.summonerName} {...p} />
        ))}
      </div>
      <div className="red-team flex-1 items-end">
        {redPlayers.map((p) => (
          <PlayerStats key={p.summonerName} {...p} />
        ))}
      </div>
    </section>
  );
}
