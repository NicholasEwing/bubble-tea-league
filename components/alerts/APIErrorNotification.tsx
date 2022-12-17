import { ExclamationCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import ClientOnlyPortal from "../ClientOnlyPortal";
import useAPIError from "../hooks/useAPIError";

export default function APIErrorNotification() {
  const { error, removeError } = useAPIError();

  return (
    <>
      {error.message && (
        <ClientOnlyPortal selector="#modal">
          <div className="fixed right-12 bottom-12 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {error.message
                    ? `Error: ${error.message}`
                    : `Something went wrong! Please try again.`}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    <span className="sr-only">Dismiss</span>
                    <XCircleIcon
                      onClick={removeError}
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
}
