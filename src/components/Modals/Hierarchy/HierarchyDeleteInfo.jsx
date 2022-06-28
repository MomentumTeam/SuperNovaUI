import React, { useEffect, useState } from "react";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";
import { GetDefaultApprovers } from "../../../utils/approver";
import { useStores } from "../../../context/use-stores";
import { InputForm, InputTypes } from "../../Fields/InputForm";

const HierarchyDeleteInfo = ({ onlyForView = true, requestObject }) => {
  const { userStore } = useStores();
  const [hierarchy, setHierarchy] = useState(requestObject);
  const [defaultApprovers, setDefaultApprovers] = useState([]);

  useEffect(() => {
    initDefaultApprovers();
  }, [requestObject])
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
      fieldName: "name",
      displayName: "היררכיה",
      inputType: InputTypes.TEXT,
      force: true,
      item: requestObject?.kartoffelParams,
      withTooltip: true,
    },
    {
      fieldName: "id",
      displayName: "מזהה היררכיה",
      inputType: InputTypes.TEXT,
      item: requestObject?.kartoffelParams,
      force: true,
    },
    {
      fieldName: "approvers",
      inputType: InputTypes.APPROVER,
      default: defaultApprovers,
      force: true,
      disabled: true
    },
  ];

  return (
    <div className="p-fluid" id="fullHierarchyInfoForm">
      <InputForm fields={formFields} item={hierarchy} isEdit={false} />
    </div>
  );
};

export { HierarchyDeleteInfo };
