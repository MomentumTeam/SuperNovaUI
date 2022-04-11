import React from "react";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";

import { Dialog } from "primereact/dialog";

const ConfirmRemovalPopUp = ({
  showModal,
  closeModal,
  dismissApproverFromHierarchy,
}) => {
  return (
    <Dialog
      id="confirmDialog"
      className={classNames("dialogClassConfirm")}
      visible={showModal}
      onHide={closeModal}
      showHeader={false}
    >
      <h3>האם אתה בטוח?</h3>
      <p>הסרת השראות מסוג זה יורידו לך יכולות במערכת לגו</p>
      <div id="confirmDialogButtons">
        <Button
          className="p-button-raised p-button-danger"
          onClick={dismissApproverFromHierarchy}
        >
          כן, הסר לי את ההרשאה
        </Button>
        <Button
          onClick={() => {
            closeModal();
          }}
        >
          לא, תשאיר לי את ההרשאה
        </Button>
      </div>
    </Dialog>
  );
};

export default ConfirmRemovalPopUp;
