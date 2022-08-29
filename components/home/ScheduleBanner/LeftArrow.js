import React from "react";

export default function LeftArrow({ hide }) {
  return (
    <div
      id="event-list-arrow-left"
      role="button"
      className={`${
        hide ? "hidden" : "flex"
      } arrow short bottom absolute z-20 h-full w-10 cursor-pointer select-none items-center justify-center border-r border-r-[#252c32] bg-[#0f1519] text-center text-teal-accent`}
      aria-label="MORE"
    >
      <svg
        className="icon"
        xmlns="http://www.w3.org/2000/svg"
        width="15px"
        height="22px"
        viewBox="0 0 10 15"
      >
        <g stroke="none" strokeWidth="1" fill="pink" fillRule="evenodd">
          <g transform="translate(-320.000000, -17.000000)">
            <g transform="translate(325.000000, 24.000000) scale(-1, 1) rotate(-90.000000) translate(-325.000000, -24.000000) translate(313.000000, 12.000000)">
              <mask fill="currentColor">
                <polygon points="6 7 4 9.005 11.495 16.505 19.001 9.005 17 7.005 11.501 12.504"></polygon>
              </mask>
              <polygon
                className="shape"
                fill="currentColor"
                fillRule="evenodd"
                points="6 7 4 9.005 11.495 16.505 19.001 9.005 17 7.005 11.501 12.504"
              ></polygon>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
