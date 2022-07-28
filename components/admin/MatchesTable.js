import { useLayoutEffect, useRef, useState } from "react";
import ColumnHeader from "./table/ColumnHeader";
import TableHead from "./table/TableHead";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MatchesTable({ teams, matches }) {
  console.log("matches", matches);
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedMatches, setSelectedMatches] = useState([]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedMatches.length > 0 && selectedMatches.length < matches.length;
    setChecked(selectedMatches.length === matches.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedMatches, matches.length]);

  function toggleAll() {
    setSelectedMatches(checked || indeterminate ? [] : matches);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-white">Matches</h1>
          <p className="mt-2 text-sm text-gray-400">
            A list of all the matches in the Bubble Tea League including their
            format, time, teams, and season.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {selectedMatches.length > 1 && (
                <div className="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-50 sm:left-16">
                  <button
                    type="button"
                    className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Bulk edit
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Delete all
                  </button>
                </div>
              )}
              <table className="min-w-full table-fixed divide-y divide-gray-300">
                <TableHead
                  checkbox={checkbox}
                  checked={checked}
                  toggleAll={toggleAll}
                >
                  <ColumnHeader name="Match Id" small />
                  <ColumnHeader name="Match Stage" />
                  <ColumnHeader name="Scheduled Time" />
                  <ColumnHeader name="Season" small />
                  <ColumnHeader name="Team One" />
                  <ColumnHeader name="Team Two" />
                  <ColumnHeader name="Match Winner" />
                </TableHead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {matches.map((match) => (
                    <tr
                      key={match.id}
                      className={
                        selectedMatches.includes(match)
                          ? "bg-gray-50"
                          : undefined
                      }
                    >
                      <td className="relative w-6 px-6 sm:w-8 sm:px-8">
                        {selectedMatches.includes(match) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-teal-accent" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-teal-accent hover:ring-teal-accent sm:left-6"
                          value={match.number}
                          checked={selectedMatches.includes(match)}
                          onChange={(e) =>
                            setSelectedMatches(
                              e.target.checked
                                ? [...selectedMatches, match]
                                : selectedMatches.filter((p) => p !== match)
                            )
                          }
                        />
                      </td>
                      <td
                        className={classNames(
                          "whitespace-nowrap py-4 px-3 text-sm font-medium",
                          selectedMatches.includes(match)
                            ? "text-teal-accent"
                            : "text-gray-900"
                        )}
                      >
                        {match.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {match.isPlayoffsMatch
                          ? `Playoffs - ${
                              match.isUpperBracket ? "Upper -" : "Lower -"
                            } ${match.bracketRound}`
                          : "Group Stage"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(match.scheduledTime).toDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {match.season}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {match.teamOne
                          ? teams.find((t) => t.id === match.teamOne)[
                              "teamName"
                            ]
                          : "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {match.teamTwo
                          ? teams.find((t) => t.id === match.teamTwo)[
                              "teamName"
                            ]
                          : "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {match.matchWinnerTeamId
                          ? teams.find((t) => t.id === match.matchWinnerTeamId)[
                              "teamName"
                            ]
                          : "N/A"}
                      </td>
                      {/* Edit button */}
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-teal-accent hover:text-cyan-800"
                        >
                          Edit<span className="sr-only">, {match.id}</span>
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
