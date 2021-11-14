import React, { createContext, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

import blankProfilePic from "../../../assets/images/blankProfile.png";
import { getPictureByEntityId } from "../../../service/UserService";
import { FullEntityInformationFooter } from "./FullEntityInformationFooter";
import { CanSeeUserClearance } from "../../../utils/entites";
import { USER_CLEARANCE, USER_NO_PICTURE } from "../../../constants";
import { validateName, validatePhoneNumber } from "../../../utils/validators";
import { InputForm, InputTypes } from "../../Fields/InputForm";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";

export const FullEntityInformationModalContext = createContext(null);

const FullEntityInformationModal = ({ user, isOpen, closeFullDetailsModal, edit, actionPopup }) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [userPic, setUserPic] = useState(undefined);
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  const changeErrors = (fieldName, error = null) => {
    let tempErrors = { ...errors };
    if (error !== null) {
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
      if (user && user.picture && (user.picture === USER_NO_PICTURE)) {

        const pic = await getPictureByEntityId(user.id);
        setUserPic(pic.image);
      } else {
        setUserPic(user.picture);
      }
    }

    // When user changes, retrive new photo
    getUserPic();
  }, [user, isOpen]);

  useEffect(() => {
    // Init form and errors
    setForm({});
    setErrors({});
  }, [isEdit]);

  const formFields = [
    {
      fieldName: "firstName",
      displayName: "שם פרטי",
      inputType: InputTypes.TEXT,
      canEdit: true,
      validator: validateName,
    },
    {
      fieldName: "lastName",
      displayName: "שם משפחה",
      inputType: InputTypes.TEXT,
      canEdit: true,
      validator: validateName,
    },
    {
      fieldName: "personalNumber",
      displayName: 'מ"א',
      inputType: InputTypes.TEXT,
    },
    {
      fieldName: "identityCard",
      displayName: 'ת"ז',
      inputType: InputTypes.TEXT,
      type: "num",
      keyFilter: "num",
      canEdit: true,
    },
    {
      fieldName: "rank",
      displayName: "דרגה",
      inputType: InputTypes.TEXT,
    },
    {
      fieldName: "hierarchy",
      displayName: "היררכיה",
      inputType: InputTypes.TEXT,
    },
    {
      fieldName: "mail",
      displayName: "מייל",
      inputType: InputTypes.TEXT,
    },
    {
      fieldName: "jobTitle",
      displayName: "תפקיד",
      inputType: InputTypes.TEXT,
    },
    {
      fieldName: "address",
      displayName: "כתובת",
      inputType: InputTypes.TEXT,
    },
    {
      fieldName: "phone",
      displayName: "טלפון",
      inputType: InputTypes.TEXT,
      type: "num",
      keyFilter: "num",
      canEdit: true,
      validator: validatePhoneNumber,
    },
    {
      fieldName: "birthDate",
      displayName: "תאריך לידה",
      inputType: InputTypes.CALANDER,
    },
    {
      fieldName: "dischargeDay",
      displayName: 'תק"ש',
      inputType: InputTypes.CALANDER,
    },
    {
      fieldName: "clearance",
      displayName: "סיווג",
      inputType: InputTypes.DROPDOWN,
      canEdit: true,
      options: USER_CLEARANCE,
      secured: CanSeeUserClearance
    },
  ];

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
        dismissableMask={true}
      >
        <div>
          <div className="userpic-wrap">
            <img
              style={{ borderRadius: "50%", width: "142px" }}
              src={user && userPic !== USER_NO_PICTURE ? `data:image/jpeg;base64,${userPic}` : blankProfilePic}
              alt="userpic"
            />
          </div>
          <div className="p-fluid">
            <InputForm
              fields={formFields}
              item={user}
              isEdit={isEdit}
              changeForm={changeForm}
              errors={errors}
              changeErrors={changeErrors}
            />
          </div>
        </div>
      </Dialog>
    </FullEntityInformationModalContext.Provider>
  );
};

export default FullEntityInformationModal;
