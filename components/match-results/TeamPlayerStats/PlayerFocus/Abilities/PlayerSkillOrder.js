import React from "react";
import Row from "./Row";

export default function PlayerSkillOrder({
  playerAbilityLevelEvents,
  championName,
  isPrimary,
}) {
  return playerAbilityLevelEvents.map((event, i) => (
    <Row
      key={`${championName}-Row-${i + 1}`}
      rowNumber={i + 1}
      skillSlot={event.skillSlot}
    />
  ));
}
