import React from "react";

export default function Cell({ children, selectedItems, item }) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <td
      className={classNames(
        "whitespace-nowrap py-4 px-3 text-sm font-medium not-second:text-gray-300",
        selectedItems && item && selectedItems.includes(item)
          ? "first:text-teal-accent"
          : "first:text-gray-900"
      )}
    >
      {children}
    </td>
  );
}
