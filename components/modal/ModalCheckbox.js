import React from "react";

export default function ModalCheckbox({
  inputName,
  label,
  children,
  onChange,
}) {
  return (
    <div className="relative flex items-start">
      <div className="flex items-center h-5">
        <input
          onChange={onChange}
          id={inputName}
          name={inputName}
          type="checkbox"
          className="focus:ring-teal-accent h-4 w-4 text-teal-accent border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={inputName} className="font-medium">
          {label}
          <p className="font-normal">{children}</p>
        </label>
      </div>
    </div>
  );
}
