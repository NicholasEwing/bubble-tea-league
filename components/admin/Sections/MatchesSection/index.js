import React, { useState } from "react";
import { findTeamName } from "../../../../lib/utils";
import EditableTable from "../../EditableTable";
import SectionContainer from "../../table/SectionContainer";
import TextHeadingContainer from "../../TextHeadingContainer";
import CopyIcon from "./CopyIcon";

export default function MatchesSection({ items, teams, matchRounds }) {
  const matchesColumns = [
    {
      valueKey: "id",
      name: "id",
      small: true,
    },
    {
      valueKey: "id",
      name: "Tournament Codes",
      small: true,
      needsForeignEditState: true,
      customFormatter: ({ id, foreignEditState }) => {
        const tournamentCodes = foreignEditState
          .filter((fes) => fes.MatchId === id)
          .map((i) => i.tournamentCode);

        return (
          <button
            onClick={() => {
              navigator.clipboard.writeText(tournamentCodes);
            }}
            className="inline-flex cursor-pointer select-none items-center rounded-full border border-gray-500 px-2.5 py-0.5"
          >
            <CopyIcon />
            Copy
          </button>
        );
      },
    },
    {
      valueKey: "isPlayoffsMatch",
      name: "Match Stage",
      customInfo: ["isUpperBracket", "bracketRound"],
      customFormatter: ({ isPlayoffsMatch, isUpperBracket, bracketRound }) => {
        const upperBracketText = isUpperBracket ? "- Upper" : "- Lower";
        let bracketRoundText = bracketRound;

        if (isUpperBracket) {
          if (bracketRound === 3) bracketRoundText = "Semifinals";
          if (bracketRound === 4) bracketRoundText = "Finals";
        } else {
          if (bracketRound === 4) bracketRoundText = "Semifinals";
          if (bracketRound === 5) bracketRoundText = "Finals";
        }

        return isPlayoffsMatch
          ? `Playoffs ${upperBracketText} - ${bracketRoundText}`
          : "Group Stage";
      },
    },
    {
      valueKey: "scheduledTime",
      name: "Scheduled Time",
      canEdit: true,
      customFormatter: ({ scheduledTime }) => {
        const date = new Date(scheduledTime);
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
      customFormatter: ({ teamOne }) => findTeamName(teamOne, teams),
    },
    {
      valueKey: "teamTwo",
      name: "Team Two",
      customFormatter: ({ teamTwo }) => findTeamName(teamTwo, teams),
    },
    {
      valueKey: "matchWinnerTeamId",
      name: "Winner",
      customFormatter: ({ matchWinnerTeamId }) =>
        findTeamName(matchWinnerTeamId, teams),
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
        foreignItems={matchRounds}
        columns={matchesColumns}
        tableName="matches"
      />
    </SectionContainer>
  );
}
