import { useLayoutEffect, useRef, useState } from "react";
import ColumnHeader from "./table/ColumnHeader";
import TableHead from "./table/TableHead";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TeamsTable({ teams }) {
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedTeams.length > 0 && selectedTeams.length < teams.length;
    setChecked(selectedTeams.length === teams.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedTeams, teams.length]);

  function toggleAll() {
    setSelectedTeams(checked || indeterminate ? [] : teams);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-white">Teams</h1>
          <p className="mt-2 text-sm text-gray-400">
            A list of all the teams in the Bubble Tea League including their
            team name, tricode, and season.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2 sm:w-auto"
          >
            Add team
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {selectedTeams.length > 1 && (
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
                  <ColumnHeader name="Team Name" />
                  <ColumnHeader name="Tricode" small />
                  <ColumnHeader name="Season" small />
                </TableHead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {teams.map((team) => (
                    <tr
                      key={team.id}
                      className={
                        selectedTeams.includes(team) ? "bg-gray-50" : undefined
                      }
                    >
                      <td className="relative w-6 px-6 sm:w-8 sm:px-8">
                        {selectedTeams.includes(team) && (
                          <div className="absolute inset-y-0 left-0 w-0.5 bg-teal-accent" />
                        )}
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-teal-accent hover:ring-teal-accent sm:left-6"
                          value={team.number}
                          checked={selectedTeams.includes(team)}
                          onChange={(e) =>
                            setSelectedTeams(
                              e.target.checked
                                ? [...selectedTeams, team]
                                : selectedTeams.filter((p) => p !== team)
                            )
                          }
                        />
                      </td>
                      <td
                        className={classNames(
                          "whitespace-nowrap py-4 px-3 text-sm font-medium",
                          selectedTeams.includes(team)
                            ? "text-teal-accent"
                            : "text-gray-900"
                        )}
                      >
                        {team.teamName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {team.tricode}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {team.season}
                      </td>
                      {/* Edit button */}
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <a
                          href="#"
                          className="text-teal-accent hover:text-cyan-800"
                        >
                          Edit<span className="sr-only">, {team.number}</span>
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
