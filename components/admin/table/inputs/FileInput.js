import Image from "next/image";
import React, { useState } from "react";

export default function FileInput({
  handleChanges,
  inputName,
  id,
  value,
  saveFiles,
  uploadToClient,
}) {
  return (
    <>
      <input
        data-id={id}
        name={inputName}
        id={inputName}
        type="file"
        onChange={(e) => {
          handleChanges(e, inputName);
          saveFiles(e, id);
          uploadToClient(e);
        }}
      ></input>
    </>
  );
}
