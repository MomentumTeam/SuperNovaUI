import React, { useEffect, useState } from "react";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";
import { GetDefaultApprovers } from "../../../utils/approver";
import { useStores } from "../../../context/use-stores";
import { InputForm, InputTypes } from "../../Fields/InputForm";

const RoleDeleteInfo = ({ onlyForView = true, requestObject }) => {
  const { userStore } = useStores();
  const [role, setRole] = useState(requestObject.kartoffelParams);
  const [defaultApprovers, setDefaultApprovers] = useState([]);

  useEffect(() => {
    initDefaultApprovers();
  }, [requestObject]);

  const initDefaultApprovers = async () => {
    const result = await GetDefaultApprovers({
      request: requestObject,
      onlyForView,
      user: userStore.user,
    });
    setDefaultApprovers(result || []);
  };

  const formFields = [
    {
      fieldName: "roleId",
      displayName: "מזהה תפקיד",
      inputType: InputTypes.TEXT,
      force: true,
    },
    {
      fieldName: "jobTitle",
      displayName: "שם תפקיד",
      inputType: InputTypes.TEXT,
    },
    {
      fieldName: "firstName",
      displayName: "משתמש בתפקיד",
      inputType: InputTypes.TEXT,
    },
    {
      fieldName: "personalNumber",
      displayName: "מספר אישי",
      inputType: InputTypes.TEXT,
    },
    {
      fieldName: "identityCard",
      displayName: 'ת"ז',
      inputType: InputTypes.TEXT,
    },
    {
      fieldName: "approvers",
      inputType: InputTypes.APPROVER,
      default: defaultApprovers,
      force: true,
      disabled: true,
    },
  ];

  return (
    <div className="p-fluid" id="fullHierarchyInfoForm">
      <InputForm fields={formFields} item={role} isEdit={false} />
    </div>
  );
};

export { RoleDeleteInfo };
