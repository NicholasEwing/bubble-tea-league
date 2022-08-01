import { useLayoutEffect, useRef, useState } from "react";
import { varAsString } from "../../../lib/utils";
import Modal from "../../modal";
import Cell from "../table/Cell";
import ColumnHeader from "../table/ColumnHeader";
import EditButton from "../table/EditButton";
import Row from "../table/Row";
import SectionContainer from "../table/SectionContainer";
import Table from "../table/Table";
import TableBody from "../table/TableBody";
import TableContainer from "../table/TableContainer";
import TableHead from "../table/TableHead";
import TextHeadingContainer from "../table/TextHeadingContainer";
import SeasonsModal from "./SeasonsModal";

export default function SeasonsTable({ seasons }) {
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedSeasons, setSelectedSeasons] = useState([]);

  const [open, setOpen] = useState(false);

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
    <SectionContainer>
      <Modal open={open} setOpen={setOpen}>
        <SeasonsModal seasons={seasons} />
      </Modal>
      <TextHeadingContainer
        hasAddButton
        buttonText="Add season"
        setOpen={setOpen}
      >
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
      </TextHeadingContainer>
      <TableContainer>
        <Table>
          <TableHead
            checkbox={checkbox}
            checked={checked}
            toggleAll={toggleAll}
          >
            <ColumnHeader name="Number" small />
            <ColumnHeader name="Year" small />
          </TableHead>
          <TableBody>
            {seasons.map((season) => (
              <Row
                key={`${varAsString({ season })}-${season.id}`}
                selectedItems={selectedSeasons}
                item={season}
                setSelectedItems={setSelectedSeasons}
              >
                <Cell selectedItems={selectedSeasons} item={season}>
                  {season.number}
                </Cell>
                <Cell>{season.year}</Cell>
                <EditButton item={season.number} />
              </Row>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SectionContainer>
  );
}
