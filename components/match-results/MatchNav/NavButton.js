import React from "react";

export default function NavButton({
  count,
  toggleState,
  toggleTab,
  resetPlayers,
}) {
  return (
    <a
      href="#"
      className={`px-8 font-semibold ${
        toggleState === count
          ? "active-game pointer-events-none text-teal-accent"
          : "text-[#687077]"
      }`}
      onClick={() => {
        toggleTab(count);
        resetPlayers(count);
      }}
    >
      {count}
    </a>
  );
}
