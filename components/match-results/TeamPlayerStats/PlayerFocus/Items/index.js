import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Items({
  playerItemEvents,
  item0,
  item1,
  item2,
  item3,
  item4,
  item5,
  item6,
}) {
  const [isLoading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const endGameItems = [item0, item1, item2, item3, item4, item5, item6];

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

  return (
    <section className="bg-[#0f1519]">
      <div className="flex relative">
        <div className="player primary flex-1 py-10">
          {/* {playerItemEvents.map((e) => (
            <p key={e.itemId}>item event</p>
          ))} */}
          {isLoading ? (
            <></>
          ) : (
            endGameItems.reverse().map((item) => (
              <div key={item} className="flex pb-4 font-medium">
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
                    <p className="text-[#8fa3b0]">
                      {items.data[item].gold.base} G
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {/* <div className="hidden player secondary flex-1 py-10">
          second player stuff for desktop goes here later
        </div> */}
      </div>
    </section>
  );
}
