import React from "react";

export default function PlayerAttributes({
  attackDamage,
  abilityPower,
  attackSpeed,
  lifesteal,
  armor,
  magicResist,
  isPrimary,
}) {
  const attributeIcons = {
    attackDamage: {
      x: "before:[background-position-x:-4px]",
      y: "before:[background-position-y:-28px]",
    },
    abilityPower: {
      x: "before:[background-position-x:-28px]",
      y: "before:[background-position-y:-28px]",
    },
    attackSpeed: {
      x: "before:[background-position-x:-4px]",
      y: "before:[background-position-y:-100px]",
    },
    lifesteal: {
      x: "before:[background-position-x:-4px]",
      y: "before:[background-position-y:-148px]",
    },
    armor: {
      x: "before:[background-position-x:-4px]",
      y: "before:[background-position-y:-52px]",
    },
    magicResist: {
      x: "before:[background-position-x:-28px]",
      y: "before:[background-position-y:-52px]",
    },
  };
  return (
    <div
      className={`player flex flex-col flex-1 py-8 ${
        isPrimary
          ? "xl:border-r-[#252c32] xl:border-r xl:pr-6"
          : "hidden py-8 xl:flex-1 xl:block xl:pl-6"
      }`}
    >
      <div
        className={`${
          isPrimary
            ? "ml-8 pl-9 before:left-0 xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:w-auto xl:before:border-none"
            : "mr-8 pr-9 before:-left-[2.15rem]"
        } flex items-center pt-3 pb-3 h-9 relative before:absolute ${
          attributeIcons.attackDamage.x
        } ${
          attributeIcons.attackDamage.y
        } before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes`}
      >
        <div className="value flex-1 text-white font-medium text-2xl p-0">
          {attackDamage}
        </div>
        <div className="title text-[#8fa3b0] font-light flex-[3]">
          Attack Damage
        </div>
      </div>
      <div
        className={`${
          isPrimary
            ? "ml-8 pl-9 before:left-0 xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:w-auto xl:before:border-none"
            : "mr-8 pr-9 before:-left-[2.15rem]"
        } flex items-center pt-3 pb-3 h-9 relative before:absolute ${
          attributeIcons.abilityPower.x
        } ${
          attributeIcons.abilityPower.y
        } before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes`}
      >
        <div className="value flex-1 text-white font-medium text-2xl p-0">
          {abilityPower}
        </div>
        <div className="title text-[#8fa3b0] font-light flex-[3]">
          Ability Power
        </div>
      </div>
      <div
        className={`${
          isPrimary
            ? "ml-8 pl-9 before:left-0 xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:w-auto xl:before:border-none"
            : "mr-8 pr-9 before:-left-[2.15rem]"
        } flex items-center pt-3 pb-3 h-9 relative before:absolute ${
          attributeIcons.attackSpeed.x
        } ${
          attributeIcons.attackSpeed.y
        } before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes`}
      >
        <div className="value flex-1 text-white font-medium text-2xl p-0">
          {attackSpeed}
        </div>
        <div className="title text-[#8fa3b0] font-light flex-[3]">
          Attack Speed
        </div>
      </div>
      <div
        className={`${
          isPrimary
            ? "ml-8 pl-9 before:left-0 xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:w-auto xl:before:border-none"
            : "mr-8 pr-9 before:-left-[2.15rem]"
        } flex items-center pt-3 pb-3 h-9 relative before:absolute ${
          attributeIcons.lifesteal.x
        } ${
          attributeIcons.lifesteal.y
        } before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes`}
      >
        <div className="value flex-1 text-white font-medium text-2xl p-0">
          {lifesteal}
        </div>
        <div className="title text-[#8fa3b0] font-light flex-[3]">
          Life Steal
        </div>
      </div>
      <div
        className={`${
          isPrimary
            ? "ml-8 pl-9 before:left-0 xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:w-auto xl:before:border-none"
            : "mr-8 pr-9 before:-left-[2.15rem]"
        } flex items-center pt-3 pb-3 h-9 relative before:absolute ${
          attributeIcons.armor.x
        } ${
          attributeIcons.armor.y
        } before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes`}
      >
        <div className="value flex-1 text-white font-medium text-2xl p-0">
          {armor}
        </div>
        <div className="title text-[#8fa3b0] font-light flex-[3]">Armor</div>
      </div>
      <div
        className={`${
          isPrimary
            ? "ml-8 pl-9 before:left-0 xl:text-right xl:flex-row-reverse xl:before:static xl:before:bg-none xl:before:h-auto xl:before:w-auto xl:before:border-none"
            : "mr-8 pr-9 before:-left-[2.15rem]"
        } flex items-center pt-3 pb-3 h-9 relative before:absolute ${
          attributeIcons.magicResist.x
        } ${
          attributeIcons.magicResist.y
        } before:top-[9px] before:w-[20px] before:h-[20px] before:border-[2px] before:border-[#252c32] before:bg-black before:bg-[length:48px_auto] before:bg-champion-attributes`}
      >
        <div className="value flex-1 text-white font-medium text-2xl p-0">
          {magicResist}
        </div>
        <div className="title text-[#8fa3b0] font-light flex-[3]">
          Magic Resistance
        </div>
      </div>
    </div>
  );
}
