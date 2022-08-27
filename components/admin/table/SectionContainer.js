import React from "react";

export default function SectionContainer({ children }) {
  return (
    <section className="flex flex-col py-8 px-4 not-first:pt-8 sm:px-6 lg:px-8">
      {children}
    </section>
  );
}
