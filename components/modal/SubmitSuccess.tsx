import { CheckIcon } from "@heroicons/react/outline";
import { MouseEventHandler } from "react";

interface SubmitSuccessProps {
  itemName: string;
  closeModal: MouseEventHandler;
}

export default function SubmitSuccess({
  itemName,
  closeModal,
}: SubmitSuccessProps) {
  let description = "";

  switch (itemName) {
    case "season":
      description =
        "Be sure to set schedule times for each individual game. If something wasn't generated properly then go yell at Nick to fix it.";
      break;
    case "player":
      description =
        "Be sure to set a team and role for the player. Keep in mind that teams / roles are season specific, so make sure you've selected the correct season.";
  }

  return (
    <div className="flex min-w-full flex-1 flex-col justify-center text-white">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
      </div>
      <div className="mt-3 text-center sm:mt-5">
        <h2 className="text-lg font-medium leading-6">
          New {itemName} created!
        </h2>
        <div className="m-auto mt-2 w-[75%]">
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={closeModal}
        type="button"
        className="mt-6 self-center rounded-md border border-transparent bg-teal-accent px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2"
      >
        Okay! ヽ(•‿•)ノ
      </button>
    </div>
  );
}
