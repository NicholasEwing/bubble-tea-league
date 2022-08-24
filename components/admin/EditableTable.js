import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Cell from "./table/Cell";
import ColumnHeader from "./table/ColumnHeader";
import EditButton from "./table/EditButton";
import Row from "./table/Row";
import SectionContainer from "./table/SectionContainer";
import MultiSelectButtons from "./table/MultiSelectButtons";
import Table from "./table/Table";
import TableBody from "./table/TableBody";
import TableContainer from "./table/TableContainer";
import TableHead from "./table/TableHead";
import Failed from "./../alerts/Failed";
import Success from "./../alerts/Success";
import AddButton from "./table/AddButton";
import { isEqual, varAsString } from "../../lib/utils";
import { useRefreshContext } from "./context/refreshData";
import ApplyButton from "./table/ApplyButton";
import TextHeadingContainer from "./TextHeadingContainer";
import DeleteButton from "./table/DeleteButton";

export default function EditableTable({
  items,
  columns,
  tableName,
  bulkEdit,
  canDelete,
  foreignItems,
  isPublic = false,
}) {
  // table data and controls
  const [itemsState, setItemsState] = useState(items);
  const [editState, setEditState] = useState(items);
  const [foreignItemsState, setForeignItemsState] = useState(foreignItems);
  const [foreignEditState, setForeignEditState] = useState(foreignItems);
  const [editingItems, setEditingItems] = useState([]);

  // image upload controls
  const [files, setFiles] = useState([]);
  const [savedFiles, setSavedFiles] = useState([]);
  const [createObjectURLs, setCreateObjectURLs] = useState([]);

  // row checkbox controls
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);

  // submit / success / error controls
  const [applying, setApplying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Failed to apply changes.");
  const [showSuccess, setShowSuccess] = useState(false);

  const refreshData = useRefreshContext();

  const columnsWithFiles = columns.filter((c) => c.inputType === "file");

  const updateTableRowValue = (
    editState,
    itemsState,
    itemId,
    item,
    valueKey,
    newItemValue,
    customIdKey
  ) => {
    let editItem = {};

    if (customIdKey) {
      editItem = editState.find((editItem) => editItem[customIdKey] == itemId);
    } else {
      editItem = editState.find(
        (editItem) => (editItem.id || editItem.number) == itemId
      );
    }

    let formattedValue;
    if (!isNaN(parseInt(newItemValue))) {
      parseInt(newItemValue);
    } else {
      formattedValue = newItemValue;
    }

    const newItem = { ...editItem, [valueKey]: formattedValue };

    if (customIdKey) {
      const itemExistsInState = itemsState.find(
        (i) => i[customIdKey] == itemId
      );

      if (itemExistsInState) {
        const newForeignItemsState = itemsState.map((i) => {
          if (i[customIdKey] == itemId) {
            return newItem;
          } else {
            const editStateItem = editState.find(
              (editItem) => editItem[customIdKey] == i[customIdKey]
            );

            const alreadyEditedItem =
              editStateItem[customIdKey] == i[customIdKey];

            if (alreadyEditedItem) {
              return editStateItem;
            } else {
              return i;
            }
          }
        });

        return newForeignItemsState;
      } else {
        return [...itemsState, newItem];
      }
    } else {
      const newItemsState = itemsState.map((i) => {
        if ((i.number || i.id) == (item.number || item.id)) {
          return newItem;
        } else {
          const editStateItem = editState.find(
            (editItem) => (editItem.id || editItem.number) == (i.id || i.number)
          );

          const alreadyEditedItem = !isEqual(editStateItem, i);

          if (alreadyEditedItem) {
            return editStateItem;
          } else {
            return i;
          }
        }
      });

      return newItemsState;
    }
  };

  useEffect(() => {
    setItemsState(items);
    setEditState(items);
  }, [items]);

  useEffect(() => {
    setForeignItemsState(foreignItems);
    setForeignEditState(foreignItems);
  }, [foreignItems]);

  useLayoutEffect(() => {
    if (items.length && !isPublic) {
      const isIndeterminate =
        selectedItems.length > 0 && selectedItems.length < editState.length;
      setChecked(selectedItems.length === editState.length);
      setIndeterminate(isIndeterminate);
      checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedItems, editState.length, items.length]);

  function toggleAll() {
    setSelectedItems(checked || indeterminate ? [] : editState);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const saveFiles = (event, id) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFiles([...files, { id, file }]);
    }
  };

  const uploadFiles = async () => {
    for (const fileObj of savedFiles) {
      const { file, id } = fileObj;
      const body = new FormData();
      body.append("file", file);
      body.append("id", id);

      const res = await fetch(`http://localhost:3000/api/${tableName}/upload`, {
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };

  function handleChanges(e, valueKey) {
    const newItemValue = e.target.value;
    const { foreignKeyAsId, foreignKeyToChange } = e.target.dataset;
    const itemId = parseInt(e.target.dataset.id);

    if (e.target.validity.valid) {
      if (foreignKeyAsId && foreignKeyToChange) {
        const foreignItem =
          foreignItems.find((i) => i[foreignKeyAsId] === itemId) ||
          foreignEditState.find((i) => i[foreignKeyAsId] === itemId);

        if (foreignItem) {
          const newForeignItemsState = updateTableRowValue(
            foreignEditState,
            foreignItemsState,
            itemId,
            foreignItem,
            foreignKeyToChange,
            newItemValue,
            foreignKeyAsId
          );

          setForeignEditState(newForeignItemsState);
        } else {
          const ids = foreignEditState.map((fes) => fes.id);
          const maxId = Math.max(...ids);

          const newForeignItem = {
            id: maxId + 1,
            [foreignKeyAsId]: itemId,
            [foreignKeyToChange]: e.target.value,
          };

          const newForeignEditState = [...foreignEditState, newForeignItem];
          setForeignEditState(newForeignEditState);
        }
      } else {
        const item = itemsState.find((i) => (i.id || i.number) == itemId);
        const newItemsState = updateTableRowValue(
          editState,
          itemsState,
          itemId,
          item,
          valueKey,
          newItemValue
        );
        setEditState(newItemsState);
      }
    }
  }

  const checkIfRowCanSave = (id) => {
    // see if this row's data changed
    const draftedItem = editState.find((es) => (es.id || es.number) == id);
    const currentItem = itemsState.find((is) => (is.id || is.number) == id);

    let canSave = !isEqual(draftedItem, currentItem);
    if (canSave) return true;

    // if we still can't save, let's check if any data referencing
    // a foreign table changed
    const columnWithForeignValue = columns.find(
      (c) => c?.updateForeignValue?.foreignKeyAsId
    );

    if (columnWithForeignValue) {
      const { foreignKeyAsId } = columnWithForeignValue.updateForeignValue;

      const foreignDraftedItem = foreignEditState.find(
        (fes) => fes[foreignKeyAsId] == id
      );
      const foreignCurrentItem = foreignItemsState.find(
        (fis) => fis[foreignKeyAsId] == id
      );

      canSave = !isEqual(foreignDraftedItem, foreignCurrentItem);
    }

    return canSave;
  };

  function saveChanges(id) {
    // uncheck item's checkbox
    // minor todo: check box when changing foreign value doesn't uncheck automatically
    const newEditingItems = editingItems.filter((i) => i !== id);
    setEditingItems([...newEditingItems]);

    // find the row we changed
    const editStateItem = editState.find(
      (editItem) => (editItem.id || editItem.number) == id
    );

    // return the items state, but add in the new one we changed
    const newItemsState = itemsState.map((stateItem) =>
      (stateItem.id || stateItem.number) == id ? editStateItem : stateItem
    );

    setItemsState(newItemsState);

    // same thing as before, but for rows with foreign values
    const columnWithForeignValue = columns.find(
      (c) => c?.updateForeignValue?.foreignKeyAsId
    );

    if (columnWithForeignValue) {
      const { foreignKeyAsId } = columnWithForeignValue.updateForeignValue;

      const foreignEditStateItem = foreignEditState.find(
        (foreignItem) => foreignItem[foreignKeyAsId] == id
      );

      const foreignStateItem = foreignItemsState.find(
        (fsi) => fsi[foreignKeyAsId] == id
      );

      // if this item isn't in foreignItemState yet, simply add it
      if (!foreignStateItem) {
        const newForeignItemsState = [
          ...foreignItemsState,
          foreignEditStateItem,
        ];
        setForeignItemsState(newForeignItemsState);
      } else {
        // if it's already in here, find it and change it
        const newForeignItemsState = foreignItemsState.map(
          (foreignStateItem) => {
            if (foreignStateItem[foreignKeyAsId] == id) {
              return foreignEditStateItem;
            } else {
              return foreignStateItem;
            }
          }
        );
        setForeignItemsState(newForeignItemsState);
      }
    }

    if (files) {
      setSavedFiles(files);
      setFiles([]);
    }
  }

  function cancelChanges(id) {
    const newFiles = files.filter((f) => f.id !== id);
    const newObjectUrls = createObjectURLs.filter((o) => o.id !== id);

    setFiles(newFiles);
    setCreateObjectURLs(newObjectUrls);

    const newEditingItems = editingItems.filter((i) => i !== id);
    setEditingItems([...newEditingItems]);

    // only revert THIS item to it's itemState
    const oldItem = itemsState.find(
      (stateItem) => (stateItem.id || stateItem.number) == id
    );

    // return the normal edit state, but change the oldItem
    const newEditState = editState.map((editItem) =>
      (editItem.id || editItem.number) == id ? oldItem : editItem
    );

    setEditState(newEditState);

    // same thing, but for rows with foreign values
    const foreignColumn = columns.find(
      (c) => c.updateForeignValue?.foreignKeyAsId
    );

    if (foreignColumn) {
      const { foreignKeyAsId } = foreignColumn.updateForeignValue;
      const oldForeignItem = foreignItemsState.find(
        (foreignStateItem) => foreignStateItem[foreignKeyAsId] == id
      );

      if (oldForeignItem) {
        const newForeignEditState = foreignEditState.map(
          (foreignEditStateItem) =>
            foreignEditStateItem[foreignKeyAsId] == id
              ? oldForeignItem
              : foreignEditStateItem
        );

        setForeignEditState(newForeignEditState);
      } else {
        const newForeignEditState = foreignEditState.filter(
          (foreignEditStateItem) => foreignEditStateItem[foreignKeyAsId] !== id
        );
        setForeignEditState(newForeignEditState);
      }
    }
  }

  let canApply;
  if (foreignItems?.length) {
    canApply =
      !isEqual(items, itemsState) || !isEqual(foreignItems, foreignItemsState);
  } else {
    canApply = !isEqual(items, itemsState);
  }

  async function applyChanges() {
    try {
      setApplying(true);

      // find ids to delete and delete them -------
      const dbIds = items.map((i) => i.id);
      const tableIds = itemsState.map((stateItem) => stateItem.id);

      const idsToDelete = dbIds.filter((id) => !tableIds.includes(id));

      if (idsToDelete.length) {
        const deleteRes = await fetch(
          `http://localhost:3000/api/${tableName}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idsToDelete }),
          }
        );
        if (!deleteRes.ok) {
          throw new Error("Cannot delete players with BTL match history.");
        }
      }

      if (foreignItemsState?.length) {
        const foreignColumns = columns.filter((c) => c.updateForeignValue);
        const { foreignApiName, foreignRecordName } =
          foreignColumns[0].updateForeignValue;

        const foreignDbIds = foreignItems.map((i) => i.id);
        const tableIds = foreignItemsState.map((stateItem) => stateItem.id);

        const idsToDelete = dbIds.filter((id) => !tableIds.includes(id));

        if (idsToDelete.length) {
          const foreignDeleteRes = await fetch(
            `http://localhost:3000/api/${foreignApiName}/`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ idsToDelete }),
            }
          );

          if (!foreignDeleteRes.ok) {
            throw new Error("Cannot delete foreign data.");
          }
        }
      }

      if (savedFiles) {
        await uploadFiles();
        setFiles([]);
        setSavedFiles([]);
      }

      const res = await fetch(`http://localhost:3000/api/${tableName}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [tableName]: itemsState }),
      });

      if (!res.ok) {
        throw new Error("Failed to apply changes.");
      }

      if (foreignItemsState?.length) {
        const foreignColumns = columns.filter((c) => c.updateForeignValue);
        const { foreignApiName, foreignRecordName } =
          foreignColumns[0].updateForeignValue;

        const foreignRes = await fetch(
          `http://localhost:3000/api/${foreignApiName}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ [foreignRecordName]: foreignItemsState }),
          }
        );

        if (!foreignRes.ok) {
          throw new Error("Failed to apply changes.");
        }
      }

      refreshData();

      setApplying(false);
      setShowSuccess(true);
    } catch (error) {
      setEditingItems([]);
      setEditState(items);
      setItemsState(items);
      setApplying(false);
      setShowError(true);
      setErrorMsg(error.message);
      console.error(error);
    }
  }

  function handleCloseError() {
    setShowError(false);
  }

  function handleCloseSuccess() {
    setShowSuccess(false);
  }

  function handleBulkEdit() {
    const newEditingItems = [...editingItems].concat(
      selectedItems.map((si) => si.id || si.number)
    );

    setEditingItems(newEditingItems);
  }

  function handleEditRows(id) {
    setEditingItems([...editingItems, id]);
  }

  // make this function bulk
  function handleDeleteItem(selectedItems) {
    const idsToDelete = selectedItems.map((i) => i.id);

    // remove all rows from edit state
    const newEditState = editState.filter((es) => !idsToDelete.includes(es.id));
    setEditState(newEditState);
    setItemsState(newEditState);

    // remove entire row from foreign state, if any
    if (foreignEditState.length) {
      const foreignColumns = columns.filter((c) => c.updateForeignValue);
      const { foreignApiName, foreignRecordName, foreignKeyAsId } =
        foreignColumns[0].updateForeignValue;

      const newForeignEditState = foreignEditState.filter(
        (fes) => !idsToDelete.includes(fes[foreignKeyAsId])
      );

      setForeignEditState(newForeignEditState);
      setForeignItemsState(newForeignEditState);
    }

    setSelectedItems(checked || indeterminate ? [] : editState);
    setChecked(false);
    setIndeterminate(false);
  }

  if (!items.length)
    return <p className="my-8 text-2xl text-white">No items here yet!</p>;

  return (
    <>
      <TableContainer>
        {(bulkEdit || canDelete) && selectedItems.length > 1 && (
          <MultiSelectButtons
            selectedItems={selectedItems}
            bulkEdit={bulkEdit}
            handleBulkEdit={handleBulkEdit}
            canDelete={canDelete}
            handleDeleteItem={handleDeleteItem}
          />
        )}
        {canDelete && selectedItems.length === 1 && (
          <DeleteButton
            selectedItems={selectedItems}
            handleDeleteItem={handleDeleteItem}
          />
        )}
        <Table>
          <TableHead
            checkbox={checkbox}
            checked={checked}
            toggleAll={toggleAll}
            isPublic={isPublic}
          >
            {columns.map((c) => (
              <ColumnHeader
                key={`${tableName}-${c.name}-column-header`}
                name={c.name}
                small={c.small}
              />
            ))}
          </TableHead>
          <TableBody>
            {editState.map((item, i) => (
              <Row
                key={`${[tableName]}-${item.id || item.number}`}
                selectedItems={selectedItems}
                item={item}
                setSelectedItems={setSelectedItems}
                isPublic={isPublic}
              >
                {columns.map((column, j) => {
                  const {
                    customFormatter,
                    customInfo,
                    valueKey,
                    updateForeignValue,
                    name,
                    canEdit,
                    pattern,
                    inputType,
                    options,
                    needsEditState,
                    needsForeignEditState,
                  } = column;

                  let originalValue = item[valueKey];
                  let cellValue = item[valueKey];

                  if (customFormatter) {
                    let formatterArgs = { [valueKey]: cellValue };

                    if (needsEditState) formatterArgs.editState = editState;
                    if (needsForeignEditState && foreignEditState.length)
                      formatterArgs.foreignEditState = foreignEditState;
                    if (customInfo) {
                      // grab info from other columns
                      customInfo.forEach(
                        (key) => (formatterArgs[key] = item[key])
                      );
                    }

                    cellValue = customFormatter(formatterArgs);
                  }

                  return (
                    <Cell
                      key={`${tableName}-${name}-cell-${
                        item.id || item.number
                      }`}
                      selectedItems={j === 0 ? selectedItems : undefined}
                      item={item}
                      originalValue={originalValue}
                      value={cellValue}
                      inputName={valueKey}
                      inputType={inputType}
                      canEdit={canEdit}
                      editing={editingItems.includes(item.id || item.number)}
                      id={item.id || item.number}
                      pattern={pattern}
                      handleChanges={handleChanges}
                      updateForeignValue={updateForeignValue}
                      options={options}
                      files={files}
                      savedFiles={savedFiles}
                      saveFiles={saveFiles}
                      createObjectURLs={createObjectURLs}
                      setCreateObjectURLs={setCreateObjectURLs}
                    />
                  );
                })}
                {!isPublic && (
                  <EditButton
                    id={item.id || item.number}
                    saveChanges={saveChanges}
                    cancelChanges={cancelChanges}
                    checkIfRowCanSave={checkIfRowCanSave}
                    handleEditRows={handleEditRows}
                    editing={editingItems.includes(item.id || item.number)}
                  />
                )}
              </Row>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex space-x-6 self-end pt-8">
        {showError && (
          <Failed closeError={handleCloseError} errorMsg={errorMsg} />
        )}
        {showSuccess && <Success closeSuccess={handleCloseSuccess} />}
        <ApplyButton
          applyChanges={applyChanges}
          canApply={canApply}
          applying={applying}
        />
      </div>
    </>
  );
}
