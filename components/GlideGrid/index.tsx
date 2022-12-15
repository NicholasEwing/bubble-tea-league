import DataEditor, {
  EditableGridCell,
  GridCell,
  GridColumn,
  GridMouseEventArgs,
  Item,
} from "@glideapps/glide-data-grid";
import { GetRowThemeCallback } from "@glideapps/glide-data-grid/dist/ts/data-grid/data-grid-render";

import { useCallback, useState } from "react";
import { btlDarkTheme } from "./themes";

interface GridProps {
  getData: (cell: Item) => GridCell;
  data: any[];
  columns: GridColumn[];
  onCellEdited: (cell: Item, newValue: EditableGridCell) => void;
}

export default function Grid({
  data,
  columns,
  getData,
  onCellEdited,
}: GridProps) {
  const [hoverRow, setHoverRow] = useState<number | undefined>(undefined);

  const onItemHovered = (args: GridMouseEventArgs) => {
    const [_, row] = args.location;
    setHoverRow(args.kind !== "cell" ? undefined : row);
  };

  const getRowThemeOverride = useCallback<GetRowThemeCallback>(
    (row) => {
      if (row !== hoverRow) return undefined;
      return {
        bgCell: "#474545",
        bgCellMedium: "#474545",
      };
    },
    [hoverRow]
  );

  return (
    <DataEditor
      className="my-8"
      columns={columns}
      rows={data.length}
      getCellContent={getData}
      onCellEdited={onCellEdited}
      onItemHovered={onItemHovered}
      getRowThemeOverride={getRowThemeOverride}
      getCellsForSelection={true}
      onPaste={true}
      smoothScrollX={true}
      smoothScrollY={true}
      rowMarkers="number"
      keybindings={{ search: true }}
      theme={btlDarkTheme}
      height={200}
      width="100%"
    />
  );
}
