import React from "react";
import BaronIcon from "./BaronIcon";
import InhibitorIcon from "./InhibitorIcon";

export default function ObjectiveIcon({ teamSide, icon }) {
  let fillColor = "fill-[#FFFFFF]";

  if (teamSide === "blue") {
    fillColor = "fill-[#4c7184]";
  } else if (teamSide === "red") {
    fillColor = "fill-[#844c4c]";
  }

  return (
    <div className="inline-block text-center text-lg font-medium w-6 h-12">
      <InhibitorIcon fillColor={fillColor} />
      0
      <BaronIcon fillColor={fillColor} />0
    </div>
  );
}
