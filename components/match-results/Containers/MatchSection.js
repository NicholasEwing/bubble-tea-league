import React from "react";

MatchSection.defaultProps = {
  bgClass: "bg-black",
};

export default function MatchSection(props) {
  let justifyClass = "justify-center";
  if (props.left) {
    justifyClass = "justify-left";
  }

  return (
    <section
      className={`flex w-screen ${justifyClass} ${props.bgClass} text-white text-lg items-center h-16 border-b-gray-300 border-b-1`}
    >
      {props.children}
    </section>
  );
}
