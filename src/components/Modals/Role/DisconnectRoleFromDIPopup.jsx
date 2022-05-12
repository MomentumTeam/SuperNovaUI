import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { disconectRoleFromEntityRequest } from "../../../service/AppliesService";
import { getSamAccountNameFromEntity } from "../../../utils/fields";

const DisconnectRoleFromDIPopup = ({
  disconectRoleFromEntityApply,
  showModal,
  closeModal,
  role,
  entity,
}) => {
  const disconnectRoleFromDI = async () => {
    try {
      const submittedBy = {
        id: entity.id,
        displayName: entity.displayName,
      };
      const kartoffelParams = {
        id: entity.id,
        uniqueId: role.roleId,
      };

      const samAccountName = getSamAccountNameFromEntity(entity);

      const response = await disconectRoleFromEntityApply({
        submittedBy,
        kartoffelParams,
        adParams: { samAccountName },
      });
    } catch (error) {
      console.log(error);
    }

    closeModal();
  };

  return (
    <div>
      <Dialog
        id="disconnectRoleFromEntityDialog"
        header="ניתוק משתמש מתפקיד"
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
        <div id="confirmDialogButtons">
          <Button onClick={disconnectRoleFromDI}>כן, הסר לי את ההרשאה</Button>
          <Button
            className="p-button-raised p-button-danger"
            onClick={() => {
              closeModal();
            }}
          >
            לא, תשאיר לי את ההרשאה
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default DisconnectRoleFromDIPopup;
