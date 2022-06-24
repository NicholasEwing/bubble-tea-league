import React from "react";
import NavButton from "./NavButton";

export default function MatchNav({ matchRounds, toggleState, toggleTab }) {
  return (
    <>
      <span className="label text-[#8fa3b0] font-semibold pr-8">GAME</span>
      {/* for each round count */}
      {matchRounds.map((round, i) => (
        <NavButton
          key={`${round.id}-nav`}
          toggleState={toggleState}
          toggleTab={toggleTab}
          count={round.id}
        />
      ))}
    </>
  );
}
