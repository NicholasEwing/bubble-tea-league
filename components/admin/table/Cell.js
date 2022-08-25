import Image from "next/image";
import React, { useEffect, useState } from "react";
import CalendarInput from "./inputs/CalendarInput";
import DropdownInput from "./inputs/DropdownInput";
import FileInput from "./inputs/FileInput";
import ScalingTextInput from "./inputs/ScalingTextInput";

export default function Cell({
  selectedItems,
  item,
  originalValue,
  value,
  canEdit = false,
  editing,
  inputName,
  handleChanges,
  id,
  pattern,
  options,
  inputType = "text",
  updateForeignValue,
  files,
  savedFiles,
  saveFiles,
  createObjectURLs,
  setCreateObjectURLs,
}) {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function trimString(string, length) {
    if (string.length > length) {
      return string.substring(0, length) + "...";
    } else {
      return string;
    }
  }

  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      // check if there's already an objecturl for this row
      const existingObjectUrl = createObjectURLs?.find((obj) => obj.id === id);

      if (existingObjectUrl) {
        existingObjectUrl.url = URL.createObjectURL(i);
        const newObjectUrls = createObjectURLs.filter((o) => o.id !== id);
        newObjectUrls.push(existingObjectUrl);
        setCreateObjectURLs(newObjectUrls);
      } else {
        setCreateObjectURLs([
          ...createObjectURLs,
          { id, url: URL.createObjectURL(i) },
        ]);
      }
    }
  };
  let valueAsComponent, valueAsString;
  if (typeof value === "object" && value !== null) {
    valueAsComponent = value;
  } else if (typeof value === "string" || typeof value === "number") {
    valueAsString = value ? value.toString() : "";
  } else {
    valueAsString = "";
  }

  let inputComponent = <p>no input decided on yet</p>;

  if (inputType === "text") {
    inputComponent = (
      <ScalingTextInput
        handleChanges={handleChanges}
        inputName={inputName}
        id={id}
        value={valueAsString}
        pattern={pattern}
      />
    );
  } else if (inputType === "datetime-local") {
    inputComponent = (
      <CalendarInput
        handleChanges={handleChanges}
        inputName={inputName}
        id={id}
        value={valueAsString}
      />
    );
  } else if (inputType === "select") {
    inputComponent = (
      <DropdownInput
        handleChanges={handleChanges}
        inputName={inputName}
        id={id}
        value={valueAsString}
        options={options}
        updateForeignValue={updateForeignValue}
      />
    );
  } else if (inputType === "file") {
    inputComponent = (
      <FileInput
        handleChanges={handleChanges}
        inputName={inputName}
        id={id}
        value={valueAsString}
        saveFiles={saveFiles}
        uploadToClient={uploadToClient}
      />
    );
  } else {
    inputComponent = <p>Invalid input component!</p>;
  }

  let objectUrl;
  if (inputType === "file") {
    objectUrl =
      createObjectURLs.length && createObjectURLs?.find((obj) => obj.id === id);
  }

  return (
    <td
      className={classNames(
        "relative h-[71px] whitespace-nowrap py-4 px-3 text-sm font-medium not-second:text-gray-300",
        selectedItems && item && selectedItems.includes(item)
          ? "first:text-teal-accent"
          : "first:text-gray-900"
      )}
    >
      {inputType === "file" && (objectUrl?.url || originalValue) && (
        <span className="m-2 align-middle">
          <Image
            src={objectUrl?.url || originalValue}
            width={30}
            height={30}
            alt={inputName}
          />
        </span>
      )}
      {/* nested ternanies are really stupid, but I'm lazy */}
      {valueAsComponent
        ? valueAsComponent
        : editing && canEdit
        ? inputComponent
        : (valueAsString && trimString(valueAsString, 30)) || "-"}
    </td>
  );
}
