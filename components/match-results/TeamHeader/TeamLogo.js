import Image from "next/image";
import React, { useState } from "react";

export default function TeamLogo({ tricode = "null", faded, tbd, small }) {
  const [src, setSrc] = useState(
    tbd ? "/team-tbd.png" : `/teams/${tricode}.png`
  );

  return (
    <div
      className={`flex ${faded ? "opacity-30" : ""} ${small ? "h-6 w-6" : ""}`}
    >
      <Image
        onError={() => setSrc("/teams/null.png/")}
        src={src}
        alt="Team Logo"
        width={36}
        height={36}
      />
    </div>
  );
}
