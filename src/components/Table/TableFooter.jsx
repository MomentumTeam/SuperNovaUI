import React, { useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";

const TableFooter = ({
  setSelectedColumns,
  selectedColumns,
  rowData,
  exportFunction = null,
  selectedItem = [],
  isSelectedCol = false,
}) => {
  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = rowData.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
    setSelectedColumns(orderedSelectedColumns);
  };

  useEffect(() => {
    let temprow = rowData;
    setSelectedColumns(temprow.filter((row) => !row.hide));
  }, [rowData]);

  return (
    <>
      <div style={{ display: "flex" }}>
        {exportFunction && (
          <button className="btn btn-export" title="Export" type="button" onClick={() => exportFunction(selectedItem)}>
            <span className="for-screnReader">Export</span>
          </button>
        )}

        {isSelectedCol && <MultiSelect
          placeholder="עמודות שנבחרו"
          fixedPlaceholder
          value={selectedColumns}
          options={rowData}
          optionLabel="displayName"
          onChange={onColumnToggle}
          style={{ width: "20em" }}
        />}
      </div>
    </>
  );
};

export { TableFooter };
