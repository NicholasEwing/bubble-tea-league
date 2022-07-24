import React from "react";

export default function BottomIcon({ width = 48, height = 48 }) {
  return (
    <svg
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 400 400"
    >
      <g>
        <path
          fillRule="evenodd"
          fill="#555d64"
          d="M152.942,152.941v82.353h82.352V152.941H152.942ZM47.064,47.067v270.4L93.6,270.436l0.52-176.318,176.31-.019,47.041-47.032H47.064Z"
        ></path>
        <path
          fillRule="evenodd"
          fill="#c79e57"
          d="M70.054,352.905l59.357-58.787H294.118V129.412L352.9,70.055l0.039,282.886Z"
        ></path>
      </g>
    </svg>
  );
}
