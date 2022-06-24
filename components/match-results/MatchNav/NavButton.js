import React from "react";

export default function NavButton({ count, toggleState, toggleTab }) {
  return (
    <a
      href="#"
      className={`px-8 font-semibold ${
        toggleState === count
          ? "active-game pointer-events-none text-[#00c8c8]"
          : "text-[#687077]"
      }`}
      onClick={() => toggleTab(count)}
    >
      {count}
    </a>
  );
}
