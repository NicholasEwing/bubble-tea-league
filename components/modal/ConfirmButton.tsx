import { MouseEventHandler } from "react";

interface ConfirmButtonProps {
  closeModal: MouseEventHandler<HTMLButtonElement>;
  handleSubmit: any;
  canSubmit: boolean;
  dtopText: string;
  mobileText: string;
}

export default function ConfirmButton({
  closeModal,
  handleSubmit,
  canSubmit = true,
  dtopText,
  mobileText,
}: ConfirmButtonProps) {
  return (
    <div className="pt-5">
      <div className="flex justify-between md:justify-end">
        <button
          onClick={closeModal}
          type="button"
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          type="submit"
          disabled={!canSubmit}
          className={`${
            !canSubmit && "opacity-50"
          } ml-3 inline-flex justify-center rounded-md border border-transparent bg-teal-accent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-teal-accent focus:ring-offset-2`}
        >
          <span className="md:hidden">{mobileText}</span>
          <span className="hidden md:inline">{dtopText}</span>
        </button>
      </div>
    </div>
  );
}
