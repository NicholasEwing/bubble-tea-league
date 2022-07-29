import React from "react";

export default function Table({ children }) {
  return (
    <table className="min-w-full table-fixed divide-y divide-gray-600">
      {children}
    </table>
  );
}
