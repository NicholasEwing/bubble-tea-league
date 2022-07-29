import { useLayoutEffect, useRef, useState } from "react";
import { varAsString } from "../../lib/utils";
import Cell from "./table/Cell";
import ColumnHeader from "./table/ColumnHeader";
import EditButton from "./table/EditButton";
import MultiSelectButtons from "./table/MultiSelectButtons";
import Row from "./table/Row";
import SectionContainer from "./table/SectionContainer";
import Table from "./table/Table";
import TableBody from "./table/TableBody";
import TableContainer from "./table/TableContainer";
import TableHead from "./table/TableHead";
import TextHeadingContainer from "./table/TextHeadingContainer";

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
    <SectionContainer>
      <TextHeadingContainer hasAddButton buttonText="Add team">
        <h1 className="text-xl font-semibold text-white">Teams</h1>
        <p className="mt-2 text-sm text-gray-400">
          A list of all the teams in the Bubble Tea League including their team
          name, tricode, and season.
        </p>
      </TextHeadingContainer>
      <TableContainer>
        <MultiSelectButtons selectedItems={selectedTeams} />
        <Table>
          <TableHead
            checkbox={checkbox}
            checked={checked}
            toggleAll={toggleAll}
          >
            <ColumnHeader name="Team Name" />
            <ColumnHeader name="Tricode" small />
            <ColumnHeader name="Season" small />
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <Row
                key={`${varAsString({ team })}-${team.id}`}
                selectedItems={selectedTeams}
                item={team}
                setSelectedItems={setSelectedTeams}
              >
                <Cell selectedItems={selectedTeams} item={team}>
                  {team.teamName}
                </Cell>
                <Cell>{team.tricode}</Cell>
                <Cell>{team.season}</Cell>
                <EditButton item={team} />
              </Row>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SectionContainer>
  );
}
