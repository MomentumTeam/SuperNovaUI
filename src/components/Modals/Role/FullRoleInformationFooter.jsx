import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { toJS } from "mobx";

import { useStores } from "../../../context/use-stores";
import { canEditRole } from "../../../utils/roles";

const FullRoleInformationFooter = ({ isEdit, role, closeModal, setIsEdit, form }) => {
  const [isChanged, setIsChanged] = useState(false);
  const { userStore, appliesStore } = useStores();
  const connectedUser = toJS(userStore.user);

  const roleNameIsTheSame = form.jobTitle.length <= 0 || role.jobTitle === form.jobTitle;
  
  useEffect(() => {
    roleNameIsTheSame ? setIsChanged(false) : setIsChanged(true);
  }, [role, form, isEdit]);

  const saveForm = async () => {
    let tempForm = { ...form };

    if (!roleNameIsTheSame) {
      const kartoffelParams = {
        roleId: tempForm.roleId,
        jobTitle: tempForm.jobTitle,
      };

      // ASK: if this is correct
      const adParams = {
        samAccountName: tempForm.digitalIdentityUniqueId,
        jobTitle: tempForm.jobTitle,
      };

      // TODO: edit role classification
      const res = await appliesStore.renameRoleApply({ kartoffelParams, adParams });
    }

    // TODO: DO SOMETHING AND TRY AND CATCH
  };

  return (
    <div className="display-flex">
      <Button label="מחיקה" onClick={() => this.onChange(false)} className="p-button p-component btn-border" />
      <div className="display-flex">
        {canEditRole(role, connectedUser) && (
          <Button
            label={isEdit ? "ביטול" : "עריכה"}
            className={isEdit ? "btn-underline" : "btn-border orange"}
            onClick={() => setIsEdit(!isEdit)}
          />
        )}

        <Button
          label={isEdit ? "שליחת בקשה" : "סגור"}
          disabled={isEdit ? (isChanged ? false : true) : false}
          className="btn-orange-gradient"
          onClick={isEdit ? saveForm : closeModal}
        />
      </div>
    </div>
  );
};

export { FullRoleInformationFooter };
