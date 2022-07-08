import React from "react";
import CalendarIcon from "./icons/CalendarIcon";
import DownArrowIcon from "./icons/DownArrowIcon";
import UpArrowIcon from "./icons/UpArrowIcon";

export default function SeasonSelector({ openDropdown, handleDropdown }) {
  return (
    <div
      className="league-selector h-14 relative list-none text-[#8fa3b0] flex cursor-pointer"
      role="button"
      onClick={() => handleDropdown()}
    >
      <a className="info flex flex-row items-center">
        <div className="league flex h-full items-center mx-5">
          <CalendarIcon />
          <p className="text-white uppercase mx-5">BTL Seasons</p>
          {openDropdown ? <UpArrowIcon /> : <DownArrowIcon />}
        </div>
      </a>
    </div>
  );
}
