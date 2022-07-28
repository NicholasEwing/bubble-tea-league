import { useLayoutEffect, useRef, useState } from "react";
import ColumnHeader from "./table/ColumnHeader";
import TableHead from "./table/TableHead";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SeasonsTable({ seasons }) {
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedSeasons, setSelectedSeasons] = useState([]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedSeasons.length > 0 && selectedSeasons.length < seasons.length;
    setChecked(selectedSeasons.length === seasons.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedSeasons, seasons.length]);

  function toggleAll() {
    setSelectedSeasons(checked || indeterminate ? [] : seasons);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-white">Seasons</h1>
          <p className="mt-2 text-sm text-gray-400">
            A list of all Bubble Tea League seasons registered including their
            season number, and assigned year.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Creating a season will automatically generate 10 (randomized) teams,
            45 Group Stage matches, and 14 Playoffs matches.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Teams will automatically be assigned for the Group Stage. Playoffs
            bracket will automatically be seeded once Group Stage matches have
            finished.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            After you&apos;ve made a season, be sure to rename teams, create
            players / assign them to teams, and assign times to all matches.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2 sm:w-auto"
          >
            Add season
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <TableHead
                  checkbox={checkbox}
                  checked={checked}
                  toggleAll={toggleAll}
                >
                  <ColumnHeader name="Number" small />
                  <ColumnHeader name="Year" small />
                </TableHead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {seasons.map((season) => (
                    <tr
                      key={`Season-${season.id}`}
                      className={
                        selectedSeasons.includes(season)
                          ? "bg-gray-50"
                          : undefined
                      }
                    >
                      <td className="relative w-6 px-6 sm:w-8 sm:px-8">
                        {selectedSeasons.includes(season) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-teal-accent" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-teal-accent hover:ring-teal-accent sm:left-6"
                          value={season.number}
                          checked={selectedSeasons.includes(season)}
                          onChange={(e) =>
                            setSelectedSeasons(
                              e.target.checked
                                ? [...selectedSeasons, season]
                                : selectedSeasons.filter((p) => p !== season)
                            )
                          }
                        />
                      </td>
                      <td
                        className={classNames(
                          "whitespace-nowrap py-4 px-3 text-sm font-medium",
                          selectedSeasons.includes(season)
                            ? "text-teal-accent"
                            : "text-gray-900"
                        )}
                      >
                        {season.number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {season.year}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-teal-accent hover:text-cyan-800"
                        >
                          Edit<span className="sr-only">, {season.number}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
