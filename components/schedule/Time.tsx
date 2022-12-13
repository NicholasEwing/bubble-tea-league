interface TimeProps {
  hour?: string;
  minute?: string;
  ampm?: string;
  approx?: boolean;
}

export default function Time({
  hour = "12",
  minute = "00",
  ampm = "AM",
  approx,
}: TimeProps) {
  return (
    <div className="EventTime inline-block w-[calc(((100%-165px)/12)*4+60px)] flex-none lg:w-40">
      <div className="time relative text-3xl font-medium lg:text-5xl">
        <span className="hour">{hour}</span>
        <span className="minute relative -top-[.85rem] pl-1 text-xs tracking-widest lg:-top-6 lg:text-base">
          {minute}
        </span>
        <span className="ampm relative -top-[.85rem] pl-1 text-xs tracking-widest lg:-top-6 lg:text-base">
          {ampm}
        </span>
        <span className="timezone relative -left-12 pl-[6px] text-[9px] italic tracking-widest text-[#8fa3b0] lg:-left-[3.75rem] lg:-top-1 lg:text-base">
          EST
        </span>
        {approx && (
          <span className="relative mt-0 block pl-1 text-xs tracking-widest text-[#8fa3b0]">
            APPROX
          </span>
        )}
      </div>
    </div>
  );
}
