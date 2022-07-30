import React, { useState } from "react";
import Form from "../../modal/Form";
import FormContainer from "../../modal/Form";
import ModalCheckbox from "../../modal/ModalCheckbox";
import ModalCheckboxGroup from "../../modal/ModalCheckboxGroup";
import ModalDropdown from "../../modal/ModalDropdown";
import ModalTextInput from "../../modal/ModalTextInput";

export default function SeasonsModal({ setOpen }) {
  const currentYear = new Date().getFullYear();
  const [canSubmit, setCanSubmit] = useState(false);

  const checkBoxes = [
    {
      inputName: "matches",
      label: "Matches",
      description:
        "Creating a new season generates 45 Group Stage matches and 16 Playoffs matches.",
    },
    {
      inputName: "teams",
      label: "New Teams",
      description:
        "Creating a new season generates 10 randomized teams. Since a team can only be associated with one season, you'll need to rename these and upload logo images for them - even if they've appeared in a previous season.",
    },
    {
      inputName: "player",
      label: "Players",
      description:
        "Players will NOT be generated when making a new season. Be sure to assign existing or new players to the newly created teams after generating a season.",
    },
  ];

  const [checkedState, setCheckedState] = useState(
    new Array(checkBoxes.length).fill(false)
  );

  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

    const allBoxesChecked =
      updatedCheckedState.filter((s) => s).length === checkBoxes.length;

    if (allBoxesChecked) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  };

  let options = [];

  for (const i = currentYear; i <= currentYear + 4; i++) {
    options.push(i);
  }

  const handleSubmit = (e) => {
    event.preventDefault();

    console.log("form submitted!!!");
  };

  return (
    <Form>
      <div>
        <h3 className="text-lg leading-6 font-medium text-white">
          Create a New Season
        </h3>
        <p className="mt-1 max-w-2xl text-sm">
          Pick the year you want to associate with this season.
        </p>
      </div>
      <div className="space-y-6 sm:space-y-5">
        <ModalDropdown
          inputName="season-year"
          label="Season Year"
          options={options}
        />
        <ModalCheckboxGroup>
          {checkBoxes.map((checkbox, i) => (
            <ModalCheckbox
              key={checkbox.inputName}
              inputName={checkbox.inputName}
              label={checkbox.label}
              onChange={() => handleOnChange(i)}
            >
              {checkbox.description}
            </ModalCheckbox>
          ))}
        </ModalCheckboxGroup>
        <div className="pt-5">
          <div className="flex md:justify-end sm:justify-between">
            <button
              onClick={() => setOpen(false)}
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={!canSubmit}
              className={`${
                !canSubmit && "opacity-50"
              } inline-flex ml-3 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-accent hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent`}
            >
              I understand
              <span className="hidden md:inline">, create a new season</span>
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
}
