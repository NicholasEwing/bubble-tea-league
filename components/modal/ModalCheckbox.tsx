import { ChangeEventHandler, ReactNode } from "react";

interface ModalCheckboxProps {
  inputName: string;
  label: string;
  children: ReactNode[];
  onChange: ChangeEventHandler;
}

export default function ModalCheckbox({
  inputName,
  label,
  children,
  onChange,
}: ModalCheckboxProps) {
  return (
    <div className="relative flex items-start">
      <div className="flex h-5 items-center">
        <input
          onChange={onChange}
          id={inputName}
          name={inputName}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-teal-accent focus:ring-teal-accent"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={inputName} className="select-none font-medium">
          {label}
          <p className="font-normal">{children}</p>
        </label>
      </div>
    </div>
  );
}
