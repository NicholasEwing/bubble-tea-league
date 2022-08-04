import React from "react";

export default function EditButton({
  item,
  editing,
  setIsEditing,
  saveChanges,
  cancelChanges,
  canSave,
}) {
  return (
    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 relative">
      {editing ? (
        <>
          <a
            onClick={canSave ? () => saveChanges() : undefined}
            className={`${
              canSave
                ? "opacity-100 hover:text-cyan-800"
                : "opacity-30 cursor-default"
            } text-teal-accent cursor-pointer select-none`}
          >
            Save<span className="sr-only">, {item.id}</span>
          </a>
          <a
            onClick={() => cancelChanges()}
            className="absolute right-9 md:right-14 text-gray-400 hover:text-red-800 cursor-pointer select-none mr-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mt-[2px]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">, {item.id}</span>
          </a>
        </>
      ) : (
        <a
          onClick={() => setIsEditing(true)}
          className="text-teal-accent hover:text-cyan-800 cursor-pointer select-none pl-[6.20px]"
        >
          Edit<span className="sr-only">, {item.id}</span>
        </a>
      )}
    </td>
  );
}
