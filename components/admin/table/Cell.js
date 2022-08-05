import React, { useEffect } from "react";
import ScalingTextInput from "./ScalingTextInput";

export default function Cell({
  selectedItems,
  item,
  value,
  canEdit = false,
  editing,
  inputName,
  handleChanges,
  id,
  pattern,
  inputType = "text",
}) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function trimString(string, length) {
    if (string.length > length) {
      return string.substring(0, length) + "...";
    } else {
      return string;
    }
  }

  const valueAsString = value?.toString() ? value.toString() : "";

  let inputComponent = <p>no input decided on yet</p>;

  if (inputType === "text") {
    inputComponent = (
      <ScalingTextInput
        handleChanges={handleChanges}
        inputName={inputName}
        id={id}
        value={valueAsString}
        pattern={pattern}
      />
    );
  } else {
    inputComponent = (
      <input
        data-id={id}
        type={inputType}
        name={inputName}
        id={inputName}
        value={value}
        onChange={(e) => {
          handleChanges(e, inputName);
        }}
      ></input>
    );
  }

  return (
    <td
      className={classNames(
        "whitespace-nowrap py-4 px-3 text-sm font-medium not-second:text-gray-300 relative h-[71px]",
        selectedItems && item && selectedItems.includes(item)
          ? "first:text-teal-accent"
          : "first:text-gray-900"
      )}
    >
      {editing && canEdit
        ? inputComponent
        : trimString(valueAsString, 30) || "-"}
    </td>
  );
}
