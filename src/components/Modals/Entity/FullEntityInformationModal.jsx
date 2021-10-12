import React, { createContext, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

import blankProfilePic from "../../../assets/images/blankProfile.png";
import { getPictureByEntityId } from "../../../service/UserService";
import { FullEntityInformationFooter } from "./FullEntityInformationFooter";
import { CanSeeUserClearance } from "../../../utils/entites";
import { InputTextField } from "../../Fields/InputText";
import { InputCalanderField } from "../../Fields/InputCalander";
import { InputDropdown } from "../../Fields/InputDropdown";
import { USER_CLEARANCE, USER_NO_PICTURE } from "../../../constants";
import { validateName, validatePhoneNumber } from "../../../utils/validators";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";

export const FullEntityInformationModalContext = createContext(null);

const FullEntityInformationModal = ({ user, isOpen, closeFullDetailsModal, edit, actionPopup }) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [userData, setUserData] = useState(user);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const changeErrors = (fieldName, isError, error = null) => {
    let tempErrors = { ...errors };
    if (isError) {
      tempErrors[fieldName] = error;
    } else {
      delete tempErrors[fieldName];
    }
    setErrors(tempErrors);
  };

  const changeForm = (fieldName, value) => {
    let tempForm = { ...form };
    if (value !== "") {
      tempForm[fieldName] = value;
    } else {
      delete tempForm[fieldName];
    }
    setForm(tempForm);
  };

  useEffect(() => {
    async function getUserPic() {
      if (user.id && (user.picture === USER_NO_PICTURE || user.picture === undefined)) {
        // TODO: api for get entity picture by id (and not just for me)
        let tempUser = { ...user };
        const pic = await getPictureByEntityId();
        tempUser.picture = pic.image;
        setUserData(tempUser);
      }
    }

    getUserPic();
  }, [user]);

  useEffect(() => {
    setForm({});
    setErrors({});
  }, [isEdit]);

  return (
    <FullEntityInformationModalContext.Provider
      value={{ form, isEdit, setIsEdit, actionPopup, user, closeFullDetailsModal, errors, changeErrors }}
    >
      <Dialog
        className={classNames("dialogClass7")}
        header={isEdit ? "עריכת משתמש/ת" : "פרטי משתמש/ת"}
        visible={isOpen}
        style={{ borderRadius: "30px" }}
        onHide={closeFullDetailsModal}
        footer={<FullEntityInformationFooter />}
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
              item: userData,
              canEdit: true,
              isEdit: isEdit,
              setForm: changeForm,
              validator: validateName,
              errors: errors,
              changeErrors: changeErrors,
            })}
            {InputTextField({
              fieldName: "lastName",
              displayName: "שם משפחה",
              item: userData,
              canEdit: true,
              isEdit: isEdit,
              errors: errors,
              setForm: changeForm,
              validator: validateName,
              changeErrors: changeErrors,
            })}
            {userData.personalNumber &&
              InputTextField({
                fieldName: "personalNumber",
                displayName: 'מ"א',
                item: userData,
              })}

            {InputTextField({
              fieldName: "identityCard",
              displayName: 'ת"ז',
              type: "num",
              keyFilter: "num",
              item: userData,
              canEdit: true,
              isEdit: isEdit,
              errors: errors,
              setForm: changeForm,
              changeErrors: changeErrors,
            })}

            {userData.rank &&
              InputTextField({
                fieldName: "rank",
                displayName: "דרגה",
                item: userData,
              })}

            {userData.hierarchy &&
              InputTextField({
                fieldName: "hierarchy",
                displayName: "היררכיה",
                item: userData,
              })}

            {userData.mail &&
              InputTextField({
                fieldName: "mail",
                displayName: "מייל",
                item: userData,
              })}

            {userData.jobTitle &&
              InputTextField({
                fieldName: "jobTitle",
                displayName: "תפקיד",
                item: userData,
              })}
            {userData.address &&
              InputTextField({
                fieldName: "address",
                displayName: "כתובת",
                item: userData,
              })}

            {userData?.phone &&
              InputTextField({
                fieldName: "phone",
                displayName: "טלפון",
                type: "num",
                item: userData,
                canEdit: true,
                isEdit: isEdit,
                errors: errors,
                setForm: changeForm,
                validator: validatePhoneNumber,
                changeErrors: changeErrors,
              })}

            {userData.birthDate &&
              InputCalanderField({
                fieldName: "birthDate",
                displayName: "תאריך לידה",
                item: userData,
              })}
            {userData.dischargeDay &&
              InputCalanderField({
                fieldName: "dischargeDay",
                displayName: 'תק"ש',
                item: userData,
              })}

            {CanSeeUserClearance() &&
              InputDropdown({
                fieldName: "clearance",
                displayName: "סיווג",
                canEdit: true,
                isEdit: isEdit,
                item: userData,
                options: USER_CLEARANCE,
                setForm: changeForm,
              })}
          </div>
        </div>
      </Dialog>
    </FullEntityInformationModalContext.Provider>
  );
};

export default FullEntityInformationModal;
