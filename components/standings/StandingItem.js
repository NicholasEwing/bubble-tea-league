import Image from "next/image";
import React from "react";

export default function StandingItem({ team, ordinal, wins, losses }) {
  return (
    <a
      href="/teams/evil-geniuses"
      className="ranking flex mx-4 h-16 relative items-center before:border-t before:border-[#292d31] before:h-[calc(100%+1px)] before:right-0 before:absolute before:w-full"
    >
      <div className="ordinal w-[calc(((100%-374px)/12)*2+68px)] font-medium text-xl pr-4 flex items-center justify-center h-full">
        {ordinal}
      </div>
      <div className="team flex items-center h-full w-full border-t border-t-[#252c32] after:border-b after:border-b-[#292d31] after:right-0 after:absolute after:w-full after:h-[calc(100%+1px)]">
        <div className="team-logo w-11 flex justify-center mr-4">
          <Image
            src="https://www.fillmurray.com/45/45/"
            className="logo"
            alt=""
            width="45"
            height="45"
          />
        </div>
        <div className="team-info flex flex-col items-start justify-center">
          <div className="name font-light">{team}</div>
          <div className="record leading-relaxed tracking-wider font-medium text-sm text-[#8fa3b0]">
            {wins}W-{losses}L
          </div>
        </div>
      </div>
    </a>
  );
}
