import React from "react";

export default function TeamResults({ teamStats }) {
  return (
    <div>
      <p className="font-bold text-lg">Team {teamStats.TeamId}</p>
      <p>Kills: {teamStats.kills}</p>
      <p>Gold Earned: {teamStats.goldEarned}</p>
      <p>Towers: {teamStats.towersDestroyed}</p>
      <p>Dragons: {teamStats.dragonsKilled}</p>
      <p>Heralds: {teamStats.heraldsKilled}</p>
    </div>
  );
}
