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

export default function EditableTable({
  items,
  columns,
  tableName,
  bulkEdit,
  bulkDelete,
}) {
  // table data and controls
  const [itemsState, setItemsState] = useState(items);
  const [editState, setEditState] = useState(items);
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

  useEffect(() => {
    setItemsState(items);
    setEditState(items);
  }, [items]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedItems.length > 0 && selectedItems.length < editState.length;
    setChecked(selectedItems.length === editState.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedItems, editState.length]);

  function toggleAll() {
    setSelectedItems(checked || indeterminate ? [] : editState);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  function handleChanges(e, valueKey) {
    const newItemValue = e.target.value;

    const itemId = parseInt(e.target.dataset.id);
    const item = itemsState.find((i) => (i.id || i.number) == itemId);

    if (e.target.validity.valid) {
      // check if item has already been edited, if so append the key changes
      const editItem = editState.find(
        (editItem) => (editItem.id || editItem.number) == itemId
      );

      const newItem = { ...editItem, [valueKey]: newItemValue };

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

      setEditState(newItemsState);
    }
  }

  // can save condition for each ROW
  const checkIfRowCanSave = (id) => {
    const draftedItem = editState.find((es) => (es.id || es.number) == id);
    const currentItem = itemsState.find((is) => (is.id || is.number) == id);

    return !isEqual(draftedItem, currentItem);
  };

  function saveChanges(id) {
    // uncheck item's checkbox
    const newEditingItems = editingItems.filter((i) => i !== id);
    setEditingItems([...newEditingItems]);

    // for this item, return the new editStateItem with our changes
    const editStateItem = editState.find(
      (editItem) => (editItem.id || editItem.number) == id
    );

    // for other items, return the OG item
    const newItemsState = itemsState.map((stateItem) =>
      (stateItem.id || stateItem.number) == id ? editStateItem : stateItem
    );

    setItemsState(newItemsState);
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
  }

  const canApply = isEqual(items, itemsState) ? false : true;

  async function applyChanges() {
    try {
      setApplying(true);

      const changedItems = itemsState.filter((stateObj) => {
        // return objs NOT in other array
        return !items.some((itemObj) => {
          return stateObj.id === itemObj;
        });
      });

      const res = await fetch(`http://localhost:3000/api/${tableName}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [tableName]: changedItems }),
      });

      if (!res.ok) {
        throw new Error("Failed to apply changes.");
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
                {columns.map((c, j) => (
                  <Cell
                    key={`${tableName}-${c.name}-cell-${
                      item.id || item.number
                    }`}
                    selectedItems={j === 0 ? selectedItems : undefined}
                    item={item}
                    value={item[c.valueKey]}
                    inputName={c.valueKey}
                    canEdit={c.canEdit}
                    editing={editingItems.includes(item.id || item.number)}
                    id={item.id || item.number}
                    pattern={c.pattern}
                    handleChanges={handleChanges}
                  />
                ))}
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
