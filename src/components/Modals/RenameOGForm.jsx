import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
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
import { uploadBulkFile } from "../../service/AppliesService";
import { useStores } from "../../context/use-stores";
import { toJS } from "mobx";
import FormData from "form-data";

import "../../assets/css/local/components/rename-og-form.css";
import { apiBaseUrl, USER_TYPE } from "../../constants";

const EditOGForm = forwardRef(({ setIsActionDone }, ref) => {
  const { userStore, appliesStore } = useStores();
  const { register, handleSubmit, setValue, watch } = useForm();
  const [roles, setRoles] = useState([]);
  const [hierarchyByIdentifier, setHierarchyByIdentifier] = useState(null);

  const isBulkPermitted = toJS(userStore.user)?.type?.includes(USER_TYPE.BULK);

  const roleRegister = register("role");
  const identifierRegister = register("identifier");
  const isBulkRequestRegister = register("isBulkRequest");

  const setCurrentHierarchyFunction = async (name, value) => {
    setValue(name, value);

    if (value.id) {
      setRoles((await getRolesUnderOG(value.id)).roles);
    }
  };

  const onSubmit = async (data) => {
    if (
      data.currentHierarchy &&
      data.newHierarchy &&
      data.approvers &&
      data.approvers.length > 0
    ) {
      if (data.role && data.comments) {
        try {
          return appliesStore.changeRoleHierarchy({
            comments: data.comments,
            commanders: data.approvers,
            kartoffelParams: {
              roleId: data.identifier,
              directGroup: data.newHierarchy.id,
            },
            adParams: {
              samAccountName: data.identifier,
              ouDisplayName: data.newHierarchy.name,
            },
          });
        } catch (e) {
          throw new Error("נכשל בשינוי היררכיה לתפקיד");
        }
      }

      if (data.bulkFile) {
        const formData = new FormData();
        formData.append("bulkFiles", data.bulkFile[0]);

        try {
          const { uploadFiles } = await uploadBulkFile(formData);

          return appliesStore.changeRoleHierarchyBulk({
            commanders: data.approvers,
            kartoffelParams: {
              directGroup: data.newHierarchy.id,
            },
            adParams: {
              ouDisplayName: data.newHierarchy.name,
            },
            excelFilePath: uploadFiles[0],
          });
        } catch (e) {
          throw new Error("נכשל בבקשה מרובה");
        }
      }
    } else {
      throw new Error("חלק מהשדות לא תקינים");
    }
    setIsActionDone(true);
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
              value={hierarchyByIdentifier}
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
        <div className="p-fluid-item">
          <Approver setValue={setValue} name="approvers" multiple={true} />
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
              labelText="היררכיה נוכחית"
            />
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="newHierarchy"
              labelText="היררכיה חדשה"
            />
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
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
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
            </span>
          </div>
        </div>
        <div
          className="p-fluid-item-flex p-fluid-item"
          style={{ alignItems: "center" }}
        >
          {/* TODO: bring good excel example route */}
          <a
            href={`${apiBaseUrl}/api/bulk/request/example?bulkType=1`}
            style={{ textDecoration: "underline" }}
            download="exampleFile"
          >
            להורדת הפורמט לחץ כאן
          </a>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <Approver setValue={setValue} name="approvers" multiple={true} />
        </div>
      </div>
    );
  };

  // TODO: remove !
  return !isBulkPermitted ? (
    <Accordion
      expandIcon="pi pi-chevron-left"
      style={{ "margin-bottom": "20px" }}
      onTabOpen={(e) => setValue("isBulkRequest", !!e.index)}
    >
      <AccordionTab header="שינוי היררכיה לתפקיד" id="1" index="2">
        {renderChangeHierarchy()}
      </AccordionTab>
      <AccordionTab header="הגשת בקשה מרובה">{renderBulk()}</AccordionTab>
    </Accordion>
  ) : (
    renderChangeHierarchy()
  );
});

export default EditOGForm;
