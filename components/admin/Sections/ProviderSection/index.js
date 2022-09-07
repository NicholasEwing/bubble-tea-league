import React, { useState } from "react";
import Failed from "../../../alerts/Failed";
import Success from "../../../alerts/Success";
import SectionContainer from "../../table/SectionContainer";
import TextHeadingContainer from "../../TextHeadingContainer";
import ProviderWarning from "./ProviderWarning";
import { useRefreshContext } from "../../context/refreshData";

export default function ProviderSection({ provider }) {
  // submit / success / error controls
  const [applying, setApplying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Failed to apply changes.");
  const [showSuccess, setShowSuccess] = useState(false);

  const refreshData = useRefreshContext();

  function handleCloseError() {
    setShowError(false);
  }

  function handleCloseSuccess() {
    setShowSuccess(false);
  }

  const sendProviderRequest = async () => {
    setApplying(true);

    const res = await fetch(`/api/provider/`, {
      method: "POST",
    });

    if (!res.ok) {
      setErrorMsg(await res.text());
      setShowError(true);
      setApplying(false);
    } else {
      setShowSuccess(true);
      setApplying(false);
      setTimeout(() => {
        refreshData();
      }, 3000);
    }
  };

  return (
    <SectionContainer>
      <TextHeadingContainer>
        {!provider?.length && (
          <ProviderWarning
            applying={applying}
            sendProviderRequest={sendProviderRequest}
          />
        )}
        {showSuccess && (
          <div className="my-4 w-1/3">
            <Success successMsg="Successfully registered with the Riot Games API! Refreshing page..." />
          </div>
        )}
        {showError && (
          <div className="my-4 w-1/3">
            <Failed closeError={handleCloseError} errorMsg={errorMsg} />
          </div>
        )}
      </TextHeadingContainer>
    </SectionContainer>
  );
}
