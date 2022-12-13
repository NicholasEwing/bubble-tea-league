import { BestOf } from "../../types";

interface SeasonMatchInfoProps {
  seasonNumber: string;
  format: BestOf;
}

export default function SeasonMatchInfo({
  seasonNumber = "1",
  format = "Bo1",
}: SeasonMatchInfoProps) {
  const flavorText = format === "Bo1" ? "Groups - " : "Playoffs - ";

  return (
    <div className="league h-12 shrink-0 grow-0 basis-28 text-right font-medium tracking-widest text-[#8fa3b0]">
      <div className="name text-xs uppercase">Season {seasonNumber}</div>
      <div className="strategy text-xs uppercase">
        <span className="hidden md:inline">{flavorText}</span>
        {format}
      </div>
    </div>
  );
}
