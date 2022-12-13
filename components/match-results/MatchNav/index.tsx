import { MatchRound } from "@prisma/client";
import NavButton from "./NavButton";

interface MatchNavProps {
  matchRounds: MatchRound[];
  toggleState: number;
  toggleTab: Function;
  resetPlayers: Function;
}

export default function MatchNav({
  matchRounds,
  toggleState,
  toggleTab,
  resetPlayers,
}: MatchNavProps) {
  return (
    <>
      <span className="label pr-8 font-semibold text-[#8fa3b0]">GAME</span>
      {matchRounds.map((round, i) => (
        <NavButton
          key={`${round.id}-nav`}
          toggleState={toggleState}
          toggleTab={toggleTab}
          count={i + 1}
          resetPlayers={resetPlayers}
        />
      ))}
    </>
  );
}
