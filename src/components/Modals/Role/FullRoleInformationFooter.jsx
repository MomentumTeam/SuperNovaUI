import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "primereact/button";
import { toJS } from "mobx";

import { useStores } from "../../../context/use-stores";
import { canEditRole } from "../../../utils/roles";

const FullRoleInformationFooter = ({ isEdit, role, closeModal, setIsEdit, actionPopup }) => {
  const [disabled, setDisabled] = useState(true);
  const { formState, getValues, watch, reset, clearErrors } = useFormContext();
  const { userStore, appliesStore } = useStores();
  const { errors } = formState;
  const watchFields = watch(["role", "approvers"]);

  const newJobTitle = getValues("role");
  const connectedUser = toJS(userStore.user);

  useEffect(() => {
    Object.keys(errors).length > 0 || !newJobTitle || role.jobTitle === newJobTitle
      ? setDisabled(true)
      : setDisabled(false);
  }, [watchFields, isEdit]);


  const saveForm = async () => {
    const kartoffelParams = {
      roleId: role.roleId,
      jobTitle: newJobTitle,
    };

    // ASK: if this is correct
    const adParams = {
      samAccountName: role.digitalIdentityUniqueId,
      jobTitle: newJobTitle,
    };

    try {
      const res = await appliesStore.renameRoleApply({ kartoffelParams, adParams });
      actionPopup();
      closeModal();
    } catch (error) {
      actionPopup(error);
    }
  };

  return (
    <div className="display-flex">
      <div></div>
      {/* <Button label="מחיקה" onClick={() => this.onChange(false)} className="p-button p-component btn-border" /> */}
      <div className="display-flex">
        {canEditRole(role, connectedUser) && (
          <Button
            label={isEdit ? "ביטול" : "עריכה"}
            className={isEdit ? "btn-underline" : "btn-border orange"}
            onClick={() => {
              setIsEdit(!isEdit)
              reset({ role: role.jobTitle, approvers: undefined });
              clearErrors();
            }}
          />
        )}

        <Button
          label={isEdit ? "שליחת בקשה" : "סגור"}
          disabled={isEdit ? disabled : false}
          className="btn-orange-gradient"
          onClick={isEdit ? saveForm : closeModal}
        />
      </div>
    </div>
  );
};

export { FullRoleInformationFooter };
