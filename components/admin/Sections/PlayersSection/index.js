import React, { useEffect, useState } from "react";
import { findTeamName, isEqual } from "../../../../lib/utils";
import Modal from "../../../modal";
import PlayersModal from "../../AdminModals/PlayersModal";
import EditableTable from "../../EditableTable";
import AddButton from "../../table/AddButton";
import SectionContainer from "../../table/SectionContainer";
import TextHeadingContainer from "../../TextHeadingContainer";
import SeasonSelector from "./SeasonSelector";

export default function PlayersSection({
  items,
  teams,
  players,
  seasons,
  playerTeamHistories,
}) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const [activeSeason, setActiveSeason] = useState(seasons[0]?.id || 1);
  const [seasonTeams, setSeasonTeams] = useState(
    teams.filter((t) => t.seasonId === activeSeason)
  );

  const handleActiveSeason = (number) => setActiveSeason(number);

  useEffect(() => {
    const seasonTeams = teams.filter((t) => t.seasonId === activeSeason);
    setSeasonTeams(seasonTeams);
  }, [activeSeason, teams]);

  const teamOptions = teams.map((t) => {
    return { id: t.id, value: t.teamName };
  });

  const playerTeamFormatter = (playerId, foreignEditState) => {
    const seasonTeamIds = seasonTeams.map((st) => st.id);
    const playersCurrentSeason = playerTeamHistories?.find(
      (pth) => pth.playerId === playerId && seasonTeamIds.includes(pth.teamId)
    );

    const editStateRow = foreignEditState?.find(
      (stateItem) => stateItem.playerId === playerId
    );

    // if item is edited and has no db info
    if (editStateRow && !playersCurrentSeason) {
      // show edited info
      if (editStateRow.teamId) {
        return findTeamName(editStateRow.teamId, seasonTeams);
      } else {
        // if no edited role, show "-"
        return "-";
      }
    }

    // if item hasn't been edited and has a db record
    if (!editStateRow && playersCurrentSeason) {
      // show db info...
      if (playersCurrentSeason.teamId) {
        return findTeamName(playersCurrentSeason.teamId, seasonTeams);
      } else {
        // if no db info, on record, show "-"
        return "-";
      }
    }

    // if item is edited and has db info
    if (editStateRow && playersCurrentSeason) {
      const teamHasNotChanged =
        playersCurrentSeason.teamId === editStateRow.teamId;

      if (teamHasNotChanged) {
        // show db info
        return findTeamName(playersCurrentSeason.teamId, seasonTeams);
      } else {
        // show edited info
        return findTeamName(editStateRow.teamId, seasonTeams);
      }
    }
  };

  const playerRoleFormatter = (playerId, foreignEditState) => {
    const seasonTeamIds = seasonTeams.map((st) => st.id);
    const playersCurrentSeason = playerTeamHistories?.find(
      (pth) => pth.playerId === playerId && seasonTeamIds.includes(pth.teamId)
    );

    const editStateRow = foreignEditState?.find(
      (stateItem) => stateItem.playerId === playerId
    );

    // if item is edited and has no db info
    if (editStateRow && !playersCurrentSeason) {
      // show edited info
      if (editStateRow.role) {
        return editStateRow.role;
      } else {
        // if no edited role, show "-"
        return "-";
      }
    }

    // if item hasn't been edited and has a db record
    if (!editStateRow && playersCurrentSeason) {
      // show db info...
      if (playersCurrentSeason.role) {
        return playersCurrentSeason.role;
      } else {
        // if no db info, on record, show "-"
        return "-";
      }
    }

    // if item is edited and has db info
    if (editStateRow && playersCurrentSeason) {
      const roleHasNotChanged = playersCurrentSeason.role === editStateRow.role;

      if (roleHasNotChanged) {
        // show db info
        return playersCurrentSeason.role;
      } else {
        // show edited info
        return editStateRow.role;
      }
    }
  };

  const playersColumns = [
    {
      valueKey: "id",
      name: "id",
      small: true,
    },
    {
      valueKey: "summonerName",
      name: "Summoner Name",
      pattern: "^[a-zA-Z0-9,._ ]{1,255}$",
    },
    {
      valueKey: "discordName",
      name: "Discord",
      canEdit: true,
      pattern: "^.{0,32}#[0-9]{0,4}$",
    },
    {
      valueKey: "email",
      name: "Email",
      canEdit: true,
      pattern: "^.{0,32}[@]{0,32}$",
    },
  ];

  if (playerTeamHistories && playerTeamHistories.length > 0) {
    // TODO WHEN LIVE:
    // make new season (literally can't test this until it goes live due to dev key restrictions, thanks riot Dx)
    // make sure changing seasons works AND dropdown still works
    // what if someone changes seasons while editing? break out of edit mode?? idk
    playersColumns.push(
      {
        valueKey: "id",
        name: "Player Role",
        canEdit: true,
        inputType: "select",
        needsForeignEditState: true,
        updateForeignValue: {
          foreignKeyAsId: "playerId",
          foreignKeyToChange: "role",
          foreignApiName: "player-team-history",
          foreignRecordName: "playerTeamHistories",
        },
        customFormatter: ({ id, foreignEditState }) =>
          playerRoleFormatter(id, foreignEditState),
        options: [
          { value: "Top" },
          { value: "Jungle" },
          { value: "Middle" },
          { value: "Bottom" },
          { value: "Support" },
          { value: "Fill" },
        ],
      },
      {
        valueKey: "id",
        name: "Team",
        canEdit: true,
        needsForeignEditState: true,
        updateForeignValue: {
          foreignKeyAsId: "playerId",
          foreignKeyToChange: "teamId",
          foreignApiName: "player-team-history",
          foreignRecordName: "playerTeamHistories",
        },
        customFormatter: ({ id, foreignEditState }) =>
          playerTeamFormatter(id, foreignEditState),
        inputType: "select",
        options: teamOptions,
      }
    );
  }

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
      {items.length > 0 && seasons.length > 0 && (
        <SeasonSelector
          seasons={seasons}
          activeSeason={activeSeason}
          handleActiveSeason={handleActiveSeason}
        />
      )}
      <EditableTable
        items={items}
        foreignItems={playerTeamHistories}
        columns={playersColumns}
        tableName="players"
        bulkEdit
        canDelete
      />
      <Modal open={open} closeModal={closeModal}>
        <PlayersModal players={players} closeModal={closeModal} />
      </Modal>
    </SectionContainer>
  );
}
