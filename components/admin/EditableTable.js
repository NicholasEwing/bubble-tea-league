import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Cell from "./table/Cell";
import ColumnHeader from "./table/ColumnHeader";
import EditButton from "./table/EditButton";
import Row from "./table/Row";
import SectionContainer from "./table/SectionContainer";
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

export default function EditableTable({ items, columns, tableName }) {
  // table controls
  const [itemsState, setItemsState] = useState(items);
  const [editState, setEditState] = useState(items);
  const [isEditing, setIsEditing] = useState(false);

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
      selectedItems.length > 0 && selectedItems.length < items.length;
    setChecked(selectedItems.length === items.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedItems, items.length]);

  function toggleAll() {
    setSelectedSeasons(checked || indeterminate ? [] : items);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  // ------ THIS IS SPECIFIC TO EACH TABLE -------
  function handleChanges(e, valueKey) {
    const newItemValue = e.target.value;

    const itemId = parseInt(e.target.dataset.id);
    const item = itemsState.find((i) => i.id || i.number == itemId);

    if (e.target.validity.valid) {
      const newItemsState = itemsState.map((i) => {
        if ((i.number || i.id) == (item.number || item.id)) {
          return { ...item, [valueKey]: newItemValue };
        } else {
          return i;
        }
      });

      setEditState(newItemsState);
    }
  }

  const canSave = !isEqual(editState, itemsState);

  function saveChanges() {
    setIsEditing(false);
    setItemsState(editState);
  }

  function cancelChanges() {
    setIsEditing(false);
    setEditState(itemsState);
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

  return (
    <>
      <TableContainer>
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
                {columns.map((c, i) => (
                  <Cell
                    key={`${tableName}-${c.name}-cell`}
                    selectedItems={i === 0 ? selectedItems : undefined}
                    item={item}
                    value={item[c.valueKey]}
                    inputName={c.valueKey}
                    canEdit={c.canEdit}
                    editing={c.canEdit ? isEditing : undefined}
                    id={item.id || item.number}
                    pattern={c.pattern}
                    handleChanges={handleChanges}
                  />
                ))}
                <EditButton
                  item={item.id || item.number}
                  editing={isEditing}
                  setIsEditing={setIsEditing}
                  saveChanges={saveChanges}
                  cancelChanges={cancelChanges}
                  canSave={canSave}
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
