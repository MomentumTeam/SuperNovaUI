import React, { useState } from "react";
import { Button } from "primereact/button";
import { toJS } from "mobx";
import { useStores } from "../../../context/use-stores";
import { canEditHierarchy, processHierarchyData } from "../../../utils/hierarchy";
import { exportToExcel } from '../../../utils/general';
import { ExportButton } from '../../Fields/ExportButton';

const FullHierarchyInformationFooter = ({ isEdit, closeModal, setIsEdit, handleRequest, hierarchy }) => {
  const { userStore } = useStores();
  const connectedUser = toJS(userStore.user);
  const [excelLoading, setExcelLoading] = useState(false);

  const excelExport = async () => {
    try {
      setExcelLoading(true);
      const hierarchyData = await processHierarchyData(hierarchy);
      exportToExcel(hierarchyData, `${hierarchy.name}Roles`);
      
    } catch (error) {
      
    }
    setExcelLoading(false);
  };


  return (
    <>
      <div className="display-flex">
        <div>
          <ExportButton isExportLoading={excelLoading} exportFunction={excelExport} />
        </div>

        <div className="display-flex">
          {canEditHierarchy(connectedUser) && (
            <Button
              id="fullHierarchyInfoForm-editOrCancel"
              label={isEdit ? "ביטול" : "עריכה"}
              className={isEdit ? "btn-underline" : "btn-border orange"}
              onClick={() => {
                setIsEdit(!isEdit);
              }}
            />
          )}

          <Button
            id="fullHierarchyInfoForm-closeOrSave"
            label={isEdit ? "שליחת בקשה" : "סגור"}
            className="btn-orange-gradient"
            onClick={() => (isEdit ? handleRequest() : closeModal())}
          />
        </div>
      </div>
    </>
  );
};

export { FullHierarchyInformationFooter };
