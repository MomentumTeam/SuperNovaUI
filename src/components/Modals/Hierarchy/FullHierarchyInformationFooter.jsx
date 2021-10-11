import React, { useState } from "react";
import { Button } from "primereact/button";
import { toJS } from "mobx";

import { useStores } from "../../../context/use-stores";
import { canEditHierarchy } from "../../../utils/hierarchy";
import { renameOGRequest } from "../../../service/AppliesService";

const FullHierarchyInformationFooter = ({ isEdit, closeFullDetailsModal, setIsEdit, form, openDeleteModal }) => {
  const { userStore } = useStores();
  const connectedUser = toJS(userStore.user);

  const saveForm = async () => {
    let tempForm = { ...form };

    const kartoffelParams = {
      id: tempForm.id,
      name: tempForm.name,
    };

    // ASK: if this is correct
    const adParams = {
      ouDisplayName: `${tempForm.hierarchyPrefix}/${tempForm.name}`,
      oldOuName: tempForm.oldName,
      newOuName: tempForm.name,
    };

    const res = await renameOGRequest({
      kartoffelParams,
      adParams,
    });

    // TODO: DO SOMETHING AND TRY AND CATCH
  };

  return (
    <>
      <div className="display-flex">
        <Button label="מחיקה" onClick={openDeleteModal} className="p-button p-component btn-border" />
        <div className="display-flex">
          {canEditHierarchy(connectedUser) && (
            <Button
              label={isEdit ? "ביטול" : "עריכה"}
              className={isEdit ? "btn-underline" : "btn-border orange"}
              onClick={() => setIsEdit(!isEdit)}
            />
          )}

          <Button
            label={isEdit ? "שליחת בקשה" : "סגור"}
            className="btn-orange-gradient"
            onClick={isEdit ? saveForm : closeFullDetailsModal}
          />
        </div>
      </div>
    </>
  );
};

export { FullHierarchyInformationFooter };
