import React, { useState } from "react";

export default function ScalingTextInput({
  handleChanges,
  inputName,
  id,
  value,
  pattern,
}) {
  const [width, setWidth] = useState(value.length);

  const changeHandlerWidth = (e) => {
    const charWidth = e.target.value.length;
    const widthToSet = charWidth >= 10 ? 10 : charWidth;
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
      className="inline min-w-16 max-w-64 text-black shadow-sm focus:ring-teal-accent focus:border-teal-accent sm:text-sm border-gray-300 rounded-md"
    />
  );
}
