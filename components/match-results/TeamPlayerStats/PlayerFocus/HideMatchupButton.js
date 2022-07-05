import React from "react";

export default function HideMatchupButton({ mobileFocus, toggleMobileFocus }) {
  return (
    <div
      onClick={() => toggleMobileFocus()}
      role="button"
      className="sm:hidden pointer-events-auto relative w-16 h-full flex items-center justify-center after:block after:absolute after:h-[4.5rem] after:w-[1px] after:right-0 after:top-3 after:bg-[#252c32]"
    >
      <svg
        className="icon w-5 h-5"
        width="10px"
        height="15px"
        viewBox="0 0 10 15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-320.000000, -17.000000)">
            <g transform="translate(325.000000, 24.000000) scale(-1, 1) rotate(-90.000000) translate(-325.000000, -24.000000) translate(313.000000, 12.000000)">
              <mask fill="white">
                <polygon points="6 7 4 9.005 11.495 16.505 19.001 9.005 17 7.005 11.501 12.504"></polygon>
              </mask>
              <polygon
                className="shape"
                fill="#687077"
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
