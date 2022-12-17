import {
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  GridColumnIcon,
  Item,
} from "@glideapps/glide-data-grid";
import { Team } from "@prisma/client";
import Grid from "../../GlideGrid";
import useAPIError from "../../hooks/useAPIError";
import SectionContainer from "../table/SectionContainer";
import TextHeadingContainer from "../TextHeadingContainer";

interface TeamsSectionProps {
  teams: Team[];
}

export default function TeamsSection({ teams }: TeamsSectionProps) {
  const { addError } = useAPIError();

  // TODO: Enable image uploading to the BTL s3 bucket
  // TODO: Enable webp conversion and resizing for new images going to the s3 bucket

  const columns: GridColumn[] = [
    {
      title: "Team Name",
      id: "teamName",
      icon: GridColumnIcon.HeaderString,
    },
    {
      title: "Tricode",
      id: "tricode",
      icon: GridColumnIcon.HeaderString,
    },
    {
      title: "Logo",
      id: "logo",
      icon: GridColumnIcon.HeaderImage,
    },
    {
      title: "Season",
      id: "seasonId",
      icon: GridColumnIcon.HeaderNumber,
      overlayIcon: GridColumnIcon.ProtectedColumnOverlay,
    },
  ];

  function getTeams([col, row]: Item): GridCell {
    const data = teams[row];

    if (col === 0) {
      return {
        kind: GridCellKind.Text,
        data: data.teamName,
        allowOverlay: false,
        readonly: true,
        displayData: data.teamName,
      };
    } else if (col === 1) {
      return {
        kind: GridCellKind.Text,
        data: data.tricode || "",
        allowOverlay: false,
        readonly: true,
        displayData: data.tricode || "",
      };
    } else if (col === 2) {
      return {
        kind: GridCellKind.Image,
        data: [data.logoImgPath || ""],
        allowOverlay: true,
        allowAdd: false,
        displayData: [data.logoImgPath || ""],
      };
    } else if (col === 3) {
      return {
        kind: GridCellKind.Text,
        data: data.seasonId.toString(),
        allowOverlay: false,
        readonly: true,
        displayData: data.seasonId.toString(),
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
    const data = teams[row];

    switch (col) {
      case 0:
        data["teamName"] = newValue.data;
        break;
      case 1:
        data["tricode"] = newValue.data;
        break;
      case 2:
        data["logoImgPath"] = newValue.data;
        break;
      case 3:
        data["seasonId"] = parseInt(newValue.data);
        break;
      default:
        break;
    }

    try {
      const res = await fetch("/api/players", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ players: [{ ...data }] }),
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
        <h1 className="text-xl font-semibold text-white">Teams</h1>
        <p className="mt-2 text-sm text-gray-400">
          A list of all the teams in the Bubble Tea League including their team
          name, tricode, and season. Logos images be <code>.png</code> files
          under 8MB.
        </p>
      </TextHeadingContainer>
      <Grid
        data={teams}
        columns={columns}
        getData={getTeams}
        onCellEdited={onCellEdited}
      />
    </SectionContainer>
  );
}
