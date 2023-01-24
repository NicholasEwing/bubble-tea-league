import { ComparisonTab } from "../../../../../types";
import AbilitiesIcon from "./icons/AbilitiesIcon";
import ItemsIcon from "./icons/ItemsIcon";
import RunesIcon from "./icons/RunesIcon";
import StatsIcon from "./icons/StatsIcon";
import TabContainer from "./TabContainer";

interface ComparisonDetailsSelectorProps {
  activeTab: ComparisonTab;
  selectTab: (tab: ComparisonTab) => void;
}

export default function ComparisonDetailsSelector({
  activeTab,
  selectTab,
}: ComparisonDetailsSelectorProps) {
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
          tabName={Icon.key as ComparisonTab}
          selectTab={selectTab}
          active={activeTab === Icon.key}
        >
          <Icon.Component />
        </TabContainer>
      ))}
    </div>
  );
}
