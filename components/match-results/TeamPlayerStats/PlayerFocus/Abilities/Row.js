import React from "react";

export default function Row({ rowNumber, skillSlot }) {
  return (
    <div className="flex">
      <p className="block w-1/5 text-center py-1 border-t border-t-[#252c32] font-medium text-white">
        {rowNumber}
      </p>
      <p
        className={`key w-1/5 ${
          skillSlot === 1 ? "text-[#00c8c8] bg-black" : "text-transparent"
        } text-center font-medium pt-1 pb-1 border-t border-l border-[#252c32] uppercase`}
      >
        Q
      </p>
      <p
        className={`key w-1/5 ${
          skillSlot === 2 ? "text-[#00c8c8] bg-black" : "text-transparent"
        } text-center font-medium pt-1 pb-1 border-t border-l border-[#252c32] uppercase`}
      >
        W
      </p>
      <p
        className={`key w-1/5 ${
          skillSlot === 3 ? "text-[#00c8c8] bg-black" : "text-transparent"
        } text-center font-medium pt-1 pb-1 border-t border-l border-[#252c32] uppercase`}
      >
        E
      </p>
      <p
        className={`key w-1/5 ${
          skillSlot === 4 ? "text-[#00c8c8] bg-black" : "text-transparent"
        } text-center font-medium pt-1 pb-1 border-t border-l border-[#252c32] uppercase`}
      >
        R
      </p>
    </div>
  );
}
