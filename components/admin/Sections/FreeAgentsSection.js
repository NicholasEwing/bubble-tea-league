import React, { useEffect, useState } from "react";
import Modal from "../../modal";
import PlayersModal from "../AdminModals/PlayersModal";
import EditableTable from "../EditableTable";
import AddButton from "../table/AddButton";
import SectionContainer from "../table/SectionContainer";
import TextHeadingContainer from "../TextHeadingContainer";

export default function FreeAgentsSection({ items }) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const playersColumns = [
    {
      valueKey: "id",
      name: "id",
      small: true,
    },
    {
      valueKey: "summonerName",
      name: "Summoner Name",
      pattern: "^[a-zA-Z0-9,._ ]{1,255}$",
    },
    {
      valueKey: "discordName",
      name: "Discord",
      canEdit: true,
      pattern: "^.{0,32}#[0-9]{0,4}$",
    },
  ];

  return (
    <SectionContainer>
      <TextHeadingContainer>
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-white">Free Agents</h1>
          <AddButton buttonText="Add free agent" buttonAction={openModal} />
        </div>
        <p className="mt-2 text-sm text-gray-400">
          A list of all the free agents in the Bubble Tea League. Free agents
          are team-agnostic, so they don&apos;t have a team or role associated with
          them.
        </p>
      </TextHeadingContainer>
      <EditableTable
        items={items}
        columns={playersColumns}
        tableName="players"
        bulkEdit
        canDelete
      />
      <Modal open={open} closeModal={closeModal}>
        <PlayersModal players={items} closeModal={closeModal} />
      </Modal>
    </SectionContainer>
  );
}
