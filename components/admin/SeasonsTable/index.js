import { useLayoutEffect, useRef, useState } from "react";
import { isEqual, varAsString } from "../../../lib/utils";
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
  const [isEditing, setIsEditing] = useState(false);

  const [editState, setEditState] = useState(seasons);
  const [seasonState, setSeasonState] = useState(seasons);

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

  function openModal() {
    setOpen(true);
  }

  function handleChanges(e) {
    const newSeasonYear = e.target.value === "" ? "" : parseInt(e.target.value);

    const seasonId = parseInt(e.target.dataset.id);
    const season = seasonState.find((s) => s.number === seasonId);

    if (e.target.validity.valid) {
      const newSeasonState = seasonState.map((s) => {
        if (s.number === season.number) {
          return { ...season, year: newSeasonYear };
        } else {
          return s;
        }
      });

      setEditState(newSeasonState);
    }
  }

  const canSave = !isEqual(editState, seasonState);

  function saveChanges() {
    setIsEditing(false);
    setSeasonState(editState);
  }

  function cancelChanges() {
    setIsEditing(false);
    setEditState(seasonState);
  }

  const canApply = isEqual(seasons, seasonState) ? false : true;

  function applyChanges() {
    const changedSeasons = seasonState.filter((stateObj) => {
      // return objs NOT in other array
      return !seasons.some((seasonObj) => {
        return stateObj.id === seasonObj;
      });
    });

    // make this PATCH request
    fetch("http://localhost:3000/api/seasons/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seasons: changedSeasons }),
    });
  }

  return (
    <SectionContainer>
      <Modal open={open} setOpen={setOpen}>
        <SeasonsModal seasons={seasons} />
      </Modal>
      <TextHeadingContainer
        hasAddButton
        buttonText="Add season"
        buttonAction={openModal}
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
            {editState.map((season, i) => (
              <Row
                key={`${varAsString({ season })}-${season.id}`}
                selectedItems={selectedSeasons}
                item={season}
                setSelectedItems={setSelectedSeasons}
              >
                <Cell
                  selectedItems={selectedSeasons}
                  item={season}
                  value={season.number}
                  canEdit={false}
                />
                <Cell
                  editing={isEditing}
                  inputName="year"
                  handleChanges={handleChanges}
                  value={season.year}
                  id={season.number}
                  canEdit
                  numsOnly
                />
                <EditButton
                  item={season.number}
                  editing={isEditing}
                  setIsEditing={setIsEditing}
                  saveChanges={saveChanges}
                  cancelChanges={cancelChanges}
                  canSave={canSave}
                />
              </Row>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button
        onClick={applyChanges}
        type="button"
        disabled={!canApply}
        className={`${
          canApply ? "opacity-100" : "opacity-30"
        } mt-8 self-end rounded-md border border-transparent bg-teal-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2 sm:w-auto`}
      >
        Apply
      </button>
    </SectionContainer>
  );
}
