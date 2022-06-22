import React from "react";
import ObjectiveIcon from "./ObjectiveIcon";

export default function TeamObjectives({ teamSide }) {
  let fillColor = "fill-[#FFFFFF]";

  if (teamSide === "blue") {
    fillColor = "fill-[#4c7184]";
  } else if (teamSide === "red") {
    fillColor = "fill-[#844c4c]";
  }

  const objectives = {
    inhibitor: 1,
    baron: 2,
  };

  return (
    <div className="blue-team flex-1 flex justify-between pt-4 pb-0 pr-4 pl-4 mt-4 border-r border-r-[#252c32]">
      {/* for each objective, display objective icon and count */}
      {Object.entries(objectives).map(([key, value]) => (
        <ObjectiveIcon key={key} teamSide={teamSide} icon={key} />
      ))}
      {/* <div className="stat inhibitors inline-block text-center text-lg font-medium w-6 h-12">
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
            d="M12,2 C17.522,2 22,6.478 22,12 C22,17.522 17.522,22 12,22 C6.477,22 2,17.522 2,12 C2,6.478 6.477,2 12,2 Z M12,4 C7.639,4 4,7.635 4,12 C4,16.365 7.639,20 12,20 C16.362,20 20,16.365 20,12 C20,7.635 16.362,4 12,4 Z M12,8 L16,12 L12,16 L8,12 L12,8 Z"
          ></path>
        </svg>
        0
      </div> */}
      {/* <div className="stat barons inline-block text-center text-lg font-medium w-6 h-12">
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
        0
      </div> */}
      <div className="stat towers inline-block text-center text-lg font-medium w-6 h-12">
        <svg
          className="icon"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          xmlns="https://www.w3.org/2000/svg"
        >
          <path
            className="shape fill-[#4c7184]"
            fill="#555d64"
            d="M9.0004,1.0004 L9.0004,5.9994 L6.9994,5.0004 L4.0004,6.9994 L4.9994,11.0004 L12.0004,14.9994 L19.0004,11.0004 L20.0004,6.9994 L16.9994,5.0004 L14.9994,5.9994 L14.9994,1.0004 L9.0004,1.0004 Z M11.0004,5.9994 L11.0004,3.0004 L13.0004,3.0004 L13.0004,5.9994 L12.0004,6.9994 L11.0004,5.9994 Z M15.9994,8.9994 L12.0004,12.0004 L7.9994,8.9994 L12.0004,10.0004 L15.9994,8.9994 Z M12.0001,16.9997 L16.0001,14.9997 L15.0001,21.0007 L16.9991,21.0007 L16.9991,22.9997 L7.0001,22.9997 L7.0001,21.0007 L9.0001,21.0007 L7.9991,14.9997 L12.0001,16.9997 Z"
          ></path>
        </svg>
        0
      </div>
      <div className="stat kills inline-block text-center text-lg font-medium w-6 h-12">
        <svg
          className="icon"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          xmlns="https://www.w3.org/2000/svg"
        >
          <path
            className="shape fill-[#4c7184]"
            fill="#555d64"
            d="M16,3 L9.001,12 L9.001,13.5 L6,10.5 L5,14 L6.501,15.5 L3,19 L3,21 L5,21 L8.5,17.5 L10.001,19 L13.501,18 L10.5,15 L12,15 L21,8 L21,3 L16,3 Z M10.5,12.75 L17.001,6 L18.001,6 L18.001,7 L11.251,13.5 L10.5,13.5 L10.5,12.75 Z"
          ></path>
        </svg>
        0
      </div>
    </div>
  );
}
