import React from "react";

export default function ConfirmButton({
  setOpen,
  handleSubmit,
  canSubmit = true,
  dtopText,
  mobileText,
}) {
  return (
    <div className="pt-5">
      <div className="flex justify-between md:justify-end">
        <button
          onClick={() => setOpen(false)}
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          type="submit"
          disabled={!canSubmit}
          className={`${
            !canSubmit && "opacity-50"
          } inline-flex ml-3 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-accent hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent`}
        >
          <span className="md:hidden">{mobileText}</span>
          <span className="hidden md:inline">{dtopText}</span>
        </button>
      </div>
    </div>
  );
}
