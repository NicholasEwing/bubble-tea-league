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

export default function EditableTable({
  items,
  columns,
  tableName,
  bulkEdit,
  bulkDelete,
  foreignItems,
}) {
  // table data and controls
  const [itemsState, setItemsState] = useState(items);
  const [editState, setEditState] = useState(items);
  const [foreignItemsState, setForeignItemsState] = useState(foreignItems);
  const [foreignEditState, setForeignEditState] = useState(foreignItems);
  const [editingItems, setEditingItems] = useState([]);

  // row checkbox controls
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);

  // submit / success / error controls
  const [applying, setApplying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const refreshData = useRefreshContext();

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

    const formattedValue = !isNaN(newItemValue)
      ? parseInt(newItemValue)
      : newItemValue;

    const newItem = { ...editItem, [valueKey]: formattedValue };

    if (customIdKey) {
      const newForeignItemsState = itemsState.map((i) => {
        if (i[customIdKey] == itemId) {
          return newItem;
        } else {
          const editStateItem = editState.find(
            (editItem) => editItem[customIdKey] == i[customIdKey]
          );

          const alreadyEditedItem = !isEqual(editStateItem, i);

          if (alreadyEditedItem) {
            return editStateItem;
          } else {
            return i;
          }
        }
      });

      return newForeignItemsState;
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
    setForeignEditState(foreignItems);
  }, [foreignItems]);

  useLayoutEffect(() => {
    if (items.length) {
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

  function handleChanges(e, valueKey) {
    const newItemValue = e.target.value;
    const { foreignKeyAsId, foreignKeyToChange } = e.target.dataset;
    const itemId = parseInt(e.target.dataset.id);

    if (e.target.validity.valid) {
      if (foreignKeyAsId && foreignKeyToChange) {
        const foreignItem = foreignItems.find(
          (i) => i[foreignKeyAsId] === itemId
        );
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

      const newForeignItemsState = foreignItemsState.map((foreignStateItem) =>
        foreignStateItem[foreignKeyAsId] == id
          ? foreignEditStateItem
          : foreignStateItem
      );

      setForeignItemsState(newForeignItemsState);
    }
  }

  function cancelChanges(id) {
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
    const c = columns.find((c) => c.updateForeignValue?.foreignKeyAsId);
    const { foreignKeyAsId } = c.updateForeignValue;

    const oldForeignItem = foreignItemsState.find(
      (foreignStateItem) => foreignStateItem[foreignKeyAsId] == id
    );

    const newForeignEditState = foreignEditState.map((foreignEditStateItem) =>
      foreignEditStateItem[foreignKeyAsId] == id
        ? oldForeignItem
        : foreignEditStateItem
    );

    setForeignEditState(newForeignEditState);
  }

  const canApply =
    isEqual(items, itemsState) && isEqual(foreignItems, foreignItemsState)
      ? false
      : true;

  async function applyChanges() {
    try {
      setApplying(true);

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

      // update foreign items, if any
      if (foreignItemsState?.length) {
        const c = columns.find((c) => c.updateForeignValue);
        const { foreignApiName, foreignRecordName } = c.updateForeignValue;

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

  if (!items.length)
    return <p className="text-white text-2xl my-8">No items here yet!</p>;

  return (
    <>
      <TableContainer>
        {(bulkEdit || bulkDelete) && (
          <MultiSelectButtons
            selectedItems={selectedItems}
            bulkEdit={bulkEdit}
            handleBulkEdit={handleBulkEdit}
            bulkDelete={bulkDelete}
          />
        )}
        <Table>
          <TableHead
            checkbox={checkbox}
            checked={checked}
            toggleAll={toggleAll}
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
                    />
                  );
                })}
                <EditButton
                  id={item.id || item.number}
                  saveChanges={saveChanges}
                  cancelChanges={cancelChanges}
                  checkIfRowCanSave={checkIfRowCanSave}
                  handleEditRows={handleEditRows}
                  editing={editingItems.includes(item.id || item.number)}
                />
              </Row>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex self-end space-x-6 pt-8">
        {showError && <Failed closeError={handleCloseError} />}
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
