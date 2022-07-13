import Image from "next/image";
import Link from "next/link";
import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";

export default function StandingItem({
  teamName,
  tricode,
  ordinal,
  wins = 0,
  losses = 0,
}) {
  return (
    <Link
      href="/teams/evil-geniuses"
      className="ranking relative items-center before:border-t before:border-[#292d31] before:h-[calc(100%+1px)] before:right-0 before:absolute before:w-full"
    >
      <a className="flex mx-4 h-16 border-t border-t-[#252c32] after:border-b after:border-b-[#292d31] after:right-0 after:absolute after:w-full after:h-[calc(100%+1px)]">
        <div className="ordinal w-[calc(((100%-374px)/12)*2+68px)] font-medium text-xl pr-4 flex items-center justify-center h-full">
          {ordinal}
        </div>
        <div className="team flex items-center h-full w-full border-t border-t-[#252c32] ">
          <div className="team-logo w-11 flex justify-center mr-4">
            <TeamLogo tricode={tricode} width="45" height="45" />
          </div>
          <div className="team-info flex flex-col items-start justify-center">
            <div className="name text-sm">{teamName}</div>
            <div className="record leading-relaxed tracking-wider font-medium text-sm text-[#8fa3b0]">
              {wins}W-{losses}L
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
