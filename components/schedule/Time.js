import React from "react";

export default function Time({
  hour = "12",
  minute = "00",
  ampm = "AM",
  approx,
}) {
  return (
    <div className="EventTime w-[calc(((100%-165px)/12)*4+60px)] lg:w-40 flex-none inline-block">
      <div className="time text-3xl lg:text-5xl relative font-medium">
        <span className="hour">{hour}</span>
        <span className="minute relative text-xs lg:text-base -top-[.85rem] lg:-top-6 pl-1 tracking-widest">
          {minute}
        </span>
        <span className="ampm relative text-xs lg:text-base -top-[.85rem] lg:-top-6 pl-1 tracking-widest">
          {ampm}
        </span>
        <span className="timezone relative text-[9px] lg:text-base text-[#8fa3b0] -left-12 lg:-left-[3.75rem] lg:-top-1 pl-[6px] tracking-widest italic">
          EST
        </span>
        {approx && (
          <span className="relative block text-xs pl-1 tracking-widest mt-0 text-[#8fa3b0]">
            APPROX
          </span>
        )}
      </div>
    </div>
  );
}
