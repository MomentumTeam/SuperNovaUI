import React, { useEffect, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { ExportButton } from '../Fields/ExportButton';
import { useToast } from '../../context/use-toast';
import { useMatomo } from '@datapunt/matomo-tracker-react';

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
  const { trackEvent } = useMatomo();
  const [isExportLoading, setIsExportLoading] = useState(false);

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = rowData.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setSelectedColumns(orderedSelectedColumns);
  };

  const sendTrack = () => {
    trackEvent({
      category: 'ייצוא',
      action: 'בקשות',
    });
  };

  useEffect(() => {
    let temprow = rowData;
    setSelectedColumns(temprow.filter((row) => !row.hide));
  }, [rowData]);

  const exportFunc = async () => {
    try {
      const isSelectedAll =
        selectAllRowsCheckbox && selectAllRowsCheckbox?.ariaChecked;

      setIsExportLoading(true);
      await exportFunction(selectedItem, isSelectedAll);
      sendTrack();
    } catch (error) {
      actionPopup('ייצוא טבלה', { message: 'יש בעיה בייצוא הטבלה' });
    }

    setIsExportLoading(false);
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        {exportFunction && (
          <ExportButton
            isExportLoading={isExportLoading}
            exportFunction={exportFunc}
            toolTip="סמן בקשות שאותן תרצה לייצא"
          />
        )}

        {isSelectedCol && (
          <MultiSelect
            placeholder="עמודות שנבחרו"
            fixedPlaceholder
            value={selectedColumns}
            options={rowData}
            optionLabel="displayName"
            onChange={onColumnToggle}
            style={{ width: '20em' }}
          />
        )}
      </div>
    </>
  );
};

export { TableFooter };
