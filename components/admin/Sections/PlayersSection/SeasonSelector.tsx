/* This example requires Tailwind CSS v2.0+ */

import { Season } from "@prisma/client";
import { MouseEventHandler } from "react";

interface SeasonSelectorProps {
  seasons: Season[];
  activeSeason: number;
  handleActiveSeason: (number: number) => void;
}

export default function SeasonSelector({
  seasons,
  activeSeason,
  handleActiveSeason,
}: SeasonSelectorProps) {
  return (
    <>
      <p className="mt-2 mb-1 text-sm text-gray-300">Season Selector:</p>
      <span className="relative z-0 mb-2 inline-flex items-center rounded-md shadow-sm">
        {seasons.map((season, i) => {
          const isSolo = (seasons.length = 1);
          const isFirst = i === 0;
          const isLast = i === seasons.length;

          return (
            <button
              key={`season-selector-${season.id}`}
              type="button"
              onClick={() => handleActiveSeason(season.id)}
              className={`${isFirst && !isSolo && "rounded-l-md"} 
            ${isLast && "rounded-r-md"} ${
                isSolo && "rounded-md"
              } relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-teal-accent focus:outline-none focus:ring-1 focus:ring-teal-accent`}
            >
              {season.id}
            </button>
          );
        })}
      </span>
    </>
  );
}
