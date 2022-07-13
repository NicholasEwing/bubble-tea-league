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
      <a className="flex mx-4 h-16 border-t border-t-[#252c32] lg:mx-9 lg:h-28 lg:w-[calc(100%-(2*34px))] after:border-b after:border-b-[#292d31] after:right-0 after:absolute after:w-full after:h-[calc(100%+1px)]">
        <div className="ordinal w-[calc(((100%-374px)/12)*2+68px)] lg:w-[calc(((100%-272px)/9)*1+34px)] font-medium text-xl lg:text-5xl pr-4 lg:pr-9 flex items-center justify-center h-full">
          {ordinal}
        </div>
        <div className="team flex items-center h-full w-full border-t border-t-[#252c32]">
          {/* the next image component is dumb so I have to do this stuff unless I want to make my own wrapper ~_~ */}
          <div className="team-logo w-11 flex justify-center mr-4 lg:hidden">
            <TeamLogo tricode={tricode} width="45" height="45" />
          </div>
          <div className="team-logo w-16 justify-center mr-4 hidden lg:flex">
            <TeamLogo tricode={tricode} width="64" height="64" />
          </div>
          <div className="team-info flex flex-col items-start justify-center">
            <div className="name text-sm font-light lg:text-lg lg:mt-2">
              {teamName}
            </div>
            <div className="record leading-relaxed tracking-wider font-medium text-sm text-[#8fa3b0]">
              {wins}W-{losses}L
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
