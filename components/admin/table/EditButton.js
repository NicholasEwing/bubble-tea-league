import React from "react";

export default function EditButton({ item }) {
  return (
    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
      <a href="#" className="text-teal-accent hover:text-cyan-800">
        Edit<span className="sr-only">, {item.id}</span>
      </a>
    </td>
  );
}
