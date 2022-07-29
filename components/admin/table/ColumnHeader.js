import React from "react";

export default function ColumnHeader({ name, small }) {
  return (
    <th
      scope="col"
      className={`${
        small ? "min-w-[6rem]" : "min-w-[12rem]"
      } py-3.5 px-3 text-left text-sm font-semibold text-white`}
    >
      {name}
    </th>
  );
}
