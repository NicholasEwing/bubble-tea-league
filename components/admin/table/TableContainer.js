import React from "react";

export default function TableContainer({ children }) {
  return (
    <div className="mt-8 flex flex-col text-white">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="relative overflow-hidden shadow ring-1 ring-gray-500 ring-opacity-30 md:rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
