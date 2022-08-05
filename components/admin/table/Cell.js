import React from "react";
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

  return (
    <td
      className={classNames(
        "whitespace-nowrap py-4 px-3 text-sm font-medium not-second:text-gray-300 relative h-[71px]",
        selectedItems && item && selectedItems.includes(item)
          ? "first:text-teal-accent"
          : "first:text-gray-900"
      )}
    >
      {editing && canEdit ? (
        <ScalingTextInput
          handleChanges={handleChanges}
          inputName={inputName}
          id={id}
          value={valueAsString}
          pattern={pattern}
        />
      ) : (
        trimString(valueAsString, 20) || "-"
      )}
    </td>
  );
}
