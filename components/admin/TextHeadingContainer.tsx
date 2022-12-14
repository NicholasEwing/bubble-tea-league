import { ReactNode } from "react";

interface TextHeadingContainerProps {
  children: ReactNode[];
}

export default function TextHeadingContainer({
  children,
}: TextHeadingContainerProps) {
  return (
    <div className="sm:flex sm:items-center">
      <div className="sm:flex-auto">{children}</div>
    </div>
  );
}
