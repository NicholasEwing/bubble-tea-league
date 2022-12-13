import { ReactNode } from "react";

interface ModalCheckboxGroupProps {
  children: ReactNode[];
}

export default function ModalCheckboxGroup({
  children,
}: ModalCheckboxGroupProps) {
  return (
    <div role="group">
      <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4">
        <div>
          <div className="text-base text-slate-200 sm:text-sm">
            Confirm Season Creation
          </div>
        </div>
        <div className="mt-4 sm:col-span-2 sm:mt-0">
          <div className="max-w-lg space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
