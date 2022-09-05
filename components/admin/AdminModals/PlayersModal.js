import React, { useEffect, useState } from "react";
import Form from "../../modal/Form";
import FormContainer from "../../modal/Form";
import ModalCheckbox from "../../modal/ModalCheckbox";
import ModalCheckboxGroup from "../../modal/ModalCheckboxGroup";
import ModalDropdown from "../../modal/ModalDropdown";
import ModalTextInput from "../../modal/ModalTextInput";
import SubmitSuccess from "../../modal/SubmitSuccess";
import ConfirmButton from "../../modal/ConfirmButton";
import SubmitFail from "../../modal/SubmitFail";
import LoadingSpinner from "../../modal/LoadingSpinner";
import { useRefreshContext } from "../context/refreshData";

export default function PlayersModal({ players, closeModal }) {
  const refreshData = useRefreshContext();

  const [playerValues, setPlayerValues] = useState({
    PUUID: "",
    summonerName: "",
    discordName: "",
    firstName: "",
  });

  const [canSubmit, setCanSubmit] = useState(false);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Something went wrong.");
  const [loading, setLoading] = useState(false);

  const [discordNameState, setDiscordNameState] = useState("");
  const [discordNameValid, setDiscordNameValid] = useState();

  const [summonerNameState, setSummonerNameState] = useState("");
  const [summonerNameValid, setSummonerNameValid] = useState();
  const [summonerNameWarning, setSummonerNameWarning] = useState(
    "❌ Summoner name not found!"
  );
  const [riotApiLoading, setRiotApiLoading] = useState(false);

  useEffect(() => {
    return () => setFormSubmitted(false);
  }, []);

  // TODO: make this work on prod
  const checkPlayerPUUID = async (summonerName) => {
    // do some stuff to check puuid from server here
    const res = await fetch(`http://localhost:3000/api/check-puuid/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ summonerName }),
    });

    const { PUUID } = await res.json();
    return PUUID;
  };

  const summonerNameBlurHandler = async (e) => {
    const summonerName = e.target.value;
    setSummonerNameState(summonerName);

    const summonerNameAlreadyExists =
      players.filter(
        (p) =>
          p.summonerName.toUpperCase().trim() ===
          e.target.value.toUpperCase().trim()
      ).length > 0;

    const isValid = /^.{3,16}$/gim.test(summonerName);

    if (summonerNameAlreadyExists) {
      setSummonerNameValid(false);
      setSummonerNameWarning("❌ Summoner name already exists!");
      setCanSubmit(false);
    } else if (!isValid) {
      setSummonerNameValid(false);
      setSummonerNameWarning("❌ Summoner name not valid!");
      setCanSubmit(false);
    } else if (isValid) {
      setRiotApiLoading(true);
      const PUUID = await checkPlayerPUUID(summonerName);
      const puuidAlreadyExists =
        players.filter((p) => p.PUUID === PUUID).length > 0;

      if (puuidAlreadyExists) {
        setSummonerNameValid(false);
        setSummonerNameWarning(
          "❌ Player already exists under a different summoner name!"
        );
        setCanSubmit(false);
      } else if (PUUID?.length > 0) {
        setRiotApiLoading(false);
        setSummonerNameValid(true);
        setPlayerValues({ ...playerValues, summonerName, PUUID });
        setCanSubmit(true);
      } else {
        setRiotApiLoading(false);
        setSummonerNameValid(false);
        setSummonerNameWarning(
          "❌ Summoner name not found from Riot Games API!"
        );
        setCanSubmit(false);
      }
    } else {
      setSummonerNameValid(false);
      setCanSubmit(false);
      setSummonerNameWarning("❌ Something went wrong! Please try again.");
    }
  };

  const discordNameBlurHandler = (e) => {
    const discordName = e.target.value;
    setDiscordNameState(discordName);
    const isValid = /^.{3,32}#[0-9]{4}$/gim.test(e.target.value);

    if (isValid) {
      setDiscordNameValid(true);
      setPlayerValues({ ...playerValues, discordName: e.target.value });
    } else {
      setDiscordNameValid(false);
    }
  };

  const handleFirstNameChange = (e) =>
    setPlayerValues({ ...playerValues, firstName: e.target.value });

  const handleSubmit = async (e) => {
    event.preventDefault();
    setLoading(true);

    try {
      let res = await fetch("http://localhost:3000/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...playerValues }),
      });

      const resJson = await res.json();

      if (res.ok) {
        setFormSubmitted(true);
        refreshData();
      }

      if (!res.ok && resJson.message) {
        throw resJson.message;
      }
    } catch (error) {
      setFormSubmitted(false);
      setErrorMessage(error);
      setFormError(true);
    }

    setLoading(false);
  };

  if (formSubmitted) {
    return <SubmitSuccess itemName="player" closeModal={closeModal} />;
  } else if (loading) {
    return <LoadingSpinner />;
  } else if (formError) {
    return (
      <SubmitFail
        error={errorMessage}
        itemName="player"
        closeModal={closeModal}
      />
    );
  } else {
    return (
      <Form>
        <div>
          <h3 className="text-lg font-medium leading-6 text-white">
            Create a New Player
          </h3>
          <p className="mt-1 max-w-2xl text-sm">
            Add a new player to the Bubble Tea League.
          </p>
        </div>
        <div className="space-y-6 sm:space-y-5">
          <ModalTextInput
            label="Summoner Name"
            inputName="summonerName"
            required
            blurHandler={summonerNameBlurHandler}
          >
            {summonerNameState.length > 0 && riotApiLoading && (
              <span className="mt-4 flex">
                <LoadingSpinner />
                <p className="text-sm text-gray-300">
                  Checking Riot Games API...
                </p>
              </span>
            )}
            {summonerNameState.length > 0 &&
              !riotApiLoading &&
              (summonerNameValid ? (
                <p className="mt-4 text-sm text-green-300">
                  ✓ Summoner name found from Riot Games API!
                </p>
              ) : (
                <p className="mt-4 text-sm text-red-300">
                  {summonerNameWarning}
                </p>
              ))}
          </ModalTextInput>
          <ModalTextInput
            label="Discord Handle"
            inputName="discordName"
            blurHandler={discordNameBlurHandler}
          >
            {discordNameState.length > 0 &&
              (discordNameValid ? (
                <p className="mt-4 text-sm text-green-300">
                  ✓ Discord name is valid!
                </p>
              ) : (
                <p className="mt-4 text-sm text-red-300">
                  ❌ Discord name invalid!
                </p>
              ))}
          </ModalTextInput>
          <ModalTextInput
            label="First Name"
            inputName="firstName"
            handleOnChange={handleFirstNameChange}
          />
          <ConfirmButton
            closeModal={closeModal}
            handleSubmit={handleSubmit}
            canSubmit={canSubmit}
            dtopText="Create a new player"
            mobileText="Create player"
          />
        </div>
      </Form>
    );
  }
}
