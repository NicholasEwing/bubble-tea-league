import React from "react";

export default function DropdownInput({
  handleChanges,
  inputName,
  id,
  value,
  options,
}) {
  return (
    <select
      className="text-black"
      name={inputName}
      onChange={(e) => handleChanges(e, inputName)}
      data-id={id}
      id={inputName}
      defaultValue={value}
      value={value}
    >
      {options.map((option, i) => (
        <option key={`${inputName}-${value}-option-${i}`} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
