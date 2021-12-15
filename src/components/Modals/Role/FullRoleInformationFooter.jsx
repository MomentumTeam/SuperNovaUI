import React from "react";
import { Button } from "primereact/button";
import { toJS } from "mobx";

import { useStores } from "../../../context/use-stores";
import { canEditRole } from "../../../utils/roles";

const FullRoleInformationFooter = ({ isEdit, role, closeModal, setIsEdit, handleRequest, resetForm }) => {
  const { userStore } = useStores();
  const connectedUser = toJS(userStore.user);

  return (
    <div className="display-flex">
      <div></div>
      <div className="display-flex">
        {canEditRole(role, connectedUser) && (
          <Button
            label={isEdit ? "ביטול" : "עריכה"}
            className={isEdit ? "btn-underline" : "btn-border orange"}
            onClick={() => {
              if (isEdit) resetForm();
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
  );
};


export { FullRoleInformationFooter };
