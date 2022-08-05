import React, { useState } from "react";
import EditableTable from "../EditableTable";
import AddButton from "../table/AddButton";
import SectionContainer from "../table/SectionContainer";
import TextHeadingContainer from "../TextHeadingContainer";

export default function TeamsSection({ items }) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const teamColumns = [
    {
      valueKey: "id",
      name: "id",
      small: true,
    },
    {
      valueKey: "teamName",
      name: "Team Name",
      canEdit: true,
      pattern: "^[a-zA-Z0-9._ \t]{1,255}$",
    },
    {
      valueKey: "tricode",
      name: "Tricode",
      canEdit: true,
      small: true,
      pattern: "^[a-zA-Z]{0,3}$",
    },
    {
      valueKey: "season",
      name: "Season",
      small: true,
    },
  ];

  return (
    <SectionContainer>
      <TextHeadingContainer>
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-white">Teams</h1>
        </div>
        <p className="mt-2 text-sm text-gray-400">
          A list of all the teams in the Bubble Tea League including their team
          name, tricode, and season.
        </p>
      </TextHeadingContainer>
      <EditableTable
        items={items}
        columns={teamColumns}
        tableName="teams"
        bulkEdit
      />
    </SectionContainer>
  );
}
