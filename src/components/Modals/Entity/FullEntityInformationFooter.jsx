import React, { useContext, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { toJS } from "mobx";

import datesUtil from "../../../utils/dates";
import { useStores } from "../../../context/use-stores";
import { canEditEntity, getSamAccountName } from "../../../utils/entites";
import { FullEntityInformationModalContext } from "./FullEntityInformationModal";

const FullEntityInformationFooter = () => {
  const { isEdit, user, closeFullDetailsModal, setIsEdit, form, actionPopup, errors } = useContext(
    FullEntityInformationModalContext
  );
  const { userStore, appliesStore } = useStores();
  const [disabled, setDisabled] = useState(false);

  const connectedUser = toJS(userStore.user);

  useEffect(() => {
    Object.keys(errors).length === 0 && Object.keys(form).length > 0 ? setDisabled(false) : setDisabled(true);
  }, [form, user, isEdit]);

  const saveForm = async () => {
    let tempForm = { ...user, ...form };
    tempForm.fullName = `${tempForm.firstName} ${tempForm.lastName}`;

    const kartoffelParams = {
      id: tempForm.id,
      firstName: tempForm.firstName,
      lastName: tempForm.lastName,
      personalNumber: tempForm.personalNumber,
      serviceType: tempForm.serviceType,
      address: tempForm.address,
      clearance: tempForm.clearance,
      sex: tempForm.sex,
      birthdate: datesUtil.getTime(tempForm.birthDate),
      entityType: tempForm.entityType,
      identityCard: tempForm.identityCard
    };

    const samAccountName = getSamAccountName(tempForm);

    try {
      const res = await appliesStore.editEntityApply({
        kartoffelParams,
        adParams: {
          samAccountName: samAccountName,
          firstName: tempForm.firstName,
          lastName: tempForm.lastName,
          fullName: tempForm.fullName,
        },
      });
      actionPopup("עריכת משתמש");
      closeFullDetailsModal();
    } catch (error) {
      actionPopup("עריכת משתמש", error);
    }
  };

  return (
    <div className="display-flex display-flex-end">
      {canEditEntity(user, connectedUser) &&
        <>
          <Button
            label={isEdit ? "ביטול" : "עריכה"}
            className={isEdit ? "btn-underline" : "btn-border orange"}
            onClick={() => setIsEdit(!isEdit)}
          />
          <Button
            label={isEdit ? "שליחת בקשה" : "סגור"}
            disabled={isEdit ? disabled : false}
            className="btn-orange-gradient"
            onClick={() => {
              if (isEdit) saveForm();
              closeFullDetailsModal();
            }}
          />
        </>
      }
    </div>
  );
};

export { FullEntityInformationFooter };
