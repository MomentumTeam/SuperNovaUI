import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useToast } from '../../context/use-toast';
import React, { useState, useEffect } from 'react';
import { exportToExcel } from '../../utils/general';
import { renameObjKeys } from '../../utils/hierarchy';
import { excelLabels } from '../../constants/applies';
import { exportHierarchyData } from '../../service/KartoffelService';
import { sendHierarchyDataMail } from '../../service/MailService';

const ExportButton = ({ exportFunction, toolTip = '', hierarchy = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [directExcelLoading, setDirectExcelLoading] = useState(false);

  const { actionPopup } = useToast();

  // useEffect(() => {
  //   if (!excelLoading && !directExcelLoading) {
  //     setIsOpen(false);
  //   }
  // }, [excelLoading, directExcelLoading]);


  // const closeDialog = async (direct) => {
  //   updateLoading(direct, false);
  // };


  const openDialog = async () => {
    setIsOpen(true);
  };

  const updateLoading = (direct, activate) => {
    if (direct) {
      setDirectExcelLoading(activate);
    }
    // else {
    //   setExcelLoading(activate);
    // }
  };

  const excelExport = async (direct, toMail = false) => {
    updateLoading(direct, true);

    try {
      const req = {
        hierarchy,
        withRoles: true,
        direct,
      };

      if (!toMail) {
        let fileName = 'נתוני תפקידים';
        const hierarchyData = await exportHierarchyData(req);

        const data = renameObjKeys(hierarchyData.hierarchyData, excelLabels);

        if (hierarchyData.fatherHierarchyName) {
          fileName = direct
            ? `${hierarchyData.fatherHierarchyName}-ישיר`
            : hierarchyData.fatherHierarchyName;
        }
        exportToExcel(data, fileName);
      } else {
        sendHierarchyDataMail(req).then().catch();
      }
      
    } catch (error) {
      actionPopup('ייצוא טבלה', {
        message: 'יש בעיה בייצוא הטבלה',
      });
    }
    updateLoading(direct, false);

  };

  return (
    <>
      <Dialog
        className="dialogClass10"
        header="ייצוא תפקידים"
        visible={isOpen}
        onHide={() => {
          if (!excelLoading && !directExcelLoading) {
            setIsOpen(false);
          }
        }}
        dismissableMask={true}
        style={{ width: '26vw' }}
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
                label="ייצא נתוני כל התפקידים שנמצאים בהיררכיה זו ובהיררכיות תחתיה"
                className="btn-border green"
                onClick={async () => {
                  await excelExport(false, true);
                }}
              />
            </div>
          </>
        }
      >
        <div className="container">
          <div>
            <p>
              <strong> נא בחר את הערכים לייצוא:</strong>
              <br />
              שימו לב- ייצוא נתוני כל התפקידים ישלח כקובץ לאימייל.{' '}
            </p>
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
