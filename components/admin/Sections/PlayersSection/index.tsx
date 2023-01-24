import {
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  GridColumnIcon,
  Item,
} from "@glideapps/glide-data-grid";
import { Player, PlayerTeamHistory, Season, Team } from "@prisma/client";
import { useEffect, useState } from "react";
import Grid from "../../../GlideGrid";
import useAPIError from "../../../hooks/useAPIError";
import Modal from "../../../modal";
import PlayersModal from "../../AdminModals/PlayersModal";
import AddButton from "../../Buttons/AddButton";
import SectionContainer from "../../../Containers/SectionContainer";
import TextHeadingContainer from "../../../Containers/TextHeadingContainer";

interface PlayersSectionProps {
  assignedPlayers: Player[];
  teams: Team[];
  seasons: Season[];
  playerTeamHistories: PlayerTeamHistory[];
}

export default function PlayersSection({
  assignedPlayers,
  teams,
  seasons,
  playerTeamHistories,
}: PlayersSectionProps) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const [activeSeason, setActiveSeason] = useState(seasons[0]?.id || 1);
  const [seasonTeams, setSeasonTeams] = useState(
    teams.filter((t) => t.seasonId === activeSeason)
  );

  const handleActiveSeason = (number: number) => setActiveSeason(number);

  useEffect(() => {
    const seasonTeams = teams.filter((t) => t.seasonId === activeSeason);
    setSeasonTeams(seasonTeams);
  }, [activeSeason, teams]);

  const teamOptions = teams.map((t) => {
    return { id: t.id, value: t.teamName };
  });

  const playerRoleFormatter = (playerId: number) => {
    const seasonTeamIds = seasonTeams.map((st) => st.id);
    const playersCurrentSeason = playerTeamHistories?.find(
      (pth) => pth.playerId === playerId && seasonTeamIds.includes(pth.teamId)
    );
    console.log("playersCurrentSeason", playersCurrentSeason);
  };

  const { addError } = useAPIError();

  // TODO: Reactivate (or make a prettier verison) of the Season selector
  // TODO: Calculate player's team / role for a Season
  // TODO: Add dropdown options to edit player's team / role for a Season
  // TODO: Ensure someone can't add an existing free agent as a player

  const columns: GridColumn[] = [
    {
      title: "Summoner Name",
      id: "summonerName",
      icon: GridColumnIcon.HeaderRowID,
      overlayIcon: GridColumnIcon.ProtectedColumnOverlay,
    },
    {
      title: "Discord",
      id: "discordName",
      icon: GridColumnIcon.RowOwnerOverlay,
    },
    {
      title: "Email",
      id: "email",
      icon: GridColumnIcon.HeaderString,
    },
    // {
    //   title: "Role",
    //   id: "playerRole",
    //   icon: GridColumnIcon.HeaderReference
    // },
    // {
    //   title: "Team",
    //   id: "team",
    //   icon: GridColumnIcon.HeaderRollup
    // }
  ];

  function getPlayers([col, row]: Item): GridCell {
    if (!assignedPlayers) {
      return {
        kind: GridCellKind.Text,
        data: "",
        allowOverlay: true,
        readonly: true,
        displayData: "",
      };
    }
    const data = assignedPlayers[row];

    if (col === 0) {
      return {
        kind: GridCellKind.Text,
        data: data?.summonerName || "",
        allowOverlay: true,
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
        data: data?.email || "",
        allowOverlay: true,
        readonly: false,
        displayData: data?.email || "",
      };
    } else {
      addError(
        "There was an error when updating data! Please check your changes."
      );
      throw new Error("There was an error when updating data!");
    }
  }

  const onCellEdited = async ([col, row]: Item, newValue: EditableGridCell) => {
    if (newValue.kind !== GridCellKind.Text) return;
    const data = assignedPlayers[row];

    switch (col) {
      case 1:
        data["discordName"] = newValue.data;
        break;
      case 2:
        data["email"] = newValue.data;
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
          <h1 className="text-xl font-semibold text-white">Players</h1>
          <AddButton buttonText="Add player" buttonAction={openModal} />
        </div>
        <p className="mt-2 text-sm text-gray-400">
          A list of all the players in the Bubble Tea League including their
          role and team name (depending on the season).
        </p>
      </TextHeadingContainer>
      <Grid
        data={assignedPlayers}
        columns={columns}
        getData={getPlayers}
        onCellEdited={onCellEdited}
      />
      <Modal open={open} closeModal={closeModal}>
        <PlayersModal players={assignedPlayers} closeModal={closeModal} />
      </Modal>
    </SectionContainer>
  );
}
