import React, { useState } from "react";
import { findTeamName } from "../../../lib/utils";
import EditableTable from "../EditableTable";
import AddButton from "../table/AddButton";
import SectionContainer from "../table/SectionContainer";
import TextHeadingContainer from "../TextHeadingContainer";

export default function PlayersSection({ items, teams }) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const teamOptions = teams.map((t) => {
    return { id: t.id, value: t.teamName };
  });

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
    {
      valueKey: "TeamId",
      name: "Team",
      canEdit: true,
      customFormatter: (value) => findTeamName(value, teams),
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

  // todos: can't save when changing role dropdown

  return (
    <SectionContainer>
      <TextHeadingContainer>
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-white">Players</h1>
          <AddButton buttonText="Add player" buttonAction={openModal} />
        </div>
        <p className="mt-2 text-sm text-gray-400">
          A list of all the players in the Bubble Tea League including their
          role and team name.
        </p>
      </TextHeadingContainer>
      <EditableTable
        items={items}
        columns={playersColumns}
        tableName="players"
        bulkEdit
        bulkDelete
      />
    </SectionContainer>
  );
}
