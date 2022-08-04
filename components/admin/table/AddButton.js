import React from "react";

export default function AddButton({ buttonText, buttonAction }) {
  return (
    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button
        onClick={() => buttonAction()}
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-teal-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2 sm:w-auto"
      >
        {buttonText}
      </button>
    </div>
  );
}
