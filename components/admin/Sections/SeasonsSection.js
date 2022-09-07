import React, { useState } from "react";
import Modal from "../../modal";
import EditableTable from "../EditableTable";
import SeasonsModal from "../AdminModals/SeasonsModal";
import AddButton from "../table/AddButton";
import SectionContainer from "../table/SectionContainer";
import TextHeadingContainer from "../TextHeadingContainer";

export default function SeasonsSection({ items }) {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const seasonColumns = [
    {
      valueKey: "id",
      name: "Number",
      canEdit: false,
      small: true,
    },
    {
      valueKey: "year",
      name: "Year",
      canEdit: true,
      pattern: "^[0-9]{1,4}",
      small: true,
    },
  ];

  return (
    <SectionContainer>
      <TextHeadingContainer>
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold text-white">Seasons</h1>
          <AddButton buttonText="Add season" buttonAction={openModal} />
        </div>
        <p className="mt-2 text-sm text-gray-400">
          A list of all Bubble Tea League seasons registered including their
          season number, and assigned year.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Creating a season will automatically generate 10 (randomized) teams,
          45 Group Stage matches, and 14 Playoffs matches.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Teams will automatically be assigned for the Group Stage. Playoffs
          bracket will automatically be seeded once Group Stage matches have
          finished.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          After you&apos;ve made a season, be sure to rename teams, create
          players / assign them to teams, and assign times to all matches.
        </p>
      </TextHeadingContainer>
      <EditableTable
        items={items}
        columns={seasonColumns}
        tableName="seasons"
      />
      <Modal open={open} closeModal={closeModal}>
        <SeasonsModal seasons={items} closeModal={closeModal} />
      </Modal>
    </SectionContainer>
  );
}
