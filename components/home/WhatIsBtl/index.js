import React from "react";

export default function WhatIsBtl() {
  return (
    <div className="border-b border-b-[#252c32]  bg-gradient-to-br from-[#0a0e13] to-slate-800">
      <div className="flex w-full flex-col lg:flex-row">
        <div className="w-full py-16 px-8 sm:py-24 sm:px-16 lg:w-1/2 lg:px-32">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            What is the{" "}
            <span className="text-btl-blue">Bubble Tea League?</span>
          </h2>
          <p className="mt-5 text-white sm:text-sm md:text-base lg:text-xl">
            The BTL is an exclusive gaming community focused on improvement
            &amp; competition. Every year, 50 players compete for fun and
            bragging rights as the action is broadcast live on{" "}
            <a
              href="https://www.twitch.tv/thebubbletealeague"
              className="font-medium text-btl-pink underline underline-offset-4"
            >
              the official Twitch channel
            </a>
            .
          </p>
        </div>
        <div className="h-128 w-full bg-black lg:w-1/2 ">
          <video autoPlay loop muted className="h-full w-full object-cover ">
            <source src="/seize-the-throne.mp4" type="video/mp4" />
            <source
              src="/seize-the-throne.webm"
              type="video/webm; codecs=vp9"
            />
          </video>
        </div>
      </div>
    </div>
  );
}
