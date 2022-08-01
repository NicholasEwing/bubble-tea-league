import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

export default function SubmitFail({ error, itemName, setOpen }) {
  let description;

  switch (itemName) {
    case "season":
      description =
        "Be sure to set schedule times for each individual game. If something wasn't generated properly then go yell at Nick to fix it.";
      break;
  }

  return (
    <div className="min-w-full text-white flex-1 flex flex-col justify-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <ExclamationCircleIcon
          className="h-6 w-6 text-red-600"
          aria-hidden="true"
        />
      </div>
      <div className="mt-3 text-center sm:mt-5">
        <h2 className="text-lg leading-6 font-medium">
          Failed to create {itemName}.
        </h2>
        <div className="mt-2 m-auto">
          <p className="text-sm text-gray-500">{error}. Go yell at Nick!</p>
        </div>
      </div>
      <button
        onClick={() => setOpen(false)}
        type="button"
        className="self-center mt-6 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-teal-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent"
      >
        Hmph. (¬､¬)
      </button>
    </div>
  );
}
