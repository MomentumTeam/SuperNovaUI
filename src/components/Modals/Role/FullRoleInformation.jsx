import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { AutoComplete } from "primereact/autocomplete";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";

import { FullRoleInformationFooter } from "./FullRoleInformationFooter";
import { USER_CLEARANCE } from "../../../constants";
import { getLabel, disabledInputStyle } from "../../Fields/InputCommon";
import { InputDropdown } from "../../Fields/InputDropdown";
import { InputTextField } from "../../Fields/InputText";
import { InputCalanderField } from "../../Fields/InputCalander";
import { getEntityByRoleId, getRole } from "../../../service/KartoffelService";

const FullRoleInformation = ({ role, isOpen, closeModal, edit }) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [form, setForm] = useState(role);
  const [entity, setEntity] = useState({});
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(async () => {
    const entity = await getEntityByRoleId(role.roleId);
    setEntity(entity);
  }, [role]);

  useEffect(async () => {
    setForm(role);
  }, [isEdit]);

  return (
    <>
      <Dialog
        className={classNames("dialogClass1")}
        header={isEdit ? "עריכת תפקיד" : "פרטי תפקיד"}
        visible={isOpen}
        style={{ borderRadius: "30px" }}
        onHide={closeModal}
        footer={
          <FullRoleInformationFooter
            role={role}
            isEdit={isEdit}
            closeModal={closeModal}
            setIsEdit={setIsEdit}
            form={form}
          />
        }
      >
        <div className="p-fluid">
          <div className="p-fluid-item padL">
            <div className="p-field  p-field-blue">
              <div className={`status ${entity ? "" : "available"}`}>
                <p>{entity ? "לא פנוי" : "פנוי"}</p>
              </div>
              {getLabel({ labelName: "שם תפקיד", canEdit: true, isEdit: isEdit })}
              <AutoComplete
                value={selected}
                disabled={!isEdit}
                style={isEdit ? {} : disabledInputStyle}
                completeMethod={async (e) => {
                  // const searchResults = await getOGByHierarchy(e);
                  // setResults(searchResults);
                }}
                onChange={(e) => {
                  setSelected(e.value);
                }}
              />

              {/* // <InputText
              //   id="2011"
              //   type="text"
              //   disabled={!isEdit}
              //   style={isEdit ? {} : disabledInputStyle}
              //   placeholder={role.jobTitle}
              //   onChange={(e) => {
              //     let tempForm = { ...form };
              //     tempForm.jobTitle = e.target.value;
              //     setForm(tempForm);
              //   }}
              //   value={form.jobTitle}
              // /> */}
            </div>
          </div>
          <div className="p-fluid-item padR">
            <div className="p-field p-field-blue">
              {getLabel({ labelName: "היררכיה" })}
              <InputText id="2011" type="text" disabled style={disabledInputStyle} placeholder={role.hierarchy} />
            </div>
          </div>

          {InputDropdown({
            fieldName: "clearance",
            displayName: "סיווג התפקיד",
            item: role,
            form: form,
            setForm: setForm,
            options: USER_CLEARANCE,
            additionalClass: "padL",
          })}

          {InputTextField({
            fieldName: "digitalIdentityUniqueId",
            displayName: "יוזר",
            item: role,
            form: form,
            setForm: setForm,
            additionalClass: "padR",
          })}

          {InputTextField({
            fieldName: "fullName",
            displayName: "משתמש בתפקיד",
            item: entity,
            form: form,
            setForm: setForm,
            additionalClass: "padL",
          })}

          {InputTextField({
            fieldName: "unit",
            displayName: "יחידה",
            item: role,
            form: form,
            setForm: setForm,
            additionalClass: "padR",
          })}

          {InputCalanderField({
            fieldName: "createdAt",
            displayName: "תאריך יצירה",
            item: role,
            form: form,
            setForm: setForm,
            additionalClass: "padL",
          })}

          {InputCalanderField({
            fieldName: "updatedAt",
            displayName: "תאריך עדכון",
            item: role,
            form: form,
            setForm: setForm,
            additionalClass: "padR",
          })}
        </div>
      </Dialog>
    </>
  );
};

export { FullRoleInformation };
