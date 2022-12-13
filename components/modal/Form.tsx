import { ReactNode } from "react";

interface FormProps {
  children: ReactNode[];
}

export default function Form({ children }: FormProps) {
  return (
    <form className="m-8 flex flex-1 flex-col space-y-6 sm:space-y-5 sm:pt-10 md:min-w-[80%] md:p-8">
      {children}
    </form>
  );
}
