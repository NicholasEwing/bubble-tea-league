import Image from "next/image";
import React from "react";

export default function TeamHeader({ tricode, teamSide }) {
  function Tricode() {
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

  function TeamLogo() {
    return (
      <Image
        src={`/teams/${tricode}.png`}
        alt="Team Logo"
        width="36"
        height="36"
      />
    );
  }

  if (teamSide === "blue") {
    return (
      <div className="team flex items-center p-3">
        <Tricode />
        <TeamLogo />
      </div>
    );
  } else if (teamSide === "red") {
    return (
      <div className="team flex items-center p-3">
        <TeamLogo />
        <Tricode />
      </div>
    );
  }
}
