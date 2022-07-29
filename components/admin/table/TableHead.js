import React from "react";

export default function TableHead({ checkbox, checked, toggleAll, children }) {
  return (
    <thead className="bg-gray-900">
      <tr>
        <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
          <input
            type="checkbox"
            className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-teal-accent focus:ring-teal-accent sm:left-6"
            ref={checkbox}
            checked={checked}
            onChange={toggleAll}
          />
        </th>
        {children}
        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
          <span className="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
  );
}
