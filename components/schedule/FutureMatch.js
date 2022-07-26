import Link from "next/link";
import React from "react";
import Score from "./Score";
import SeasonMatchInfo from "./SeasonMatchInfo";
import Team from "./Team";
import Time from "./Time";

export default function FutureMatch({ MatchId }) {
  return (
    <div className="text-white bg-[#0f1519] border-y border-y-[#252c32]">
      <Link href={`/match-results/${MatchId}`}>
        <a className="single past event mx-4 w-auto h-20 flex flex-row items-center relative">
          <Time hour="12" minute="00" ampm="PM" approx />
          <div className="teams w-[calc(((100%-165px)/12)*4+60px)] flex flex-col justify-center grow text-center relative">
            <Team teamName="Test" tricode="TEST" wins={5} losses={2} />
            <Team teamName="Test" tricode="TEST" wins={5} losses={2} />
          </div>
          <div className="w-[calc(((100%-195px)/12)*4+45px)]">
            <SeasonMatchInfo seasonNumber={1} format="Bo1" />
          </div>
        </a>
      </Link>
    </div>
  );
}