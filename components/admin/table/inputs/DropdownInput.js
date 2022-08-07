import React, { useEffect, useState } from "react";

export default function DropdownInput({
  handleChanges,
  inputName,
  id,
  value,
  options,
}) {
  const [activeId, setActiveId] = useState();

  useEffect(() => {
    if (inputName === "TeamId") {
      const currentTeam = options.find((option) => option.value === value);
      setActiveId(currentTeam.id);
    }
  }, [inputName, options, value]);

  return (
    <select
      className="text-black"
      name={inputName}
      onChange={(e) => {
        handleChanges(e, inputName);
        setActiveId(e.target.value);
      }}
      data-id={id}
      id={inputName}
      value={activeId || value}
    >
      {options.map((option, i) => {
        return (
          <option
            key={`${inputName}-${value}-option-${i}`}
            value={option.id || option.value}
          >
            {option.value}
          </option>
        );
      })}
    </select>
  );
}
