import React, { useEffect } from "react";
import { MultiSelect } from "primereact/multiselect";

const TableFooter = ({ setSelectedColumns, selectedColumns, rowData }) => {
  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = rowData.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
    setSelectedColumns(orderedSelectedColumns);
  };

  useEffect(() => {
    setSelectedColumns(rowData.filter((row) => !row.hide));
  }, [rowData]);

  return (
    <MultiSelect
      placeholder="עמודות שנבחרו"
      fixedPlaceholder
      value={selectedColumns}
      options={rowData}
      optionLabel="displayName"
      onChange={onColumnToggle}
      style={{ width: "20em" }}
    />
  );
};

export { TableFooter };
