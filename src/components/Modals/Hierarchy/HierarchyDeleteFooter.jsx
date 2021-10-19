import React from "react";
import { Button } from "primereact/button";
import { deleteOGRequest } from '../../../service/AppliesService';
import { getHierarchy } from '../../../utils/hierarchy';

const HierarchyDeleteFooter = ({closeModal, item, disabled}) => {
  const sendForm = async() => {
    const kartoffelParams = {
        id: item.id,
    };
    
    // TODO: ?
    const {hierarchyName} =  getHierarchy(item.hierarchy)
    const adParams = {
        ouDisplayName: item.hierarchy,
        ouName: "dd",
        name: hierarchyName,
    };

    // TODO: TOAST
    const res = await deleteOGRequest({ kartoffelParams: kartoffelParams, adParams: adParams });
  }  

  return (
    <div className="display-flex display-flex-end">
      <Button label="ביטול" onClick={closeModal} className="btn-underline" />
      <Button
        disabled={disabled}
        label="מחיקה"
        onClick={() => {
          sendForm();
          closeModal();
        }}
        className={disabled ? "btn-gradient gray" : "btn-gradient red"}
      />
    </div>
  );
};

export { HierarchyDeleteFooter };
