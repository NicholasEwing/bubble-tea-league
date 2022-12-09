import React, { useEffect, useState } from "react";

export default function DropdownInput({
  handleChanges,
  inputName,
  id,
  value,
  options,
  updateForeignValue,
}) {
  const [activeId, setActiveId] = useState();

  useEffect(() => {
    // this is only used when referencing another value from options
    // i.e. having a team id of "4" but a team name of "team abc"
    const currentItem = options.find((option) => option.value === value);

    if (currentItem) {
      setActiveId(currentItem.id);
    } else {
      setActiveId(options[0].id);
    }
  }, [inputName, options, value]);

  return (
    <select
      className="mr-4 w-auto text-black"
      name={inputName}
      onChange={(e) => {
        handleChanges(e, inputName);
        setActiveId(e.target.value);
      }}
      data-id={id}
      data-foreign-key-as-id={updateForeignValue?.foreignKeyAsId}
      data-foreign-key-to-change={updateForeignValue?.foreignKeyToChange}
      data-foreign-table={updateForeignValue?.foreignTable}
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
