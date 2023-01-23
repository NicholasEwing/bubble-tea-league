import { useState } from "react";
import Modal from "../../modal";
import PlayersModal from "../AdminModals/PlayersModal";
import AddButton from "../table/AddButton";
import SectionContainer from "../table/SectionContainer";
import TextHeadingContainer from "../TextHeadingContainer";
import dynamic from "next/dynamic";
import { Player } from "@prisma/client";
import {
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  GridColumnIcon,
  Item,
} from "@glideapps/glide-data-grid";
import useAPIError from "../../hooks/useAPIError";

const Grid = dynamic(
  () => {
    return import("../../GlideGrid/index");
  },
  { ssr: false }
);

interface FreeAgentsSectionProps {
  players: Player[];
  freeAgents: Player[];
}

export default function FreeAgentsSection({
  players,
  freeAgents,
}: FreeAgentsSectionProps) {
  // TODO: component renders 4 times on page load, fix this
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const { error, addError } = useAPIError();

  // Grid columns may also provide icon, overlayIcon, menu, style, and theme overrides
  const columns: GridColumn[] = [
    {
      title: "Summoner Name",
      id: "summonerName",
      icon: GridColumnIcon.HeaderString,
      overlayIcon: GridColumnIcon.ProtectedColumnOverlay,
    },
    {
      title: "Discord",
      id: "discordName",
      icon: GridColumnIcon.RowOwnerOverlay,
    },
    {
      title: "First Name",
      id: "firstName",
      icon: GridColumnIcon.HeaderString,
    },
  ];

  function getFreeAgents([col, row]: Item): GridCell {
    const data = freeAgents[row];

    if (col === 0) {
      return {
        kind: GridCellKind.Text,
        data: data?.summonerName || "",
        allowOverlay: false,
        readonly: true,
        displayData: data?.summonerName,
      };
    } else if (col === 1) {
      return {
        kind: GridCellKind.Text,
        data: data?.discordName || "",
        allowOverlay: true,
        readonly: false,
        displayData: data?.discordName,
      };
    } else if (col === 2) {
      return {
        kind: GridCellKind.Text,
        data: data?.firstName || "",
        allowOverlay: true,
        readonly: false,
        displayData: data?.firstName || "",
      };
    } else {
      throw new Error(
        "There was an error when updating getData within Grid.tsx!"
      );
    }
  }

  const onCellEdited = async ([col, row]: Item, newValue: EditableGridCell) => {
    if (newValue.kind !== GridCellKind.Text) return;
    const data = freeAgents[row];

    switch (col) {
      case 1:
        data["discordName"] = newValue.data;
        break;
      case 2:
        data["firstName"] = newValue.data;
        break;
      default:
        break;
    }

    try {
      // TODO: Emit update event here, then broadcast from the server to all OTHER clients...
      const res = await fetch("/api/player", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ player: { ...data } }),
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }
    } catch (error: any) {
      if ("message" in error) {
        addError(error.message);
      } else {
        addError(
          "Something went wrong when updating Free Agents. Please check your changes."
        );
      }
    }
  };

  return (
    <SectionContainer>
      <TextHeadingContainer>
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-white">Free Agents</h1>
          <AddButton buttonText="Add free agent" buttonAction={openModal} />
        </div>
        <p className="mt-2 text-sm text-gray-400">
          A list of all the free agents in the Bubble Tea League. Free agents
          are team-agnostic, so they don&apos;t have a team or role associated
          with them.
        </p>
      </TextHeadingContainer>
      <Grid
        data={freeAgents}
        columns={columns}
        getData={getFreeAgents}
        onCellEdited={onCellEdited}
      />
      <Modal open={open} closeModal={closeModal}>
        <PlayersModal players={players} closeModal={closeModal} isFreeAgent />
      </Modal>
    </SectionContainer>
  );
}
