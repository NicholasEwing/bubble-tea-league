/* This example requires Tailwind CSS v2.0+ */
import { XCircleIcon } from "@heroicons/react/solid";
import { MouseEventHandler } from "react";
import AlertContainer from "./AlertContainer";
import XCloseAlert from "./XCloseAlert";

interface FailedProps {
  closeError: MouseEventHandler;
  errorMsg: string;
}

export default function Failed({ closeError, errorMsg }: FailedProps) {
  return (
    <AlertContainer bgColor="red-50">
      <div className="flex-shrink-0">
        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
      </div>
      <div className="ml-3 flex">
        <h3 className="text-sm font-medium text-red-800">{errorMsg}</h3>
        <XCloseAlert success={false} dismissHandler={closeError} />
      </div>
    </AlertContainer>
  );
}
