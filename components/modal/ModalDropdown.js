import React from "react";

export default function ModalDropdown({ inputName, label, options }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-slate-600 sm:pt-5">
      <label
        htmlFor={inputName}
        className="block text-sm text-white font-medium sm:mt-px sm:pt-2"
      >
        {label}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <select
          id={inputName}
          name={inputName}
          defaultValue={currentYear + 1}
          className="max-w-lg block text-black focus:ring-teal-accent focus:border-teal-accent w-full shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
