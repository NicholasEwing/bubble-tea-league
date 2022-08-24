/* This example requires Tailwind CSS v2.0+ */
import { XCircleIcon } from "@heroicons/react/solid";
import LoadingSpinner from "../../../modal/LoadingSpinner";

export default function ProviderWarning({ applying, sendProviderRequest }) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            No Provider ID Found
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              <code>https://www.bubble-tea-league.com</code> is not yet
              registered with the Riot Games API as a provider. None of the
              other buttons below will work until the BTL site is approved as a
              provider. Please click the button below to register the app as a
              provider. This only needs to be done once.
            </p>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                {applying ? (
                  <span className="flex items-center">
                    <LoadingSpinner />
                    <p className="font-medium text-gray-600">
                      Registering with Riot Games...
                    </p>
                  </span>
                ) : (
                  <button
                    onClick={sendProviderRequest}
                    type="button"
                    className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    Register as a Provider
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
