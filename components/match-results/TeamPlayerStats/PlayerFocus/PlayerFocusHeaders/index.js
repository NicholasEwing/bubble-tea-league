import Image from "next/image";
import React from "react";
import PlayerHeader from "./PlayerHeader";

export default function PlayerFocusHeaders({
  player,
  comparedPlayer,
  summonerName,
  championName,
  teamPosition,
  champLevel,
}) {
  return (
    <div className="StatsMatchupPlayers flex font-semibold text-[#8fa3b0] bg-[#0a0e13] flex-1 h-full">
      <PlayerHeader player={player} isPrimary />
      <PlayerHeader player={comparedPlayer} />
    </div>
  );
}
