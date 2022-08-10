import React, { useEffect, useState } from "react";
import { findTeamName, isEqual } from "../../../../lib/utils";
import EditableTable from "../../EditableTable";
import AddButton from "../../table/AddButton";
import SectionContainer from "../../table/SectionContainer";
import TextHeadingContainer from "../../TextHeadingContainer";
import SeasonSelector from "./SeasonSelector";

export default function PlayersSection({
  items,
  teams,
  seasons,
  playerTeamHistory,
}) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const [activeSeason, setActiveSeason] = useState(seasons[0].number);
  const [seasonTeams, setSeasonTeams] = useState(
    teams.filter((t) => t.season === activeSeason)
  );

  const handleActiveSeason = (number) => setActiveSeason(number);

  useEffect(() => {
    const seasonTeams = teams.filter((t) => t.season === activeSeason);
    setSeasonTeams(seasonTeams);
  }, [activeSeason, teams]);

  const teamOptions = teams.map((t) => {
    return { id: t.id, value: t.teamName };
  });

  const playerTeamFormatter = (playerId, foreignEditState) => {
    const seasonTeamIds = seasonTeams.map((st) => st.id);
    const playersCurrentTeam = playerTeamHistory.find(
      (pth) => pth.PlayerId === playerId && seasonTeamIds.includes(pth.TeamId)
    );

    const editStateRow = foreignEditState.find(
      (stateItem) => stateItem.PlayerId === playerId
    );

    const teamHasNotChanged = isEqual(playersCurrentTeam, editStateRow);

    if (teamHasNotChanged) {
      return findTeamName(playersCurrentTeam.TeamId, seasonTeams);
    } else {
      return findTeamName(editStateRow.TeamId, seasonTeams);
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
      canEdit: true,
      pattern: "^[a-zA-Z0-9,._ ]{1,255}$",
    },
    {
      valueKey: "role",
      name: "Player Role",
      canEdit: true,
      inputType: "select",
      options: [
        { value: "Top" },
        { value: "Jungle" },
        { value: "Middle" },
        { value: "Bottom" },
        { value: "Support" },
        { value: "Fill" },
      ],
    },
    // todo:
    // make sure drop down works (done)
    // make new season (literally can't test this until it goes live, thanks riot Dx)
    // make sure changing seasons works AND dropdown still works
    // what if someone changes seasons while editing? break out of edit mode?? idk
    {
      valueKey: "id",
      name: "Team",
      canEdit: true,
      needsForeignEditState: true,
      updateForeignValue: {
        foreignKeyAsId: "PlayerId",
        foreignKeyToChange: "TeamId",
        foreignApiName: "player-team-history",
        foreignRecordName: "playerTeamHistory",
      },
      customFormatter: ({ id, foreignEditState }) =>
        playerTeamFormatter(id, foreignEditState),
      inputType: "select",
      options: teamOptions,
    },
    {
      valueKey: "discordName",
      name: "Discord",
      canEdit: true,
      pattern: "^[a-zA-Z0-9,._ ]{1,255}$",
    },
  ];

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
      <SeasonSelector
        seasons={seasons}
        activeSeason={activeSeason}
        handleActiveSeason={handleActiveSeason}
      />
      <EditableTable
        items={items}
        foreignItems={playerTeamHistory}
        columns={playersColumns}
        tableName="players"
        bulkEdit
        bulkDelete
      />
    </SectionContainer>
  );
}
