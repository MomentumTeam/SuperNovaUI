import React from "react";
import { Button } from "primereact/button";

const DisconnectRoleFromEntityFooter = ({
  disconnectRole,
  closeModal,
}) => {

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
