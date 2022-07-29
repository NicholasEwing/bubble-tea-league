import React from "react";

export default function TableBody({ children }) {
  return (
    <tbody className="divide-y divide-gray-700 bg-gray-800">{children}</tbody>
  );
}
