import { useLayoutEffect, useRef, useState } from "react";
import Cell from "./table/Cell";
import ColumnHeader from "./table/ColumnHeader";
import EditButton from "./table/EditButton";
import MultiSelectButtons from "./table/MultiSelectButtons";
import Row from "./table/Row";
import Table from "./table/Table";
import TableBody from "./table/TableBody";
import TableHead from "./table/TableHead";
import TextHeadingContainer from "./table/TextHeadingContainer";
import SectionContainer from "./table/SectionContainer";
import TableContainer from "./table/TableContainer";
import { varAsString } from "../../lib/utils";

export default function MatchesTable({ teams, matches }) {
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
    <SectionContainer>
      <TextHeadingContainer>
        <h1 className="text-xl font-semibold text-white">Matches</h1>
        <p className="mt-2 text-sm text-gray-400">
          A list of all the matches in the Bubble Tea League including their
          format, time, teams, and season.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Matches are only generated when creating a new season and can&apos;t
          be deleted.
        </p>
      </TextHeadingContainer>
      <TableContainer>
        <MultiSelectButtons selectedItems={selectedMatches} />
        <Table>
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
          <TableBody>
            {matches.map((match) => (
              <Row
                key={`${varAsString({ match })}-${match.id}`}
                selectedItems={selectedMatches}
                item={match}
                setSelectedItems={setSelectedMatches}
              >
                <Cell selectedItems={selectedMatches} item={match}>
                  {match.id}
                </Cell>
                <Cell>
                  {match.isPlayoffsMatch
                    ? `Playoffs - ${
                        match.isUpperBracket ? "Upper -" : "Lower -"
                      } ${match.bracketRound}`
                    : "Group Stage"}
                </Cell>
                <Cell>{new Date(match.scheduledTime).toDateString()}</Cell>
                <Cell> {match.season}</Cell>
                <Cell>
                  {match.teamOne
                    ? teams.find((t) => t.id === match.teamOne)["teamName"]
                    : "N/A"}
                </Cell>
                <Cell>
                  {match.teamTwo
                    ? teams.find((t) => t.id === match.teamTwo)["teamName"]
                    : "N/A"}
                </Cell>
                <Cell>
                  {match.matchWinnerTeamId
                    ? teams.find((t) => t.id === match.matchWinnerTeamId)[
                        "teamName"
                      ]
                    : "N/A"}
                </Cell>
                <EditButton item={match} />
              </Row>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SectionContainer>
  );
}
