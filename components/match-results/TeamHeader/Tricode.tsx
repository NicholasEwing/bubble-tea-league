import { TeamSide } from "../../../types";

interface TricodeProps {
  tricode: string;
  teamSide: TeamSide;
}

export default function Tricode({ tricode, teamSide }: TricodeProps) {
  return (
    <span
      className={`tricode ${
        teamSide === "blue" ? "text-left" : "text-right"
      } px-2 font-semibold`}
    >
      {tricode}
    </span>
  );
}
