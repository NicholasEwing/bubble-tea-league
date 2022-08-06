import React, { useState } from "react";
import EditableTable from "../EditableTable";
import SectionContainer from "../table/SectionContainer";
import TextHeadingContainer from "../TextHeadingContainer";

export default function TeamsSection({ items }) {
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
      pattern: "^[a-zA-Z0-9,._ ]{1,255}$",
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
        <h1 className="text-xl font-semibold text-white">Teams</h1>
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
