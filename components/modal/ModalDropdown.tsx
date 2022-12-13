import { ChangeEventHandler } from "react";

interface ModalDropdownProps {
  inputName: string;
  label: string;
  options: string[];
  handleInput: ChangeEventHandler;
  inputValue: string;
}

export default function ModalDropdown({
  inputName,
  label,
  options,
  handleInput,
  inputValue,
}: ModalDropdownProps) {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-600 sm:pt-5">
      <label
        htmlFor={inputName}
        className="block text-sm font-medium text-white sm:mt-px sm:pt-2"
      >
        {label}
      </label>
      <div className="mt-1 sm:col-span-2 sm:mt-0">
        <select
          id={inputName}
          name={inputName}
          defaultValue={inputValue}
          onChange={handleInput}
          className="block w-full max-w-lg rounded-md border-gray-300 text-black shadow-sm focus:border-teal-accent focus:ring-teal-accent sm:max-w-xs sm:text-sm"
        >
          {options.map(
            (option: string): JSX.Element => (
              <option key={option}>{option}</option>
            )
          )}
        </select>
      </div>
    </div>
  );
}
