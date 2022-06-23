import React from "react";

export default function KillIcon({ fillColor, children }) {
  return (
    <>
      <svg
        className="icon"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        xmlns="https://www.w3.org/2000/svg"
      >
        <path
          className={`shape ${fillColor}`}
          fill="#555d64"
          d="M16,3 L9.001,12 L9.001,13.5 L6,10.5 L5,14 L6.501,15.5 L3,19 L3,21 L5,21 L8.5,17.5 L10.001,19 L13.501,18 L10.5,15 L12,15 L21,8 L21,3 L16,3 Z M10.5,12.75 L17.001,6 L18.001,6 L18.001,7 L11.251,13.5 L10.5,13.5 L10.5,12.75 Z"
        ></path>
      </svg>
      {children}
    </>
  );
}
