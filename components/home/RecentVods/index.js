import Image from "next/image";
import React from "react";
import TeamLogo from "../../match-results/TeamHeader/TeamLogo";
import VodItem from "./VodItem";

export default function RecentVods() {
  // TODO: dynamically insert finished matches here!!! autofill as much info as possible

  // TODO: expect admins to upload youtube link for each video, give edit ability

  return (
    <div className="HomeVods w-full text-white">
      <div className="title pt-9 pl-4 font-medium uppercase tracking-widest text-[#8fa3b0]">
        RECENT MATCH VODS
      </div>
      <div className="vods-list flex flex-col py-4 pl-4 lg:flex-row">
        <VodItem />
        <VodItem />
        <VodItem />
        <VodItem />
        <VodItem />
      </div>
    </div>
  );
}
