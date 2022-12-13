import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { MouseEventHandler } from "react";

interface SubmitFailProps {
  error: string;
  itemName: string;
  closeModal: MouseEventHandler<HTMLButtonElement>;
}

export default function SubmitFail({
  error,
  itemName,
  closeModal,
}: SubmitFailProps) {
  return (
    <div className="flex min-w-full flex-1 flex-col justify-center text-white">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <ExclamationCircleIcon
          className="h-6 w-6 text-red-600"
          aria-hidden="true"
        />
      </div>
      <div className="mt-3 text-center sm:mt-5">
        <h2 className="text-lg font-medium leading-6">
          Failed to create {itemName}.
        </h2>
        <div className="m-auto mt-2">
          <p className="text-sm text-gray-500">{error}. Go yell at Nick!</p>
        </div>
      </div>
      <button
        onClick={closeModal}
        type="button"
        className="mt-6 self-center rounded-md border border-transparent bg-teal-accent px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2"
      >
        Hmph. (¬､¬)
      </button>
    </div>
  );
}
