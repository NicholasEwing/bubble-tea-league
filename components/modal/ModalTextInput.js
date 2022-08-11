import React from "react";

export default function ModalTextInput({
  inputName,
  label,
  handleOnChange,
  required,
  children,
  blurHandler,
}) {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-slate-600 sm:pt-5">
      <label
        htmlFor={inputName}
        className="block text-sm font-medium sm:mt-px sm:pt-2"
      >
        {label}
        {required && (
          <span className="text-xs text-gray-600 italic m-4">required</span>
        )}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <input
          onChange={handleOnChange}
          onBlur={blurHandler}
          type="text"
          name={inputName}
          id={inputName}
          className="max-w-lg block text-black w-full shadow-sm focus:ring-teal-accent focus:border-teal-accent sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
        />
        {children}
      </div>
    </div>
  );
}
