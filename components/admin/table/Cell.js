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
  // useEffect(() => {
  //   async function readBlob(blob) {
  //     const text = await new Response(blob).text();
  //   }

  //   if (inputType === "file" && !files.length && createObjectURL) {
  //     // compare this cell's value

  //     const text = readBlob(createObjectURL);
  //     console.log("text???", text);

  //     console.log("triggered condition");
  //     console.log("value", value);
  //     console.log("create obj url?", createObjectURL);
  //     // console.log("files", files);
  //     // console.log("saved files", savedFiles);
  //     // only trigger on THIS cell...
  //     setCreateObjectURL();
  //   }
  // }, [inputType, files, createObjectURL, savedFiles, value]);A

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
        console.log("new obj urls", newObjectUrls);
        newObjectUrls.push(existingObjectUrl);
        console.log("overwrited old one, new obj urls", newObjectUrls);
        setCreateObjectURLs(newObjectUrls);
      } else {
        setCreateObjectURLs([
          ...createObjectURLs,
          { id, url: URL.createObjectURL(i) },
        ]);
      }
    }
  };

  const valueAsString = value?.toString() ? value.toString() : "";

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
      {editing && canEdit
        ? inputComponent
        : trimString(valueAsString, 30) || "-"}
    </td>
  );
}
