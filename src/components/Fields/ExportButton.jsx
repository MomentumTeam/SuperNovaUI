import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useToast } from '../../context/use-toast';
import React, { useState, useEffect } from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { exportToExcel } from '../../utils/general';
import { renameObjKeys } from '../../utils/hierarchy';
import { excelLabels } from '../../constants/applies';
import { exportHierarchyData } from '../../service/KartoffelService';

const ExportButton = ({ exportFunction, toolTip = '', hierarchy = '' }) => {
  const { trackEvent } = useMatomo();
  const [isOpen, setIsOpen] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [directExcelLoading, setDirectExcelLoading] = useState(false);

  const { actionPopup } = useToast();

  const sendTrack = (type, action) => {
    trackEvent({
      category: type,
      action: action,
    });
  };

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
    } else {
      setExcelLoading(activate);
    }
  };

  const excelExport = async (direct) => {
    updateLoading(direct, true);

    try {
      let fileName = undefined;

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

    sendTrack(
      'ייצוא',
      direct
        ? 'נתונים רק על התפקידים שנמצאים בהיררכיה זו'
        : 'נתונים למייל על כל התפקידים שנמצאים בהיררכיה זו ובהיררכיות תחתיה'
    );

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
            <p>
              <strong> נא בחר את הערכים לייצוא:</strong>
              <br />
              פעולה זו עשויה להימשך מספר דקות, יש להישאר בחלון זה.
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
