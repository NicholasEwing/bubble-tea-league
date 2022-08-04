import React from "react";
import LoadingSpinner from "../../modal/LoadingSpinner";

export default function ApplyButton({ applyChanges, canApply, applying }) {
  return (
    <button
      onClick={applyChanges}
      type="button"
      disabled={!canApply}
      className={`${
        canApply ? "opacity-100" : "opacity-30"
      } transition-all duration-300 flex items-center rounded-md border border-transparent bg-teal-accent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2 sm:w-auto`}
    >
      {applying && (
        <LoadingSpinner wheelColor="text-white" wheelAccent="fill-gray-400" />
      )}
      Apply
    </button>
  );
}
