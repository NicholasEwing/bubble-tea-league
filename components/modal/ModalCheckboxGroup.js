import React from "react";

export default function ModalCheckboxGroup({ inputName, label, children }) {
  return (
    <div role="group" aria-labelledby={inputName}>
      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline">
        <div>
          <div className="text-base text-slate-200 sm:text-sm" id={inputName}>
            Confirm Season Creation
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:col-span-2">
          <div className="max-w-lg space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
