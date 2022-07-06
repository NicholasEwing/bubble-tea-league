import Image from "next/image";
import React from "react";

export default function RuneList({ runes, isPrimary }) {
  return (
    <div
      className={`flex-1 ${
        isPrimary ? "border-r border-r-[#252c32]" : "hidden xl:block"
      }`}
    >
      <div className="rune-list mx-4 my-6">
        <div className="rune-category flex items-center border-b border-b-[#252c32] pb-3 mb-6">
          {Object.keys(runes).length && (
            <>
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/img/${runes.primaryRuneImage}`}
                alt={`${runes.primaryRuneName} rune image`}
                height="24"
                width="24"
              />
              <p className="block text-md mx-4 font-medium">
                {runes.primaryRuneName}
              </p>
            </>
          )}
        </div>
        {runes.primaryRunes &&
          runes.primaryRunes.map((rune, i) => (
            <div key={rune.id} className="flex items-center mb-6">
              <div
                className={`${
                  i === 0 ? "min-w-[75px] mx-2" : "min-w-[45px] mx-6"
                }`}
              >
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                  alt=""
                  height={`${i === 0 ? "75" : "45"}`}
                  width={`${i === 0 ? "75" : "45"}`}
                />
              </div>
              <div>
                <p className="block text-md font-medium">{rune.name}</p>
                <p className="max-w-[90%] text-sm font-light">
                  {rune.shortDesc.replaceAll(/<(.*?)>/g, " ")}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className="rune-list mx-4 my-6">
        <div className="rune-category flex items-center border-b border-b-[#252c32] pb-3 mb-6">
          {Object.keys(runes).length && (
            <>
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/img/${runes.secondaryRuneImage}`}
                alt={`${runes.secondaryRuneName} rune image`}
                height="24"
                width="24"
              />
              <p className="block text-md mx-4 font-medium">
                {runes.secondaryRuneName}
              </p>
            </>
          )}
        </div>
        {runes.secondaryRunes &&
          runes.secondaryRunes.map((rune, i) => (
            <div key={rune.id} className="flex items-center mb-6">
              <div className="min-w-[45px] mx-6">
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                  alt=""
                  height="45"
                  width="45"
                />
              </div>
              <div>
                <p className="block text-md font-medium">{rune.name}</p>
                <p className="max-w-[90%] text-sm font-light">
                  {rune.shortDesc.replaceAll(/<(.*?)>/g, "")}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
