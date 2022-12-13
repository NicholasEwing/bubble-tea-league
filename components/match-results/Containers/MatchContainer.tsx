interface MatchContainerProps {
  children: JSX.Element[];
}

export default function MatchContainer({ children }: MatchContainerProps) {
  return (
    <div
      className={`sm:w-[calc(((100% - 442px) / 12) * 4 + 136px)] flex flex-col justify-center border-r border-r-[#252c32] sm:h-full sm:min-w-[400px] sm:max-w-[480px]`}
    >
      {children}
    </div>
  );
}
