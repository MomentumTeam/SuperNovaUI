import React, { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { ExportButton } from '../Fields/ExportButton';
import { useToast } from '../../context/use-toast';

const TableFooter = ({
  setSelectedColumns,
  selectedColumns,
  rowData,
  exportFunction = null,
  selectedItem = [],
  isSelectedCol = false,
  selectAllRowsCheckbox = null,
}) => {
  const { actionPopup } = useToast();
  const [isExportLoading, setIsExportLoading] = useState(false);

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = rowData.filter((col) => selectedColumns.some((sCol) => sCol.field === col.field));
    setSelectedColumns(orderedSelectedColumns);
  };

  useEffect(() => {
    let temprow = rowData;
    setSelectedColumns(temprow.filter((row) => !row.hide));
  }, [rowData]);

  const exportFunc = async () => {
    try {
      const isSelectedAll = selectAllRowsCheckbox && selectAllRowsCheckbox?.ariaChecked;
      
      setIsExportLoading(true);
      await exportFunction(selectedItem, isSelectedAll);
    } catch (error) {
      actionPopup("ייצוא טבלה", { message: "יש בעיה בייצוא הטבלה" });
    }

    setIsExportLoading(false);
  };
  return (
    <>
      <div style={{ display: "flex" }}>
        {exportFunction && <ExportButton isExportLoading={isExportLoading} exportFunction={exportFunc} />}

        {isSelectedCol && (
          <MultiSelect
            placeholder="עמודות שנבחרו"
            fixedPlaceholder
            value={selectedColumns}
            options={rowData}
            optionLabel="displayName"
            onChange={onColumnToggle}
            style={{ width: "20em" }}
          />
        )}
      </div>
    </>
  );
};

export { TableFooter };
