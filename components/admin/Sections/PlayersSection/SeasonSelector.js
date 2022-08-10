/* This example requires Tailwind CSS v2.0+ */
export default function SeasonSelector({
  seasons,
  activeSeason,
  handleActiveSeason,
}) {
  return (
    <>
      <p className="text-gray-300 text-sm mt-2 mb-1">Season Selector:</p>

      <span className="relative z-0 inline-flex shadow-sm rounded-md mb-2 items-center">
        {seasons.map((season, i) => {
          const isSolo = (seasons.length = 1);
          const isFirst = i === 0;
          const isLast = i === seasons.length;

          return (
            <button
              key={`season-selector-${season.number}`}
              type="button"
              onClick={() => handleActiveSeason(season.number)}
              className={`${isFirst && !isSolo && "rounded-l-md"} 
            ${isLast && "rounded-r-md"} ${
                isSolo && "rounded-md"
              } relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-teal-accent focus:border-teal-accent`}
            >
              {season.number}
            </button>
          );
        })}
      </span>
    </>
  );
}
