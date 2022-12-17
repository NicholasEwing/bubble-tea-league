import { useState } from "react";
import Modal from "../../modal";
import SeasonsModal from "../AdminModals/SeasonsModal";
import AddButton from "../table/AddButton";
import SectionContainer from "../table/SectionContainer";
import TextHeadingContainer from "../TextHeadingContainer";
import useAPIError from "../../hooks/useAPIError";
import { Player, Season } from "@prisma/client";
import {
  GridCell,
  GridCellKind,
  GridColumn,
  GridColumnIcon,
  Item,
} from "@glideapps/glide-data-grid";
import Grid from "../../GlideGrid";

interface SeasonsSectionProps {
  seasons: Season[];
  players: Player[];
}

export default function SeasonsSection({
  seasons,
  players,
}: SeasonsSectionProps) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const { addError } = useAPIError();

  const columns: GridColumn[] = [
    {
      title: "Season Number",
      id: "id",
      icon: GridColumnIcon.HeaderRowID,
      overlayIcon: GridColumnIcon.ProtectedColumnOverlay,
    },
    {
      title: "Year",
      id: "year",
      icon: GridColumnIcon.HeaderDate,
    },
  ];

  const regularPlayers = players.filter((p) => !p.isFreeAgent);

  function getMatches([col, row]: Item): GridCell {
    if (!seasons) {
      return {
        kind: GridCellKind.Text,
        data: "",
        allowOverlay: true,
        readonly: true,
        displayData: "",
      };
    }
    const data = seasons[row];

    if (col === 0) {
      return {
        kind: GridCellKind.Number,
        data: data.id,
        allowOverlay: true,
        readonly: true,
        displayData: data.id.toString(),
      };
    } else if (col === 1) {
      return {
        kind: GridCellKind.Number,
        data: data.year,
        allowOverlay: false,
        readonly: true,
        displayData: data.year.toString(),
      };
    } else {
      addError(
        "There was an error when updating data! Please check your changes."
      );
      throw new Error("There was an error when updating data!");
    }
  }

  return (
    <SectionContainer>
      <TextHeadingContainer>
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-white">Seasons</h1>
          <AddButton
            buttonText="Add season"
            buttonAction={openModal}
            disabled={regularPlayers.length < 50}
          />
        </div>
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
          There must be at player 50 players (not free agents) in the system in
          order to generate a season.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          After you&apos;ve made a season, be sure to rename teams, create
          additional players as needed players / attach them to teams, and
          assign times to all matches.
        </p>
      </TextHeadingContainer>
      <Grid data={seasons} columns={columns} getData={getMatches} />
      <Modal open={open} closeModal={closeModal}>
        <SeasonsModal seasons={seasons} closeModal={closeModal} />
      </Modal>
    </SectionContainer>
  );
}
