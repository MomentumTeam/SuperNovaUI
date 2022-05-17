import React from "react";
import { Button } from "primereact/button";
import { disconectRoleFromEntityRequest } from "../../../service/AppliesService";

const DisconnectRoleFromEntityFooter = ({ user, role, samAccountName, entity, closeModal }) => {
  const sendForm = async () => {

    const req = {
      submittedBy: { id: user.id, displayName: user.displayName },
      kartoffelParams: {
        id: entity.id,
        uniqueId: role.roleId,
      },
      adParams: {
        samAccountName,
      },
    };

    const res = await disconectRoleFromEntityRequest(req);
  };

  return (
    <div className="display-flex display-flex-end">
      <Button label="ביטול" onClick={closeModal} className="btn-underline" />
      <Button
        label="מחיקה"
        onClick={() => {
          sendForm();
          closeModal();
        }}
        className={"btn-gradient red"}
      />
    </div>
  );
};

export { DisconnectRoleFromEntityFooter };
