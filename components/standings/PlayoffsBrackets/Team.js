import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Team({
  tricode = "TBD",
  teamName = "TBD",
  wins = "-",
}) {
  const isTBD = tricode === "TBD";
  const isLoser = !isTBD && wins !== "-" && wins < 2;

  return (
    <Link href={`${tricode === "TBD" ? "#" : `/teams/${teamName}`}`}>
      <a
        className={`team tbd flex flex-row text-white pointer-events-none border-b border-b-[#252c32] items-center bg-black box-content h-14 relative select-none ${
          isLoser
            ? "before:bg-[#252c32]"
            : isTBD
            ? "before:bg-[#8fa3b0]"
            : "before:bg-[#c79e57]"
        } before:block before:flex-shrink-0 before:h-full before:w-1`}
      >
        <div
          className={`logo ${
            !isTBD && isLoser ? "opacity-20" : "opacity-100"
          } flex-shrink-0 h-auto mx-5 w-9`}
        >
          <Image
            src={`${
              tricode === "TBD"
                ? "/team-tbd.png"
                : `/teams/${tricode.toLowerCase()}.png`
            }`}
            width="36"
            height="36"
            className="logo"
            alt=""
          />
        </div>
        <div className="name hidden sm:block">{teamName}</div>
        <div
          className={`tricode w-full font-light sm:hidden ${
            isLoser ? "text-[#8fa3b0]" : "text-white"
          }`}
        >
          {tricode}
        </div>
        <div
          className={`score text-white ${
            isLoser ? "text-[#8fa3b0]" : isTBD ? "text-white" : "text-[#c79e57]"
          } font-medium mx-5 my-7 relative`}
        >
          {wins}
        </div>
      </a>
    </Link>
  );
}
