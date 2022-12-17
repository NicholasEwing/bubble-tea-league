import {
  GridCell,
  GridCellKind,
  GridColumn,
  GridColumnIcon,
  Item,
} from "@glideapps/glide-data-grid";
import { Match, MatchRound, Team } from "@prisma/client";
import { findTeamName } from "../../../../lib/utils";
import Grid from "../../../GlideGrid";
import useAPIError from "../../../hooks/useAPIError";
import SectionContainer from "../../table/SectionContainer";
import TextHeadingContainer from "../../TextHeadingContainer";

interface MatchesSectionProps {
  matches: Match[];
  teams: Team[];
  matchRounds: MatchRound[];
}

export default function MatchesSection({
  matches,
  teams,
  matchRounds,
}: MatchesSectionProps) {
  const { addError } = useAPIError();

  const columns: GridColumn[] = [
    {
      title: "Tournament Code",
      id: "id",
      icon: GridColumnIcon.HeaderRowID,
      overlayIcon: GridColumnIcon.ProtectedColumnOverlay,
    },
    {
      title: "Video Link",
      id: "vodLink",
      icon: GridColumnIcon.HeaderUri,
    },
    {
      title: "Match Stage",
      id: "isPlayoffsMatch",
      icon: GridColumnIcon.HeaderIfThenElse,
      overlayIcon: GridColumnIcon.ProtectedColumnOverlay,
    },
    {
      title: "Scheduled Time",
      id: "scheduledTime",
      icon: GridColumnIcon.HeaderDate,
    },
    {
      title: "Season",
      id: "seasonId",
      icon: GridColumnIcon.HeaderNumber,
      overlayIcon: GridColumnIcon.ProtectedColumnOverlay,
    },
    {
      title: "Team One",
      id: "teamOneId",
      icon: GridColumnIcon.RowOwnerOverlay,
      overlayIcon: GridColumnIcon.ProtectedColumnOverlay,
    },
    {
      title: "Team Two",
      id: "teamTwoId",
      icon: GridColumnIcon.RowOwnerOverlay,
      overlayIcon: GridColumnIcon.ProtectedColumnOverlay,
    },
    {
      title: "Winner",
      id: "matchWinnerTeamId",
      icon: GridColumnIcon.HeaderEmoji,
      overlayIcon: GridColumnIcon.ProtectedColumnOverlay,
    },
  ];

  function getMatches([col, row]: Item): GridCell {
    if (!matches) {
      return {
        kind: GridCellKind.Text,
        data: "",
        allowOverlay: true,
        readonly: true,
        displayData: "",
      };
    }
    const data = matches[row];

    if (col === 0) {
      const tournamentCode = matchRounds
        .filter((mr) => mr.matchId === data.id)
        .map((i) => i.tournamentCode)
        .join(" ");

      return {
        kind: GridCellKind.Text,
        data: tournamentCode,
        allowOverlay: true,
        readonly: true,
        displayData: tournamentCode,
      };
    } else if (col === 1) {
      return {
        kind: GridCellKind.Text,
        data: data.vodLink || "",
        allowOverlay: false,
        readonly: true,
        displayData: data.vodLink || "",
      };
    } else if (col === 2) {
      return {
        kind: GridCellKind.Boolean,
        data: data.isPlayoffsMatch,
        allowOverlay: false,
        readonly: true,
      };
    } else if (col === 3) {
      let formattedDate = "";
      if (data.scheduledTime) {
        const date = new Date(data?.scheduledTime);
        formattedDate = date.toLocaleDateString("en-US", {
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          timeZoneName: "short",
        });
      }

      return {
        kind: GridCellKind.Text,
        data: data.scheduledTime?.toString() || "",
        allowOverlay: false,
        readonly: true,
        displayData: formattedDate,
      };
    } else if (col === 4) {
      return {
        kind: GridCellKind.Number,
        data: data.seasonId,
        allowOverlay: false,
        readonly: true,
        displayData: data.seasonId.toString(),
      };
    } else if (col === 5) {
      const teamOneName = findTeamName(data.teamOneId, teams);

      return {
        kind: GridCellKind.Number,
        data: data.teamOneId || undefined,
        displayData: teamOneName,
        allowOverlay: false,
        readonly: true,
      };
    } else if (col === 6) {
      const teamTwoName = findTeamName(data.teamTwoId, teams);

      return {
        kind: GridCellKind.Number,
        data: data.teamOneId || undefined,
        displayData: teamTwoName,
        allowOverlay: false,
        readonly: true,
      };
    } else if (col === 7) {
      const winningTeamName = findTeamName(data.matchWinnerTeamId, teams);

      return {
        kind: GridCellKind.Number,
        data: data.matchWinnerTeamId || undefined,
        displayData: winningTeamName,
        allowOverlay: false,
        readonly: true,
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
      <Grid data={teams} columns={columns} getData={getMatches} />
    </SectionContainer>
  );
}
