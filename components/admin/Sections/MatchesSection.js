import React, { useState } from "react";
import EditableTable from "../EditableTable";
import AddButton from "../table/AddButton";
import SectionContainer from "../table/SectionContainer";
import TextHeadingContainer from "../TextHeadingContainer";

export default function MatchesSection({ items, teams }) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const findTeamName = (value) => {
    if (parseInt(value)) {
      const { teamName } = teams.find((team) => team.id === value);
      return teamName;
    }
  };

  const matchesColumns = [
    {
      valueKey: "id",
      name: "id",
      small: true,
    },
    {
      valueKey: "isPlayoffsMatch",
      name: "Match Stage",
      customInfo: ["isUpperBracket", "bracketRound"],
      customFormatter: (value, customInfo) => {
        const isUpperBracket = customInfo[0];
        const bracketRound = customInfo[1];

        const upperBracketText = isUpperBracket ? "- Upper" : "- Lower";
        let bracketRoundText = bracketRound;

        if (isUpperBracket) {
          if (bracketRound === 3) bracketRoundText = "Semifinals";
          if (bracketRound === 4) bracketRoundText = "Finals";
        } else {
          if (bracketRound === 4) bracketRoundText = "Semifinals";
          if (bracketRound === 5) bracketRoundText = "Finals";
        }

        return value
          ? `Playoffs ${upperBracketText} - ${bracketRoundText}`
          : "Group Stage";
      },
    },
    {
      valueKey: "scheduledTime",
      name: "Scheduled Time",
      canEdit: true,
      customFormatter: (value) => {
        const date = new Date(value);
        return date.toLocaleDateString("en-US", {
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          timeZoneName: "short",
        });
      },
      inputType: "datetime-local",
    },
    {
      valueKey: "season",
      name: "Season",
      small: true,
    },
    {
      valueKey: "teamOne",
      name: "Team One",
      customFormatter: (value) => findTeamName(value),
    },
    {
      valueKey: "teamTwo",
      name: "Team Two",
      customFormatter: (value) => findTeamName(value),
    },
    {
      valueKey: "matchWinnerTeamId",
      name: "Winner",
      customFormatter: (value) => findTeamName(value),
    },
  ];

  return (
    <SectionContainer>
      <TextHeadingContainer>
        <h1 className="text-xl font-semibold text-white">Matches</h1>
        <p className="mt-2 text-sm text-gray-400">
          A list of all the matches in the Bubble Tea League including their
          format, time, teams, and season.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Matches are only generated when creating a new season and can&apos;t
          be deleted.
        </p>
      </TextHeadingContainer>
      <EditableTable
        items={items}
        columns={matchesColumns}
        tableName="matches"
      />
    </SectionContainer>
  );
}
