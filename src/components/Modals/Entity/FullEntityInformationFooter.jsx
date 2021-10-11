import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { toJS } from "mobx";

import { useStores } from "../../../context/use-stores";
import { canEditEntity, getSamAccountName } from "../../../utils/entites";
import datesUtil from "../../../utils/dates";

const FullEntityInformationFooter = ({ isEdit, user, closeFullDetailsModal, setIsEdit, form }) => {
  const { userStore, appliesStore } = useStores();
  const [isChanged, setIsChanged] = useState(false);

  const connectedUser = toJS(userStore.user);

  useEffect(() => {
    JSON.stringify(form) === JSON.stringify(user) ? setIsChanged(false) : setIsChanged(true);
  }, [form, user, isEdit]);

  const saveForm = async () => {
    let tempForm = { ...form };
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
    };

    const samAccountName = getSamAccountName(tempForm);

    const res = await appliesStore.editEntityApply({
      kartoffelParams,
      adParams: {
        samAccountName: samAccountName,
        firstName: tempForm.firstName,
        lastName: tempForm.lastName,
        fullName: tempForm.fullName,
      },
    });

    // TODO: DO SOMETHING AND TRY AND CATCH
  };

  return (
    <div className="display-flex display-flex-end">
      {canEditEntity(user, connectedUser) ? (
        <>
          <Button
            label={isEdit ? "ביטול" : "עריכה"}
            className={isEdit ? "btn-underline" : "btn-border orange"}
            onClick={() => setIsEdit(!isEdit)}
          />
          <Button
            label={isEdit ? "שליחת בקשה" : "סגור"}
            disabled={isEdit ? (isChanged ? false : true) : false}
            className="btn-orange-gradient"
            onClick={() => {
              if (isEdit) saveForm();
              closeFullDetailsModal();
            }}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export { FullEntityInformationFooter };
