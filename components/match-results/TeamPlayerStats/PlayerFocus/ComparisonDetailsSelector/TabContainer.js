import React from "react";

export default function TabContainer({ children, tabName, selectTab, active }) {
  return (
    <div
      onClick={() => selectTab(tabName)}
      className={`${
        active
          ? "pointer-events-none text-teal-accent after:absolute after:bottom-0 after:left-0 after:block after:h-1 after:w-full after:bg-teal-accent"
          : "cursor-pointer text-[#555D64]"
      } relative flex h-full items-center px-4`}
    >
      {children}
    </div>
  );
}
