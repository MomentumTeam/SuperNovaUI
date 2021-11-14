import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import { HierarchyDeleteFooter } from './HierarchyDeleteFooter';

import "../../../assets/css/local/components/modal-item.css";
const HierarchyDelete = ({ hierarchy, isOpen, closeModal }) => {
  const [disabled, setDisabled] = useState(true);
  const [reason, setReason] = useState("");

  useEffect(() => {
    (reason &&  reason.length > 0)? setDisabled(false): setDisabled(true);
  }, [reason]);

  return (
    <div>
      <Dialog
        className={classNames("dialogClass5")}
        header="מחיקת היררכיה"
        visible={isOpen}
        footer={<HierarchyDeleteFooter closeModal={closeModal} item={hierarchy} disabled={disabled} />}
        onHide={closeModal}
        dismissableMask={true}
      >
        <div className="container">
          <div>
            <p>האם את/ה בטוח/ה שברצונך למחוק היררכיה זו?</p>
            <p style={{ fontWeight: "bold" }}> מחיקת ההיררכיה תוביל למחיקת כל התפקידים בהיררכיה!</p>
          </div>
          <div className="p-fluid container">
            <div className="p-fluid-item">
              <div className="p-field">
                <label htmlFor="2011">הערה</label>
                <InputTextarea id="2011" className="InputReason" type="text" value={reason} onChange={e=> setReason(e.target.value)}/>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export { HierarchyDelete };
