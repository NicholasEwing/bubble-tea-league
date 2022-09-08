import React from "react";

export default function EventDate({ date }) {
  const weekDay = date.toLocaleString("en-us", { weekday: "long" });
  const month = date.toLocaleString("en-us", { month: "long" });
  const day = date.toLocaleString("en-us", { day: "numeric" });
  const year = date.toLocaleString("en-us", { year: "numeric" });

  return (
    <div className="EventDate inline-block w-full flex-none">
      <div className="date mx-4 pt-5 pb-3 text-lg">
        <span className="weekday font-medium">{weekDay}</span>
        <span className="dash px-1 font-light">–</span>
        <span className="monthday font-light">
          {month} {day}, {year}
        </span>
      </div>
    </div>
  );
}
