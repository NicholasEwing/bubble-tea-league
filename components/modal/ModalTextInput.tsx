import { ChangeEventHandler, ReactNode } from "react";

interface ModalTextInputProps {
  inputName: string;
  label: string;
  handleOnChange?: ChangeEventHandler;
  required?: boolean;
  children?: ReactNode[] | ReactNode;
  blurHandler?: ChangeEventHandler;
}

export default function ModalTextInput({
  inputName,
  label,
  handleOnChange,
  required,
  children,
  blurHandler,
}: ModalTextInputProps) {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-slate-600 sm:pt-5">
      <label
        htmlFor={inputName}
        className="block text-sm font-medium sm:mt-px sm:pt-2"
      >
        {label}
        {required && (
          <span className="m-4 text-xs italic text-gray-600">required</span>
        )}
      </label>
      <div className="mt-1 sm:col-span-2 sm:mt-0">
        <input
          onChange={handleOnChange}
          onBlur={blurHandler}
          type="text"
          name={inputName}
          id={inputName}
          className="block w-full max-w-lg rounded-md border-gray-300 text-black shadow-sm focus:border-teal-accent focus:ring-teal-accent sm:max-w-xs sm:text-sm"
        />
        {children}
      </div>
    </div>
  );
}
