import React from "react";

export default function CalendarInput({ handleChanges, inputName, id, value }) {
  const date = new Date(value);

  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  const formattedDate = date.toISOString().slice(0, 16);

  return (
    <input
      data-id={id}
      type="datetime-local"
      name={inputName}
      id={inputName}
      value={formattedDate}
      onChange={(e) => {
        handleChanges(e, inputName);
      }}
      className="text-black"
    />
  );
}
