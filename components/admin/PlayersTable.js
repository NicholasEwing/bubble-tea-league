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
import TextHeadingContainer from "./TextHeadingContainer";

export default function PlayersTable({ teams, players }) {
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedPlayers.length > 0 && selectedPlayers.length < players.length;
    setChecked(selectedPlayers.length === players.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedPlayers, players.length]);

  function toggleAll() {
    setSelectedPlayers(checked || indeterminate ? [] : players);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  return (
    <SectionContainer>
      <TextHeadingContainer hasAddButton buttonText="Add player">
        <h1 className="text-xl font-semibold text-white">Players</h1>
        <p className="mt-2 text-sm text-gray-400">
          A list of all the players in the Bubble Tea League including their
          role and team name.
        </p>
      </TextHeadingContainer>
      <TableContainer>
        <MultiSelectButtons selectedItems={selectedPlayers} />
        <Table>
          <TableHead
            checkbox={checkbox}
            checked={checked}
            toggleAll={toggleAll}
          >
            <ColumnHeader name="Summoner Name" />
            <ColumnHeader name="Role" small />
            <ColumnHeader name="Team" />
          </TableHead>
          <TableBody>
            {players.map((player) => (
              <Row
                key={`${varAsString({ player })}-${player.id}`}
                selectedItems={selectedPlayers}
                item={player}
                setSelectedItems={setSelectedPlayers}
              >
                <Cell selectedItems={selectedPlayers} item={player}>
                  {player.summonerName}
                </Cell>
                <Cell>{player.role}</Cell>
                <Cell>
                  {teams.find((t) => t.id === player.TeamId)["teamName"]}
                </Cell>
                <EditButton item={player.id} />
              </Row>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SectionContainer>
  );
}
