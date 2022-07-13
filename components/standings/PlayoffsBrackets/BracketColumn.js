import React from "react";

export default function BracketColumn({ children }) {
  return (
    <div className={`column pr-6 justify-around w-[calc(100%/7)]`}>
      {children}
    </div>
  );
}
