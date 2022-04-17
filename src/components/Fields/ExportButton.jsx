import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useToast } from '../../context/use-toast';
import React, { useState } from 'react';
import { exportToExcel } from '../../utils/general';
import { renameObjKeys } from '../../utils/hierarchy';
import { excelLabels } from '../../constants/applies';
import { exportHierarchyData } from '../../service/KartoffelService';

const ExportButton = ({ exportFunction, toolTip = '', hierarchy = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [directExcelLoading, setDirectExcelLoading] = useState(false);

  const { actionPopup } = useToast();

  const openDialog = async () => {
    setIsOpen(true);
  };

  const closeDialog = async () => {
    setIsOpen(false);
    setExcelLoading(false);
    setDirectExcelLoading(false);
  };

  const excelExport = async (direct) => {
    try {
      let fileName = undefined;

      if (direct) setDirectExcelLoading(true);
      else setExcelLoading(true);

      const hierarchyData = await exportHierarchyData(hierarchy, true, direct);

      const data = renameObjKeys(hierarchyData.hierarchyData, excelLabels);

      if (hierarchyData.fatherHierarchyName) {
        fileName = direct
          ? `${hierarchyData.fatherHierarchyName}-ישיר`
          : hierarchyData.fatherHierarchyName;
      }
      exportToExcel(data, fileName);
    } catch (error) {
      actionPopup('ייצוא טבלה', {
        message: 'יש בעיה בייצוא הטבלה',
      });
    }

    closeDialog();
  };

  return (
    <>
      <Dialog
        className="dialogClass10"
        header="ייצוא תפקידים"
        visible={isOpen}
        onHide={() => setIsOpen(false)}
        dismissableMask={true}
        style={{ width: '25vw' }}
        footer={
          <>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                loading={directExcelLoading}
                style={{ marginLeft: '20px' }}
                className="btn-border green"
                label="ייצא נתונים רק על התפקידים שנמצאים בהיררכיה זו"
                onClick={async () => {
                  await excelExport(true);
                }}
              />
              <Button
                loading={excelLoading}
                label="ייצא נתונים על כל התפקידים שנמצאים בהיררכיה זו ובהיררכיות תחתיה"
                className="btn-border green"
                onClick={async () => {
                  await excelExport(false);
                }}
              />
            </div>
          </>
        }
      >
        <div className="container">
          <div>
            <p style={{ fontWeight: 'bold' }}>נא בחר את הערכים לייצוא:</p>
          </div>
        </div>
      </Dialog>
      <div>
        <Button
          id="export-button"
          icon="pi pi-file-excel"
          label="ייצוא"
          className="btn-border green"
          onClick={exportFunction ? exportFunction : openDialog}
          tooltip={toolTip !== '' ? toolTip : false}
        />
      </div>
    </>
  );
};

export { ExportButton };
