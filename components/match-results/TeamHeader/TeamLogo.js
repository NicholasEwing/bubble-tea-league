import Image from "next/image";
import React from "react";

export default function TeamLogo({ tricode, width = 36, height = 36 }) {
  return (
    <Image
      src={`/teams/${tricode}.png`}
      alt="Team Logo"
      width={width}
      height={height}
    />
  );
}
