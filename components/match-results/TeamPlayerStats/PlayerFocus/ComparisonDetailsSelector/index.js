import React, { useState } from "react";
import AbilitiesIcon from "./icons/AbilitiesIcon";
import ItemsIcon from "./icons/ItemsIcon";
import RunesIcon from "./icons/RunesIcon";
import StatsIcon from "./icons/StatsIcon";
import TabContainer from "./TabContainer";

export default function ComparisonDetailsSelector({ activeTab, selectTab }) {
  const icons = [
    { key: "stats", Component: StatsIcon },
    { key: "items", Component: ItemsIcon },
    { key: "abilities", Component: AbilitiesIcon },
    { key: "runes", Component: RunesIcon },
  ];

  return (
    <div className="menu flex h-full flex-row items-center justify-start pl-6 xl:justify-center">
      {icons.map((Icon) => (
        <TabContainer
          key={Icon.key}
          tabName={Icon.key}
          selectTab={selectTab}
          active={activeTab === Icon.key}
        >
          <Icon.Component />
        </TabContainer>
      ))}
    </div>
  );
}
