import React from "react";
import BaronIcon from "./BaronIcon";
import InhibitorIcon from "./InhibitorIcon";
import KillIcon from "./KillIcon";
import TowerIcon from "./TowerIcon";

export default function ObjectiveIcon({ teamSide, icon, count }) {
  let fillColor = "fill-[#FFFFFF]";

  if (teamSide === "blue") {
    fillColor = "fill-[#4c7184]";
  } else if (teamSide === "red") {
    fillColor = "fill-[#844c4c]";
  }

  function renderObjectiveIcon(icon) {
    switch (icon) {
      case "inhibitorsDestroyed":
        return <InhibitorIcon fillColor={fillColor}>{count}</InhibitorIcon>;
      case "towersDestroyed":
        return <TowerIcon fillColor={fillColor}>{count}</TowerIcon>;
      case "baronsKilled":
        return <BaronIcon fillColor={fillColor}>{count}</BaronIcon>;
      case "kills":
        return <KillIcon fillColor={fillColor}>{count}</KillIcon>;
    }
  }

  return (
    <div className="inline-block text-center font-medium w-6 h-12">
      {renderObjectiveIcon(icon)}
    </div>
  );
}
