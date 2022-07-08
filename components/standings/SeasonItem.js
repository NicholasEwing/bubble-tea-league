import React from "react";

export default function SeasonItem({ season, isActive, handleActiveSeason }) {
  return (
    <li
      onClick={() => handleActiveSeason(season.number)}
      className={`season ${
        isActive ? "pointer-events-none" : "cursor-pointer"
      } h-16 relative list-none border-b border-b-[#252c32] text-[#8fa3b0] after:absolute after:left-0 after:top-0 after:w-1 after:h-full after:z-50 ${
        isActive ? "after:bg-[#00c8c8]" : "after:bg-transparent"
      }`}
    >
      <button className="button info h-full w-full flex items-center">
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
            className={`name -mb-1 text-sm ${
              isActive ? "font-normal text-white" : "font-light #8fa3b0"
            }`}
          >
            Bubble Tea League {season.year}
          </div>
          <div className="season uppercase tracking-widest font-medium text-sm text-[#8fa3b0]">
            Season {season.number}
          </div>
        </div>
      </button>
    </li>
  );
}
