import React from "react";
import AddButton from "./AddButton";

export default function TextHeadingContainer({
  children,
  hasAddButton,
  buttonText,
  setOpen,
}) {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">{children}</div>
      {hasAddButton && <AddButton buttonText={buttonText} setOpen={setOpen} />}
    </div>
  );
}
