import React from "react";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { removeAsApproverFromHierarchy } from "../../../service/ApproverService";
import { getUserTags } from "../../../utils/user";

const PremissionsRemovalPopUp = ({
  showModal,
  closeModal,
  currentHierarchyForRemoval,
  user,
  premissions,
  approverTypes,
  setPremissions,
  setApproverTypes,
  updateUserPremissions,
}) => {
  const { hierarchyToRemove, approverType } = currentHierarchyForRemoval;
  const dismissApproverFromHierarchy = async () => {
    try {
      const response = await removeAsApproverFromHierarchy(
        user.id,
        approverType,
        hierarchyToRemove.id
      );

      setPremissions(() => {
        premissions[approverType] = premissions[approverType].filter(
          (premission) => premission.id !== hierarchyToRemove.id
        );
        if (premissions[approverType].length === 0)
          delete premissions[approverType];
        return { ...premissions };
      });

      setApproverTypes(() => {
        return approverTypes.filter((type) => type !== approverType);
      });
      updateUserPremissions();
    } catch (err) {
      console.log(err);
    }
    closeModal();
  };

  return (
    <Dialog
      id="confirmDialog"
      className={classNames("dialogClassConfirm")}
      visible={showModal}
      onHide={closeModal}
      showHeader={false}
    >
      <h3>האם אתה בטוח?</h3>
      {approverType && (
        <p style={{ fontSize: "18px"  }}>
          האם להוריד לך את ההרשאות של <b>{getUserTags([approverType])[0]}</b>
          {hierarchyToRemove ? <>  עבור ההיררכיה:{" "}
          <b style={{wordBreak: "break-all"}}>{hierarchyToRemove?.hierarchy + "/" + hierarchyToRemove?.name}</b>?</> : <>?</> }
        </p>
      )}
      <p style={{ fontSize: "18px" }}>
        הסרת השראות מסוג זה יורידו לך יכולות במערכת לגו
      </p>

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

export default PremissionsRemovalPopUp;
