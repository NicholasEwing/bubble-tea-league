/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon } from "@heroicons/react/solid";
import { MouseEventHandler } from "react";
import AlertContainer from "./AlertContainer";
import XCloseAlert from "./XCloseAlert";

interface SuccessProps {
  closeSuccess: MouseEventHandler;
  successMsg: string;
}

export default function Success({ closeSuccess, successMsg }: SuccessProps) {
  return (
    <AlertContainer bgColor="green-50">
      <div className="flex-shrink-0">
        <CheckCircleIcon
          className="h-5 w-5 text-green-400"
          aria-hidden="true"
        />
      </div>
      <div className="ml-3 flex">
        <h3 className="text-sm font-medium text-green-800">
          {successMsg ? successMsg : "Changes applied!"}
        </h3>
        <XCloseAlert success dismissHandler={closeSuccess} />
      </div>
    </AlertContainer>
  );
}
