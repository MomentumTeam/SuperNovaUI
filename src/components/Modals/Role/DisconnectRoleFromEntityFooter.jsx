import React from "react";
import { Button } from "primereact/button";
import { disconectRoleFromEntityRequest } from "../../../service/AppliesService";

const DisconnectRoleFromEntityFooter = ({
  user,
  role,
  samAccountName,
  entity,
  closeModal,
}) => {
  const disconnectRole = async () => {
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
    <div className="display-flex ">
      <Button
        label={"כן, נתק את המשתמש"}
        onClick={() => disconnectRole()}
        className="btn-gradient cyon"
      />
      <Button
        label="לא, אל תנתק!"
        onClick={closeModal}
        className="btn-gradient red"
      />
    </div>
  );
};

export { DisconnectRoleFromEntityFooter };
