import React from "react";

export default function TextHeadingContainer({ children }) {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">{children}</div>
    </div>
  );
}
