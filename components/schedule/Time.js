import React from "react";

export default function Time({
  hour = "12",
  minute = "00",
  ampm = "AM",
  approx,
}) {
  return (
    <div className="EventTime w-[calc(((100%-165px)/12)*4+60px)] flex-none inline-block">
      <div className="time text-3xl relative font-medium">
        <span className="hour">{hour}</span>
        <span className="minute relative text-xs -top-[.85rem] pl-1 tracking-widest">
          {minute}
        </span>
        <span className="ampm relative text-xs -top-[.85rem] pl-1 tracking-widest">
          {ampm}
        </span>
        <span className="timezone relative text-[9px] text-[#8fa3b0] -left-12 pl-[6px] tracking-widest italic">
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
