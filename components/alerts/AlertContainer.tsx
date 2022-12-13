interface AlertContainerProps {
  children: JSX.Element[];
  bgColor: string;
}

export default function AlertContainer({
  children,
  bgColor = "white",
}: AlertContainerProps) {
  return (
    <div className={`rounded-md bg-${bgColor} p-2`}>
      <div className="flex">{children}</div>
    </div>
  );
}
