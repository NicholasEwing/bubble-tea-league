import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";

export default function HomeContent({
  teamOne,
  teamTwo,
  bestOf,
  scheduledTime,
  season,
}) {
  return (
    <div className="HomeLiveBanner relative bg-home-hero bg-cover py-10">
      <a
        href="https://www.twitch.tv/thebubbletealeague"
        className="invisible-overlay-button z-10 h-full w-full cursor-pointer"
      >
        <div className="header mb-5 flex flex-row items-center justify-center">
          <TeamLogo
            tbd={!teamOne}
            tricode={teamOne?.tricode}
            height="80"
            width="80"
          />
          <div className="text align-center relative mb-5 flex flex-col justify-center text-center text-white">
            <div className="league-round text-sm font-medium uppercase tracking-widest opacity-60 md:text-base">
              <span className="name">Season {season}</span>
              <span className="hyphen">&nbsp;-&nbsp;</span>
              <span className="round">{bestOf}</span>
            </div>
            <div className="title text-xl font-bold md:text-5xl">
              {teamOne.tricode}
              <span className="vs lower px-4 text-sm md:text-3xl">VS</span>
              {teamTwo.tricode}
            </div>
          </div>
          <TeamLogo
            tbd={!teamTwo}
            tricode={teamTwo?.tricode}
            height="80"
            width="80"
          />
        </div>
        <div className="video-container pointer-events-none relative hidden min-h-[60px] flex-col items-center md:flex">
          <iframe
            title="Proving Grounds - TL VS 100"
            className="video"
            height="410"
            width="730"
            src="https://player.twitch.tv/?channel=thebubbletealeague&amp;autoplay=true&amp;muted=true&amp;controls=false&amp;volume=0&amp;parent=localhost:3000"
            frameBorder="0"
            allow="autoplay"
          ></iframe>
          <div className="watch-live absolute bottom-5 left-1/2 -translate-x-1/2 rounded-3xl bg-[#de2f2f] py-3 px-6 font-medium tracking-widest text-white">
            WATCH LIVE
          </div>
        </div>
      </a>
    </div>
  );
}
