import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

import blankProfilePic from "../../../assets/images/blankProfile.png";
import { getPictureByEntityId } from "../../../service/UserService";
import { FullEntityInformationFooter } from "./FullEntityInformationFooter";
import { CanSeeUserClearance } from "../../../utils/entites";
import { InputTextField } from "../../Fields/InputText";
import { InputCalanderField } from "../../Fields/InputCalander";
import { InputDropdown } from '../../Fields/InputDropdown';
import { USER_CLEARANCE, USER_NO_PICTURE } from "../../../constants";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";

const FullEntityInformationModal = ({ user, isOpen, closeFullDetailsModal, edit }) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [userData, setUserData] = useState(user);
  const [form, setForm] = useState(user);

  useEffect(async () => {
    if (user.id && (user.picture === USER_NO_PICTURE || user.picture === undefined)) {
      // TODO: api for get entity picture by id (and not just for me)
      let tempUser = { ...user };
      const pic = await getPictureByEntityId();
      tempUser.picture = pic.image;
      setUserData(tempUser);
    }
  }, [user]);

  useEffect(() => {
    setForm(user);
  }, [isEdit]);

  return (
    <Dialog
      className={classNames("dialogClass7")}
      header={isEdit ? "עריכת משתמש/ת" : "פרטי משתמש/ת"}
      visible={isOpen}
      style={{ borderRadius: "30px" }}
      onHide={closeFullDetailsModal}
      footer={
        <FullEntityInformationFooter
          isEdit={isEdit}
          user={userData}
          closeFullDetailsModal={closeFullDetailsModal}
          setIsEdit={setIsEdit}
          form={form}
        />
      }
    >
      <div>
        <div className="userpic-wrap">
          <img
            style={{ borderRadius: "50%", width: "142px" }}
            src={
              userData && userData.picture !== USER_NO_PICTURE
                ? `data:image/jpeg;base64,${userData.picture}`
                : blankProfilePic
            }
            alt="userpic"
          />
        </div>
        <div className="p-fluid">
          {InputTextField({
            fieldName: "firstName",
            displayName: "שם פרטי",
            canEdit: true,
            isEdit: isEdit,
            item: userData,
            form: form,
            setForm: setForm,
          })}
          {InputTextField({
            fieldName: "lastName",
            displayName: "שם משפחה",
            canEdit: true,
            isEdit: isEdit,
            item: userData,
            form: form,
            setForm: setForm,
          })}
          {userData.personalNumber &&
            InputTextField({
              fieldName: "personalNumber",
              displayName: 'מ"א',
              canEdit: false,
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
              type: "num",
              keyFilter: "num",
            })}
          {userData.identityCard &&
            InputTextField({
              fieldName: "identityCard",
              displayName: 'ת"ז',
              canEdit: true,
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
              type: "num",
              keyfilter: "num",
            })}
          {userData.rank &&
            InputTextField({
              fieldName: "rank",
              displayName: "דרגה",
              canEdit: false,
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
            })}
          {userData.hierarchy &&
            InputTextField({
              fieldName: "hierarchy",
              displayName: "היררכיה",
              canEdit: false,
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
            })}
          {userData.mail &&
            InputTextField({
              fieldName: "mail",
              displayName: "מייל",
              canEdit: false,
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
            })}
          {userData.jobTitle &&
            InputTextField({
              fieldName: "jobTitle",
              displayName: "תפקיד",
              canEdit: false,
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
            })}
          {userData.address &&
            InputTextField({
              fieldName: "address",
              displayName: "כתובת",
              canEdit: false,
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
            })}
          {userData?.phone &&
            InputTextField({
              fieldName: "phone",
              displayName: "טלפון",
              canEdit: true,
              type: "num",
              keyfilter: "num",
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
            })}

          {userData.birthDate &&
            InputCalanderField({
              fieldName: "birthDate",
              displayName: "תאריך לידה",
              canEdit: false,
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
            })}
          {userData.dischargeDay &&
            InputCalanderField({
              fieldName: "dischargeDay",
              displayName: 'תק"ש',
              canEdit: false,
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
            })}

          {CanSeeUserClearance() &&
            InputDropdown({
              fieldName: "clearance",
              displayName: "סיווג",
              canEdit: true,
              isEdit: isEdit,
              item: userData,
              form: form,
              setForm: setForm,
              options: USER_CLEARANCE,
            })}
        </div>
      </div>
    </Dialog>
  );
};

export default FullEntityInformationModal;
