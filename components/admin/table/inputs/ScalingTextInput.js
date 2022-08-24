import React, { useState } from "react";

export default function ScalingTextInput({
  handleChanges,
  inputName,
  id,
  value,
  pattern,
}) {
  const [width, setWidth] = useState(value?.length);

  const changeHandlerWidth = (e) => {
    const charWidth = e.target.value.length;
    const widthToSet = charWidth >= 30 ? 30 : charWidth;
    setWidth(widthToSet);
  };

  return (
    <input
      style={{ width: width + 3 + "ch" }}
      data-id={id}
      type="text"
      name={inputName}
      id={inputName}
      value={value}
      onChange={(e) => {
        handleChanges(e, inputName);
        changeHandlerWidth(e);
      }}
      pattern={pattern}
      className="min-w-16 max-w-64 inline rounded-md border-gray-300 text-black shadow-sm focus:border-teal-accent focus:ring-teal-accent sm:text-sm"
    />
  );
}
