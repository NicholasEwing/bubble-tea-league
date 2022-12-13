import Image from "next/image";
import { useState } from "react";

interface TeamLogoProps {
  tricode: string | null;
  faded?: boolean;
  tbd?: boolean;
  small?: boolean;
  width?: number;
  height?: number;
}

export default function TeamLogo({
  tricode,
  faded,
  tbd,
  small = false,
  width = 36,
  height = 36,
}: TeamLogoProps) {
  const [src, setSrc] = useState(
    tbd ? "/team-tbd.png" : `${process.env.s3BucketUrl}/teams/${tricode}.png`
  );

  return (
    <div
      className={`flex ${faded ? "opacity-30" : ""} ${small ? "h-6 w-6" : ""}`}
    >
      <Image
        src={src}
        alt="Team Logo"
        width={width}
        height={height}
        onError={() => setSrc("/team-null.png")}
      />
    </div>
  );
}
