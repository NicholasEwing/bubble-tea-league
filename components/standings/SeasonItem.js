import React from "react";

export default function SeasonItem({ season, isActive, handleActiveSeason }) {
  return (
    <li
      onClick={() => handleActiveSeason(season.id)}
      className={`season ${
        isActive ? "pointer-events-none" : "cursor-pointer"
      } relative h-16 list-none border-b border-b-[#252c32] text-[#8fa3b0] after:absolute after:left-0 after:top-0 after:z-50 after:h-full after:w-1 lg:after:left-auto lg:after:right-0 ${
        isActive ? "after:bg-teal-accent" : "after:bg-transparent"
      }`}
    >
      <button className="button info flex h-full w-full items-center">
        {/* leave here if we want season-specific icons later */}
        {/* <div
          className={`mx-4 inline-block float-left ${
            isActive ? "opacity-100" : "opacity-30"
          } `}
        >
          <Image
            src="https://www.fillmurray.com/45/45/"
            className="image"
            alt=""
            width={45}
            height={45}
          />
        </div> */}
        <div className="label mx-4 pt-1 text-left">
          <div
            className={`name -mb-1 text-sm lg:text-base ${
              isActive ? "font-normal text-white" : "#8fa3b0 font-light"
            }`}
          >
            Bubble Tea League {season.year}
          </div>
          <div className="season text-sm font-medium uppercase tracking-widest text-[#8fa3b0] lg:text-base">
            Season {season.id}
          </div>
        </div>
      </button>
    </li>
  );
}
