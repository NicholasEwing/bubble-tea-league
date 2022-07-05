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
      className={`flex ${justifyClass} ${props.bgClass} text-white text-lg items-center h-16 border-b border-b-[#252c32]`}
    >
      {props.children}
    </section>
  );
}
