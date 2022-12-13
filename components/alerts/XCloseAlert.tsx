import { MouseEventHandler } from "react";

interface XCloseAlertProps {
  success: boolean;
  dismissHandler: MouseEventHandler;
}

export default function XCloseAlert({
  success = true,
  dismissHandler,
}: XCloseAlertProps) {
  const successStyles =
    "bg-green-50 text-green-800 hover:bg-green-100 focus:ring-offset-green-50 focus:ring-green-600";

  const errorStyles =
    "bg-red-50 text-red-800 hover:bg-red-100 focus:ring-offset-red-50 focus:ring-red-600";

  return (
    <div className="mx-1 -my-0.5 flex">
      <button
        onClick={dismissHandler}
        type="button"
        className={`ml-3 ${
          success ? successStyles : errorStyles
        } rounded-md px-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-offset-1`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
