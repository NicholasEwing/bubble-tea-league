import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";

export default function HomeContent({
  teamOne,
  teamTwo,
  bestOf,
  scheduledTime,
  season,
  featuredMatch,
}) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={
        featuredMatch
          ? "https://www.twitch.tv/thebubbletealeague"
          : "https://www.youtube.com/channel/UCp9thtIHYrohmAW3qzQCLfQ"
      }
      className="invisible-overlay-button z-10 h-full w-full cursor-pointer"
    >
      <div className="HomeLiveBanner relative bg-home-hero bg-cover pt-8">
        <div className="header mb-5 flex flex-row items-center justify-center">
          <TeamLogo
            tbd={!teamOne}
            tricode={teamOne?.tricode}
            height="80"
            width="80"
          />
          <div className="text align-center relative mb-5 flex flex-col justify-center text-center text-white">
            <div className="league-round text-sm font-medium uppercase tracking-widest opacity-60 md:text-base">
              <span className="name">Season {season || "8"}</span>
              <span className="hyphen">&nbsp;-&nbsp;</span>
              <span className="round">{bestOf}</span>
            </div>
            <div className="title text-xl font-bold md:text-5xl">
              {teamOne?.tricode || "BEE"}
              <span className="vs lower px-4 text-sm md:text-3xl">VS</span>
              {teamTwo?.tricode || "AR"}
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
          {featuredMatch ? (
            <iframe
              title="Proving Grounds - TL VS 100"
              className="video"
              height="410"
              width="730"
              src="https://player.twitch.tv/?channel=thebubbletealeague&amp;autoplay=true&amp;muted=true&amp;controls=false&amp;volume=0&amp;parent=localhost:3000"
              frameBorder="0"
              allow="autoplay"
            ></iframe>
          ) : (
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/8g1OcOlQTZY?start=1365&amp;autoplay=1&amp;mute=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
      <div className="watch-live my-6 mx-auto w-56 rounded-3xl bg-[#de2f2f] py-3 px-6 text-center font-medium uppercase tracking-widest text-white">
        {featuredMatch ? "Watch Live" : "Watch VODs"}
      </div>
    </a>
  );
}
