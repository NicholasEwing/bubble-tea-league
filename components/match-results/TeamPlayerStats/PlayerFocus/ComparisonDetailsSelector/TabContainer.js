import React from "react";

export default function TabContainer({ children, tabName, selectTab, active }) {
  return (
    <div
      onClick={() => selectTab(tabName)}
      className={`${
        active
          ? "text-[#00c8c8] pointer-events-none after:absolute after:block after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-[#00c8c8]"
          : "text-[#555D64]"
      } flex items-center relative h-full px-4`}
    >
      {children}
    </div>
  );
}
