import React from "react";

export default function BracketCell({ children, title }) {
  return (
    <div className="cell mt-4 flex flex-col h-full w-full justify-around relative">
      {title && (
        <h1 className="title text-lg font-medium absolute left-0 -top-4 select-none">
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
