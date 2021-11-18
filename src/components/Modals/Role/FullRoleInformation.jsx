import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { yupResolver } from "@hookform/resolvers/yup";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";

import Approver from "../../Fields/Approver";
import { RoleField } from "../../Fields/Role";
import { InputForm, InputTypes } from "../../Fields/InputForm";
import { NAME_OG_EXP, USER_CLEARANCE } from "../../../constants";
import { getEntityByRoleId } from "../../../service/KartoffelService";
import { FullRoleInformationFooter } from "./FullRoleInformationFooter";

const FullRoleInformation = ({
  role,
  isOpen,
  closeModal,
  edit,
  actionPopup,
}) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [entity, setEntity] = useState({});
  const [isJobTitleFree, setIsJobTitleFree] = useState(true);

  const validationSchema = Yup.object().shape({
    approvers: Yup.array()
      .min(1, "יש לבחור לפחות גורם מאשר אחד")
      .required("יש לבחור לפחות גורם מאשר אחד"),
    role: Yup.string()
      .matches(NAME_OG_EXP, "תפקיד לא תקין")
      .required("יש לבחור שם תפקיד")
      .test({
        name: "jobTitle-valid-check",
        message: "תפקיד תפוס",
        test: () => {
          return !isJobTitleFree;
        },
      }),
  });

  const methods = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { role: "" },
    resolver: yupResolver(validationSchema),
  });
  const { errors } = methods.formState;

  useEffect(async () => {
    const entityRes = await getEntityByRoleId(role.roleId);
    setEntity(entityRes);
  }, [role]);

  const formFields = [
    {
      fieldName: "hierarchy",
      displayName: "היררכיה",
      inputType: InputTypes.TEXT,
      additionalClass: "padR",
    },
    {
      fieldName: "clearance",
      displayName: "סיווג התפקיד",
      inputType: InputTypes.DROPDOWN,
      options: USER_CLEARANCE,
      additionalClass: "padL",
    },
    {
      fieldName: "digitalIdentityUniqueId",
      displayName: "מזהה תפקיד",
      inputType: InputTypes.TEXT,
      additionalClass: "padR",
    },
    {
      fieldName: "createdAt",
      displayName: "תאריך עדכון",
      inputType: InputTypes.CALANDER,
      additionalClass: "padL",
    },
    {
      fieldName: "unit",
      displayName: "יחידה",
      inputType: InputTypes.TEXT,
      additionalClass: "padR",
      force: true,
    },
  ];

  const userInRoleField = [
    {
      fieldName: "fullName",
      displayName: "משתמש בתפקיד",
      inputType: InputTypes.TEXT,
      additionalClass: "padL",
    },
  ];
  return (
    <FormProvider {...methods}>
      <Dialog
        className={classNames("dialogClass1")}
        header={isEdit ? "עריכת תפקיד" : "פרטי תפקיד"}
        visible={isOpen}
        style={{ borderRadius: "30px" }}
        onHide={closeModal}
        dismissableMask={true}
        footer={
          <FullRoleInformationFooter
            role={role}
            isEdit={isEdit}
            closeModal={closeModal}
            setIsEdit={setIsEdit}
            actionPopup={actionPopup}
          />
        }
      >
        <div className="p-fluid">
          <div className="p-fluid-item padL">
            <div
              className={`p-field  ${isEdit ? "p-field-edit" : "p-field-blue"}`}
            >
              <RoleField
                isEdit={isEdit}
                role={role}
                setIsJobTitleFree={setIsJobTitleFree}
              />
            </div>
          </div>

          <InputForm fields={formFields} item={role} />
          <InputForm fields={userInRoleField} item={entity} />

          {isEdit && (
            <div className="p-fluid-item padR">
              <Approver
                setValue={methods.setValue}
                name="approvers"
                tooltip='רס"ן ומעלה ביחידתך'
                multiple={true}
                errors={errors}
                trigger={methods.trigger}
              />
            </div>
          )}
        </div>
      </Dialog>
    </FormProvider>
  );
};

export { FullRoleInformation };
