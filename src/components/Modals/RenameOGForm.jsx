import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Accordion, AccordionTab } from "primereact/accordion";
import Hierarchy from "./Hierarchy";
import Approver from "./Approver";
import {
  getRolesUnderOG,
  getRoleByRoleId,
} from "../../service/KartoffelService";
import { changeRoleHierarchyRequest } from "../../service/AppliesService";
import { useStores } from "../../context/use-stores";
import { toJS } from "mobx";

import "../../assets/css/local/components/rename-og-form.css";

const EditOGForm = forwardRef((props, ref) => {
  const { userStore } = useStores();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [roles, setRoles] = useState([]);
  const [hierarchyByIdentifier, setHierarchyByIdentifier] = useState(null);
  /*
  bulk/request/role/hierarchy - change hierarchy bulk
  requests/role/og - change hierarchy
  */

  const isBulkPermitted = toJS(userStore.user)?.type?.includes("BULK");

  const roleRegister = register("role");
  const identifierRegister = register("identifier");

  const setCurrentHierarchyFunction = async (name, value) => {
    // console.log(value);
    setValue(name, value);

    if (value.id) {
      setRoles((await getRolesUnderOG(value.id)).roles);
    }
  };

  const onSubmit = async (data) => {
    if (data.currentHierarchy && data.newHierarchy && data.approver) {
      // TODO: add approvers as commanders
      console.log(data);
      if (data.role && data.comments) {
        await changeRoleHierarchyRequest({
          comments: data.comments,
          kartoffelParams: {
            roleId: data.identifier,
            directGroup: data.newHierarchy.id,
          },
          adParams: {
            samAccountName: data.identifier,
            ouDisplayName: data.newHierarchy.name,
          },
        });
      }

      if (data.bulkFile) {
        // bulk
      }
    } else {
      // not enough data
      throw new Error("form validation error");
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: handleSubmit(onSubmit),
    }),
    []
  );

  const initializeIdentifierDependencies = () => {
    setValue("currentHierarchy", "");
    setValue("role", "");
    setRoles([]);
    setHierarchyByIdentifier("");
  };

  const renderChangeHierarchy = () => {
    return (
      <div className="p-fluid">
        <div className="display-flex title-wrap" style={{ width: "inherit" }}>
          <h2>היררכיה נכחית</h2>
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <Hierarchy
              setValue={setCurrentHierarchyFunction}
              name="currentHierarchy"
              initialValue={hierarchyByIdentifier}
            />
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="1900">
              <span className="required-field">*</span>תפקיד
            </label>
            <Dropdown
              inputId="1900"
              options={roles}
              optionLabel="jobTitle"
              placeholder="תפקיד"
              {...roleRegister}
              onChange={(e) => {
                setValue("identifier", e.target.value.roleId);
                setValue("role", e.target.value);
              }}
              value={watch("role")}
            />
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="1901">
              <span className="required-field">*</span>מזהה תפקיד
            </label>
            <InputText
              {...identifierRegister}
              onChange={async (e) => {
                if (e.target.value) {
                  try {
                    const role = await getRoleByRoleId(e.target.value);
                    setValue("currentHierarchy", role.hierarchy);
                    setValue("role", role);
                    setRoles([role]);
                    setHierarchyByIdentifier(role.hierarchy);
                  } catch (e) {
                    initializeIdentifierDependencies();
                    console.log(e);
                  }
                } else {
                  initializeIdentifierDependencies();
                }
              }}
              id="1901"
              type="text"
              required
              placeholder="מזהה תפקיד"
            />
          </div>
        </div>
        <hr
          style={{
            height: 5,
            width: "inherit",
          }}
        />
        <div className="display-flex title-wrap" style={{ width: "inherit" }}>
          <h2>היררכיה חדשה</h2>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Hierarchy setValue={setValue} name="newHierarchy" />
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Approver setValue={setValue} name="approver" />
          </div>
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="1902">
              <span></span>סיבת מעבר
            </label>
            <InputTextarea
              {...register("comments")}
              id="1902"
              type="text"
              autoResize="false"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderBulk = () => {
    return (
      <div className="p-fluid">
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="currentHierarchy"
              fieldName="היררכיה נוכחית"
            />
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="newHierarchy"
              fieldName="היררכיה חדשה"
            />
          </div>
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="1903">
              <span className="required-field">*</span>העלאת קובץ
            </label>
            <span className="p-input-icon-left">
              <i className="pi pi-file-excel" />
              <InputText
                {...register("bulkFile")}
                id="1903"
                type="file"
                required
                placeholder="קובץ"
                style={{ paddingTop: "10px" }}
              />
            </span>
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Approver setValue={setValue} name="approver" />
          </div>
        </div>
      </div>
    );
  };

  // TODO: remove !
  return !isBulkPermitted ? (
    <Accordion
      expandIcon="pi pi-chevron-left"
      activeIndex={0}
      style={{ "margin-bottom": "20px" }}
    >
      <AccordionTab header="שינוי היררכיה לתפקיד">
        {renderChangeHierarchy()}
      </AccordionTab>
      <AccordionTab header="הגשת בקשה מרובה">{renderBulk()}</AccordionTab>
    </Accordion>
  ) : (
    renderChangeHierarchy()
  );
});

export default EditOGForm;
