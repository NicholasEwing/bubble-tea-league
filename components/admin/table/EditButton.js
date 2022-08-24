import React, { useEffect, useState } from "react";

export default function EditButton({
  id,
  editing,
  handleEditRows,
  saveChanges,
  cancelChanges,
  checkIfRowCanSave,
}) {
  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    if (editing) {
      const canSave = checkIfRowCanSave(id);
      setCanSave(canSave);
    }
  }, [editing, checkIfRowCanSave, id]);

  return (
    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
      {editing ? (
        <>
          <a
            onClick={canSave ? () => saveChanges(id) : undefined}
            className={`${
              canSave
                ? "opacity-100 hover:text-cyan-800"
                : "cursor-default opacity-30"
            } cursor-pointer select-none text-teal-accent`}
          >
            Save<span className="sr-only">, {id}</span>
          </a>
          <a
            onClick={() => cancelChanges(id)}
            className="absolute right-9 mr-4 cursor-pointer select-none text-gray-400 hover:text-red-800 md:right-14"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-[2px] h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="sr-only">, {id}</span>
          </a>
        </>
      ) : (
        <a
          onClick={() => handleEditRows(id)}
          className="cursor-pointer select-none pl-[6.20px] text-teal-accent hover:text-cyan-800"
        >
          Edit<span className="sr-only">, {id}</span>
        </a>
      )}
    </td>
  );
}
