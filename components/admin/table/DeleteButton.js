import React from "react";

export default function DeleteButton({ handleDeleteItem, selectedItems }) {
  return (
    <div className="absolute top-0 left-12 flex h-12 items-center space-x-3 bg-gray-900 sm:left-16">
      <button
        onClick={() => handleDeleteItem(selectedItems)}
        type="button"
        className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30"
      >
        Delete item
      </button>
    </div>
  );
}
