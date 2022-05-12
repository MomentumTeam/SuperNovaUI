import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

import { HierarchyDeleteFooter } from './HierarchyDeleteFooter';
import { getOuDisplayName, hierarchyConverse } from "../../../utils/hierarchy";
import { deleteOGRequest } from "../../../service/AppliesService";

import "../../../assets/css/local/components/modal-item.css";

const HierarchyDelete = ({ hierarchy, isDialogVisible, setDialogVisiblity, actionPopup }) => {
  const [actionIsDone, setActionIsDone] = useState(false);

  useEffect(() => {
    if (actionIsDone) {
      actionPopup();
      setActionIsDone(false);
      setDialogVisiblity(false);
    }
  }, [actionIsDone]);


  const handleRequest = async () => {
    try {        
        const req = {
          adParams: {
            ouDisplayName: getOuDisplayName(hierarchy.hierarchy, hierarchy.name),
          },
          kartoffelParams: {
            id: hierarchy.id,
            name: hierarchyConverse(hierarchy)
          },
        };
    

        const res = await deleteOGRequest(req);
        setActionIsDone(true)
    } catch (e) {
      actionPopup("מחיקת היררכיה", e);
    }
  };

  return (
    <div>
      <Dialog
        className={`${classNames("dialogClass5")} dialogdelete`}
        header="מחיקת היררכיה"
        visible={isDialogVisible}
        footer={<HierarchyDeleteFooter closeModal={() => setDialogVisiblity(false)} deleteHierarchy={handleRequest} />}
        onHide={() => setDialogVisiblity(false)}
        dismissableMask={true}
      >
        <div className="container display-flex display-flex-center delete-container">
          <div>
            <p>האם את/ה בטוח/ה שברצונך למחוק היררכיה זו?</p>
            <p>מחיקת היררכיה מתאפשרת רק אם ההיררכיה ריקה מתפקידים והיררכיות בתוכה ותחתיה.</p>

            <p style={{ fontWeight: "bold" }}>מחיקת היררכיה תסיר את היררכיה זו מהעץ הארגוני!</p>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export { HierarchyDelete };
