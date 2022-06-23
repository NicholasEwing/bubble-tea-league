import React from "react";

export default function BaronIcon({ fillColor, children }) {
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
          d="M17,12.5049 C17,13.3299 16.331,13.9999 15.504,13.9999 L15.496,13.9999 C14.669,13.9999 14,13.3299 14,12.5049 L14,12.4949 C14,11.6699 14.669,10.9999 15.496,10.9999 L15.504,10.9999 C16.331,10.9999 17,11.6699 17,12.4949 L17,12.5049 Z M13,10.0079 C13,10.5559 12.556,10.9999 12.008,10.9999 L11.992,10.9999 C11.444,10.9999 11,10.5559 11,10.0079 L11,9.9919 C11,9.4439 11.444,8.9999 11.992,8.9999 L12.008,8.9999 C12.556,8.9999 13,9.4439 13,9.9919 L13,10.0079 Z M13,15.0099 C13,15.5569 12.557,15.9999 12.01,15.9999 L11.99,15.9999 C11.443,15.9999 11,15.5569 11,15.0099 L11,14.9899 C11,14.4429 11.443,13.9999 11.99,13.9999 L12.01,13.9999 C12.557,13.9999 13,14.4429 13,14.9899 L13,15.0099 Z M10,12.5139 C10,13.3349 9.334,13.9999 8.514,13.9999 L8.486,13.9999 C7.666,13.9999 7,13.3349 7,12.5139 L7,12.4859 C7,11.6659 7.666,10.9999 8.486,10.9999 L8.514,10.9999 C9.334,10.9999 10,11.6659 10,12.4859 L10,12.5139 Z M22,5.9999 L15,1.9999 L15,3.9999 L18,6.9999 L16,8.9999 L12,4.9999 L8,8.9999 L6,6.9999 L9,3.9999 L9,1.9999 L2,5.9999 L6,10.9999 L2,14.9999 L5,18.9999 L5,14.9999 L7,14.9999 L8,19.9999 L10,21.9999 L10,17.9999 L12,19.9999 L14,17.9999 L14,21.9999 L16,19.9999 L17,14.9999 L19,14.9999 L19,18.9999 L22,14.9999 L18,10.9999 L22,5.9999 Z"
        ></path>
      </svg>
      {children}
    </>
  );
}
