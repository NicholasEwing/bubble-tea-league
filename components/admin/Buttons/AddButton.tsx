import { MouseEventHandler } from "react";

interface AddButtonProps {
  buttonText: string;
  buttonAction: () => void;
  disabled?: boolean;
}

export default function AddButton({
  buttonText,
  buttonAction,
  disabled = false,
}: AddButtonProps) {
  return (
    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button
        onClick={() => buttonAction()}
        type="button"
        disabled={disabled}
        className={`${
          disabled && "opacity-50"
        } inline-flex rounded-md border border-transparent bg-teal-accent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2 sm:w-auto`}
      >
        {buttonText}
      </button>
    </div>
  );
}
