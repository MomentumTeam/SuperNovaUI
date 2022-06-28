import React from "react";
import { Button } from "primereact/button";

const HierarchyDeleteFooter = ({ closeModal, deleteHierarchy }) => {
  return (
    <div className="display-flex ">
      <Button
        label={"כן, ההיררכיה ריקה. אנא מחקו אותה."}
        onClick={() => deleteHierarchy()}
        className="btn-gradient cyon"
      />
      <Button label="לא, אל תמחקו את ההיררכיה!" onClick={closeModal} className="btn-gradient red" />
    </div>
  );
};

export { HierarchyDeleteFooter };
