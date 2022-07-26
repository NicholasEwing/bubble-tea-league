import React from "react";

export default function EventDate({
  weekDay = "Monday",
  month = "January",
  date = "1",
}) {
  return (
    <div className="EventDate w-full flex-none inline-block">
      <div className="date mx-4 pt-5 pb-3 text-lg">
        <span className="weekday font-medium">{weekDay}</span>
        <span className="dash px-1 font-light">–</span>
        <span className="monthday font-light">
          {month} {date}
        </span>
      </div>
    </div>
  );
}
