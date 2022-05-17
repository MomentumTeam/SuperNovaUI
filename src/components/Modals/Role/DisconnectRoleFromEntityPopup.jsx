import React from "react";
import { Dialog } from "primereact/dialog";
import { DisconnectRoleFromEntityFooter } from "./DisconnectRoleFromEntityFooter";

const DisconnectRoleFromEntityPopup = ({
  user,
  role,
  entity,
  samAccountName,
  showModal,
  closeModal,
}) => {
  return (
    <div>
      <Dialog
        id="disconnectRoleFromEntityDialog"
        header="ניתוק משתמש מתפקיד"
        footer={
          <DisconnectRoleFromEntityFooter
            user={user}
            role={role}
            entity={entity}
            samAccountName={samAccountName}
            closeModal={closeModal}
          />
        }
        visible={showModal}
        modal
        onHide={closeModal}
        closable={false}
        style={{ height: "310px", width: "30vw" }}
      >
        <p style={{ textAlign: "center", fontSize: "18px", padding: "10px" }}>
          האם את\ה בטוח\ה?
          <br></br>
          ניתוק המשתמש מהתפקיד ימנע ממנו להתחבר לעמדה ולהמשיך בעבודתו
          <br></br>
          התפקיד הנבחר לאחר הניתוק ישאר ריק(פנוי)
        </p>
      </Dialog>
    </div>
  );
};

export default DisconnectRoleFromEntityPopup;
