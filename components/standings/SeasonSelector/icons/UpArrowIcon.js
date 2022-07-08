import React from "react";

export default function UpArrowIcon() {
  return (
    <svg
      className="icon absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 ml-2"
      xmlns="https://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      viewBox="0 0 16 16"
    >
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        transform="rotate(180 8, 8)"
      >
        <mask fill="white">
          <polygon points="11.5 5 7.499 9 3.5 5.001 2 6.499 7.499 12 12.999 6.499"></polygon>
        </mask>
        <polygon
          className="shape fill-[#8fa3b0]"
          points="11.5 5 7.499 9 3.5 5.001 2 6.499 7.499 12 12.999 6.499"
        ></polygon>
      </g>
    </svg>
  );
}
