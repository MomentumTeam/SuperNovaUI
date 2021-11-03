import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "primereact/button";
import { toJS } from "mobx";

import { useStores } from "../../../context/use-stores";
import { canEditHierarchy, getHierarchy } from "../../../utils/hierarchy";

const FullHierarchyInformationFooter = ({ isEdit, closeModal, setIsEdit, openDeleteModal, hierarchy, actionPopup }) => {
  const { formState, getValues, watch, reset } = useFormContext();
  const { userStore,appliesStore } = useStores();
  const [disabled, setDisabled] = useState(false);

  const { errors } = formState;
  const watchFields = watch(["hierarchyName", "approvers"]);
  const { hierarchyReadOnly, hierarchyName } = getHierarchy(hierarchy.hierarchy);
  const newHierarchyName = getValues("hierarchyName");
  const connectedUser = toJS(userStore.user);

  useEffect(() => {
    Object.keys(errors).length > 0 || hierarchyName === newHierarchyName || newHierarchyName === undefined
      ? setDisabled(true)
      : setDisabled(false);
  }, [watchFields, isEdit]);

  const saveForm = async () => {
    const kartoffelParams = {
      id: hierarchy.id,
      name: newHierarchyName,
    };

    // ASK: if this is correct
    const adParams = {
      ouDisplayName: `${hierarchyReadOnly}/${newHierarchyName}`,
      oldOuName: hierarchyName,
      newOuName: newHierarchyName,
    };

    try {
      const res = await appliesStore.renameOGApply({
        kartoffelParams,
        adParams,
      });
      actionPopup();
      closeModal();
    } catch (error) {
      actionPopup(error);
    }
  };

  return (
    <>
      <div className="display-flex">
        <div></div>
        {/* <Button label="מחיקה" onClick={openDeleteModal} className="p-button p-component btn-border" /> */}
        <div className="display-flex">
          {canEditHierarchy(connectedUser) && (
            <Button
              label={isEdit ? "ביטול" : "עריכה"}
              className={isEdit ? "btn-underline" : "btn-border orange"}
              onClick={() => {
                setIsEdit(!isEdit);
                reset({ hierarchyName: hierarchyName });
              }}
            />
          )}

          <Button
            label={isEdit ? "שליחת בקשה" : "סגור"}
            className="btn-orange-gradient"
            disabled={isEdit ? disabled : false}
            onClick={isEdit ? saveForm : closeModal}
          />
        </div>
      </div>
    </>
  );
};

export { FullHierarchyInformationFooter };
