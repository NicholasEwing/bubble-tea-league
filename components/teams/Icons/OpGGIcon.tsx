import { Player } from "@prisma/client";
import Image from "next/image";

interface OpGGButtonProps {
  players: Player[];
}

export default function OpGGButton({ players }: OpGGButtonProps) {
  const cleanSummonerNames = players.map((p) =>
    encodeURIComponent(p.summonerName.trim())
  );

  const summonersString = `${cleanSummonerNames[0]},${cleanSummonerNames[1]},${cleanSummonerNames[2]},${cleanSummonerNames[3]},${cleanSummonerNames[4]}`;

  return (
    <>
      <a
        href={`https://na.op.gg/multisearch/na?summoners=${summonersString}`}
        className="self-end"
        target="_blank"
        rel="noreferrer"
      >
        <button
          type="button"
          className=" inline-flex h-10 items-center rounded-md border border-transparent bg-[#5383E8] px-1 text-sm font-medium leading-4 text-white shadow-sm hover:bg-[#5383E8] focus:outline-none focus:ring-2 focus:ring-[#5383E8] focus:ring-offset-2 md:px-3"
        >
          <span className="mx-2 inline-flex">
            <Image
              src="/opgglogo.svg"
              alt="OP.GG Logo"
              width="40"
              height="40"
              layout="fixed"
            />
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="h-3 w-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </a>
    </>
  );
}
