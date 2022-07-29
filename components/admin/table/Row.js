import React from "react";

export default function Row({
  selectedItems,
  item,
  setSelectedItems,
  children,
}) {
  return (
    <tr className={selectedItems.includes(item) ? "bg-gray-700" : undefined}>
      <td className="relative w-6 px-6 sm:w-8 sm:px-8">
        {selectedItems.includes(item) && (
          <div className="absolute inset-y-0 left-0 w-0.5 bg-teal-accent" />
        )}
        <input
          type="checkbox"
          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-teal-accent hover:ring-teal-accent sm:left-6"
          value={item.id}
          checked={selectedItems.includes(item)}
          onChange={(e) =>
            setSelectedItems(
              e.target.checked
                ? [...selectedItems, item]
                : selectedItems.filter((i) => i !== item)
            )
          }
        />
      </td>
      {children}
    </tr>
  );
}
