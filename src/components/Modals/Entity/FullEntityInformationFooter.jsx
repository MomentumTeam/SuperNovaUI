import { Button } from "primereact/button";
import { toJS } from "mobx";

import { useStores } from "../../../context/use-stores";
import { canEditEntity, getSamAccountName } from "../../../utils/entites";
import { editEntityRequest } from '../../../service/AppliesService';
import datesUtil from "../../../utils/dates";

const FullEntityInformationFooter = ({ isEdit, user, closeFullDetailsModal, setIsEdit, form }) => {
  const { userStore } = useStores();
  const connectedUser = toJS(userStore.user);

  const saveForm = async() => {
    let tempForm = { ...form };
    tempForm.fullName =`${tempForm.firstName} ${tempForm.lastName}`;

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

    const res = await editEntityRequest({
      kartoffelParams,
      adParams: {
        samAccountName: samAccountName,
        firstName: tempForm.firstName,
        lastName: tempForm.lastName,
        fullName: tempForm.fullName,
      },
    });

    // TODO: DO SOMETHING AND TRY AND CATCH
  }
  return (
    <div className="display-flex display-flex-end">
      {canEditEntity(user, connectedUser) ? (
        <>
          <Button
            label={isEdit ? "ביטול" : "עריכה"}
            className={isEdit ? "btn-underline" : "btn-border orange"}
            onClick={() => setIsEdit(!isEdit)}
          />
          <Button label={isEdit ? "שליחת בקשה" : "סגור"} className="btn-orange-gradient" onClick={isEdit? saveForm :closeFullDetailsModal} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export { FullEntityInformationFooter };
