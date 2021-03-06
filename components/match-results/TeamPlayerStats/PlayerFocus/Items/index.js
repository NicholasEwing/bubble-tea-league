import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Items({
  player,
  playerItemEvents,
  comparedPlayer,
  comparedPlayerItemEvents,
  focusedPlayer,
  focusedPlayerItemEvents,
}) {
  const [isLoading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const playerEndGameItems = [
    player.item0,
    player.item1,
    player.item2,
    player.item3,
    player.item4,
    player.item5,
    player.item6,
  ];
  const comparedPlayerEndGameItems = [
    comparedPlayer.item0,
    comparedPlayer.item1,
    comparedPlayer.item2,
    comparedPlayer.item3,
    comparedPlayer.item4,
    comparedPlayer.item5,
    comparedPlayer.item6,
  ];
  const focusedPlayerEndGameItems = [
    focusedPlayer.item0,
    focusedPlayer.item1,
    focusedPlayer.item2,
    focusedPlayer.item3,
    focusedPlayer.item4,
    focusedPlayer.item5,
    focusedPlayer.item6,
  ];

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch(
        "http://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/item.json"
      );

      const items = await res.json();

      setItems(items);
      setLoading(false);
    }
    fetchItems();
  }, []);

  const ItemsList = ({ itemList, isPrimary }) =>
    itemList.reverse().map((item, i) => {
      if (item === 0) {
        return <React.Fragment key={`${item}-${i}`}></React.Fragment>;
      } else {
        return (
          <div
            key={`${item}-${i}-${isPrimary}`}
            className={`flex pb-4 font-medium ${
              isPrimary ? "xl:flex-row-reverse xl:text-right" : ""
            }`}
          >
            <span className="mx-5">
              <Image
                src={`http://ddragon.leagueoflegends.com/cdn/12.12.1/img/item/${item}.png`}
                alt={`${items.data[item].name} item image`}
                height="64"
                width="64"
              />
            </span>
            <div>
              <p className="text-white">{items.data[item].name}</p>
              {items.data[item].tags.includes("Trinket") ? (
                <p className="text-[#8fa3b0]">Trinket</p>
              ) : (
                <p className="text-[#8fa3b0]">{items.data[item].gold.base} G</p>
              )}
            </div>
          </div>
        );
      }
    });

  return (
    <section className="bg-[#0f1519]">
      <div className="hidden xl:flex relative">
        <div className="player primary flex-1 py-10 xl:border-r xl:border-[#252c32]">
          {isLoading && !items.length ? (
            <></>
          ) : (
            <ItemsList itemList={playerEndGameItems} isPrimary />
          )}
        </div>
        <div className="player secondary hidden xl:block flex-1 py-10">
          {isLoading && !items.length ? (
            <></>
          ) : (
            <ItemsList itemList={comparedPlayerEndGameItems} />
          )}
        </div>
      </div>
      <div className="flex xl:hidden relative ">
        <div className="player primary flex-1 py-10">
          {isLoading && !items.length ? (
            <></>
          ) : (
            <ItemsList itemList={focusedPlayerEndGameItems} isPrimary />
          )}
        </div>
      </div>
    </section>
  );
}
