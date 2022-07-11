import React from "react";

export default function Tricode({ tricode, teamSide }) {
  return (
    <span
      className={`tricode ${
        teamSide === "blue" ? "text-left" : "text-right"
      } font-semibold px-2`}
    >
      {tricode}
    </span>
  );
}
