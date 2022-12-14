import { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode[];
}

export default function SectionContainer({ children }: SectionContainerProps) {
  return (
    <section className="flex flex-col py-8 px-4 not-first:pt-8 sm:px-6 lg:px-8">
      {children}
    </section>
  );
}
