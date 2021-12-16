import React from "react";
import { Button } from "primereact/button";
import { toJS } from "mobx";

import { useStores } from "../../../context/use-stores";
import { canEditHierarchy } from "../../../utils/hierarchy";

const FullHierarchyInformationFooter = ({ isEdit, closeModal, setIsEdit, handleRequest }) => {
  const { userStore } = useStores();
  const connectedUser = toJS(userStore.user);

  return (
    <>
      <div className="display-flex">
        <div></div>
        {/* <Button label="מחיקה" onClick={openDeleteModal} className="p-button p-component btn-border" /> */}
        <div className="display-flex">
          {canEditHierarchy(connectedUser) && (
            <Button
              label={isEdit ? "ביטול" : "עריכה"}
              className={isEdit ? "btn-underline" : "btn-border orange"}
              onClick={() => {
                // if (isEdit) resetForm();
                setIsEdit(!isEdit);
              }}
            />
          )}

          <Button
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
