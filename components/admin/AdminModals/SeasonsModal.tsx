import {
  ChangeEvent,
  FormEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import Form from "../../modal/Form";
import ModalCheckbox from "../../modal/ModalCheckbox";
import ModalCheckboxGroup from "../../modal/ModalCheckboxGroup";
import ModalDropdown from "../../modal/ModalDropdown";
import SubmitSuccess from "../../modal/SubmitSuccess";
import ConfirmButton from "../../modal/ConfirmButton";
import SubmitFail from "../../modal/SubmitFail";
import LoadingSpinner from "../../modal/LoadingSpinner";
import { useRefreshContext } from "../context/refreshData";
import { Season } from "@prisma/client";

interface SeasonsModalProps {
  closeModal: MouseEventHandler;
  seasons: Season[];
}

export default function SeasonsModal({
  closeModal,
  seasons,
}: SeasonsModalProps) {
  const seasonYears = seasons.map((s) => s.year);

  const refreshData = useRefreshContext();

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

  const currentYear = new Date().getFullYear();
  const [canSubmit, setCanSubmit] = useState(false);
  const [checkedState, setCheckedState] = useState(
    new Array(checkBoxes.length).fill(false)
  );
  const [seasonYear, setSeasonYear] = useState(currentYear + 1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Something went wrong.");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => setFormSubmitted(false);
  }, []);

  const handleOnChange = (position: number) => {
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

  for (let i = currentYear; i <= currentYear + 4; i++) {
    if (!seasonYears.includes(i)) options.push(i);
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res = await fetch("/api/seasons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `BTL Season ${seasonYear}`,
          year: seasonYear,
        }),
      });

      const resJson = await res.json();

      if (res.ok) {
        setFormSubmitted(true);
        refreshData();
      }

      if (!res.ok && resJson.message) {
        throw resJson.message;
      }
    } catch (error: any) {
      setFormSubmitted(false);
      setErrorMessage(error);
      setFormError(true);
    }

    setLoading(false);
  };

  const handleSeasonYear = (e: ChangeEvent) => {
    const seasonYear = parseInt((e.target as HTMLInputElement).value);
    setSeasonYear(seasonYear);
  };

  if (formSubmitted) {
    return <SubmitSuccess itemName="season" closeModal={closeModal} />;
  } else if (loading) {
    return <LoadingSpinner />;
  } else if (formError) {
    return (
      <SubmitFail
        error={errorMessage}
        itemName="season"
        closeModal={closeModal}
      />
    );
  } else {
    return (
      <Form>
        <div>
          <h3 className="text-lg font-medium leading-6 text-white">
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
            handleInput={handleSeasonYear}
            inputValue={seasonYear}
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
          <ConfirmButton
            closeModal={closeModal}
            handleSubmit={handleSubmit}
            canSubmit={canSubmit}
            dtopText="I understand, create a new season"
            mobileText="Create season"
          />
        </div>
      </Form>
    );
  }
}
