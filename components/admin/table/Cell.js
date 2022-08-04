import React from "react";

export default function Cell({
  selectedItems,
  item,
  value,
  canEdit,
  editing,
  inputName,
  handleChanges,
  id,
  numsOnly,
}) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
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
      {editing ? (
        <input
          data-id={id}
          type="text"
          name={inputName}
          id={inputName}
          value={value}
          onChange={handleChanges}
          pattern={numsOnly && "^[0-9]{1,4}"}
          className="inline w-16 text-black shadow-sm focus:ring-teal-accent focus:border-teal-accent sm:text-sm border-gray-300 rounded-md"
        />
      ) : (
        value
      )}
    </td>
  );
}
