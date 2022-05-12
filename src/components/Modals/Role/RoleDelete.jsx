import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

import { RoleDeleteFooter } from "./RoleDeleteFooter";
import { deleteRoleRequest } from "../../../service/AppliesService";

import "../../../assets/css/local/components/modal-item.css";
import { getSamAccountNameFromUniqueId } from "../../../utils/fields";
import { getEntityByRoleId } from "../../../service/KartoffelService";

const RoleDelete = ({ role, isDialogVisible, setDialogVisiblity, actionPopup }) => {
  const [actionIsDone, setActionIsDone] = useState(false);
  const [entity, setEntity] = useState(null);

  useEffect(() => {
    if (actionIsDone) {
      actionPopup();
      setActionIsDone(false);
      setDialogVisiblity(false);
    }
  }, [actionIsDone]);

  useEffect(() => {
    const getEntity = async() => {
      try {
        const entityRes = await getEntityByRoleId(role?.roleId);
        setEntity(entityRes);
      } catch (error) {}
    }

    getEntity();
  }, [role]);
  
  const handleRequest = async () => {
    try {
        const req = {
          kartoffelParams: {
            roleId: role.roleId,
            uniqueId: role.digitalIdentityUniqueId,
            jobTitle: role.jobTitle,
            ...(entity?.firstName && { firstName: entity.firstName }),
            ...(entity?.lastName && { lastName: entity.lastName }),
            ...(entity?.personalNumber && { personalNumber: entity.personalNumber }),
            ...(entity?.identityCard && { identityCard: entity.identityCard }),
          },
          adParams: {
            samAccountName: getSamAccountNameFromUniqueId(role.roleId),
          },
        };

        const res = await deleteRoleRequest(req);
        setActionIsDone(true)
    } catch (e) {
      actionPopup("מחיקת תפקיד", e);
    }
  };

  return (
    <div>
      <Dialog
        className={`${classNames("dialogClass12")} dialogdelete`}
        header="מחיקת תפקיד"
        visible={isDialogVisible}
        footer={<RoleDeleteFooter closeModal={() => setDialogVisiblity(false)} deleteHierarchy={handleRequest} />}
        onHide={() => setDialogVisiblity(false)}
        dismissableMask={true}
      >
        <div className="container display-flex display-flex-center delete-container">
          <div>
            <p>האם את/ה בטוח/ה שברצונך למחוק תפקיד זה?</p>
            <p>מחיקת תפקיד תגרום לאובדן הT הנבחר, למחיקת כל המידע שנמצא תחת הT ולניתוק המשתמש הנמצא עליו.</p>

            <p style={{ fontWeight: "bold" }}>לאחר המחיקה, אין אופציה לשחזור המידע שהיה לT!</p>
            <p>(הרשאות, תיקיות, קבצים שמורים, תיבת מייל וכו')</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export { RoleDelete };
