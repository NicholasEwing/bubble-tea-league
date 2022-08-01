import React from "react";

export default function Form({ children }) {
  return (
    <form className="m-8 md:p-8 md:min-w-[80%] space-y-6 sm:pt-10 sm:space-y-5 flex flex-col flex-1">
      {children}
    </form>
  );
}
