import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { toJS } from "mobx";

import { useStores } from "../../../context/use-stores";
import { canEditEntity } from "../../../utils/entites";

const FullEntityInformationFooter = ({ entity, isEdit, closeModal, setIsEdit, handleRequest }) => {
  const { userStore } = useStores();
  const connectedUser = toJS(userStore.user);

  const closeThisModal = () => {
    setIsEdit(false);
    closeModal();
  }
  return (
    <div className="display-flex display-flex-end">
      {canEditEntity(entity, connectedUser) && (
        <>
          <Button
            id="fullEntityInfo-editOrCancel"
            label={isEdit ? "ביטול" : "עריכה"}
            className={isEdit ? "btn-underline" : "btn-border orange"}
            onClick={() => setIsEdit(!isEdit)}
          />
          <Button
            id="fullEntityInfo-closeOrSave"
            label={isEdit ? "שליחת בקשה" : "סגור"}
            className="btn-orange-gradient"
            onClick={() => {
              isEdit ? handleRequest() : closeThisModal();
            }}
          />
        </>
      )}
    </div>
  );
};

export { FullEntityInformationFooter };
