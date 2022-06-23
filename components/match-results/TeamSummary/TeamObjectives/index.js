import React from "react";
import ObjectiveIcon from "./ObjectiveIcon";

export default function TeamObjectives({
  teamSide,
  inhibitorsDestroyed,
  towersDestroyed,
  baronsKilled,
  kills,
}) {
  let fillColor = "fill-[#FFFFFF]";
  if (teamSide === "blue") {
    fillColor = "fill-[#4c7184]";
  } else if (teamSide === "red") {
    fillColor = "fill-[#844c4c]";
  }

  const objectives = {
    inhibitorsDestroyed,
    towersDestroyed,
    baronsKilled,
    kills,
  };

  return (
    <div
      className={`flex-1 flex justify-between pt-4 pb-0 pr-4 pl-4 mt-4 ${
        teamSide === "blue"
          ? "border-r border-r-[#252c32]"
          : "border-l border-l-[#252c32]"
      }`}
    >
      {Object.entries(objectives).map(([key, value]) => (
        <ObjectiveIcon
          key={`${key}-${teamSide}`}
          teamSide={teamSide}
          icon={key}
          count={value}
        />
      ))}
    </div>
  );
}
