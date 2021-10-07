import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Checkbox } from "primereact/checkbox";
import {
  isJobTitleAlreadyTakenRequest,
  uploadBulkFile,
} from "../../service/AppliesService";
import Hierarchy from "./Hierarchy";
import Approver from "./Approver";
import { useStores } from "../../context/use-stores";
import { toJS } from "mobx";
import { apiBaseUrl, USER_TYPE } from "../../constants";
import { Button } from "primereact/button";

const CreateRoleForm = forwardRef((props, ref) => {
  const { userStore, appliesStore } = useStores();

  const { register, handleSubmit, setValue, watch, formState, trigger } =
    useForm();

  // TODO: get units from kartoffel
  const [units, setUnits] = useState([]);
  const [isJobAlreadyTakenData, setIsJobAlreadyTakenData] = useState(false);

  const isBulkPermitted = toJS(userStore.user)?.type?.includes(USER_TYPE.BULK);
  const isBulkRequestRegister = register("isBulkRequest");

  const onSubmit = async (data) => {
    const {
      approvers,
      hierarchy,
      roleName,
      unit,
      clearance,
      comments,
      isBulkRequest,
    } = data;

    if (!isBulkRequest) {
      try {
        return appliesStore.createRoleApply({
          commanders: approvers,
          kartoffelParams: {
            jobTitle: roleName,
            directGroup: hierarchy.id,
            source: "oneTree",
            clearance: clearance,
            isRoleAttachable: true,
            type: "domainUser",
            unit,
          },
          adParams: {
            ouDisplayName: hierarchy.name,
            jobTitle: roleName,
            // TODO: check
            samAccountName: "bla",
          },
          comments,
          due: Date.now(),
        });
      } catch (e) {
        throw new Error("נכשל בשינוי היררכיה לתפקיד");
      }
    } else {
      const formData = new FormData();
      formData.append("bulkFiles", data.bulkFile[0]);

      try {
        const { uploadFiles } = await uploadBulkFile(formData);

        return appliesStore.createRoleBulk({
          commanders: approvers,
          kartoffelParams: {
            directGroup: hierarchy.id,
            unit,
          },
          adParams: {
            ouDisplayName: hierarchy.name,
          },
          excelFilePath: uploadFiles[0],
        });
      } catch (e) {
        console.log(e);
        throw new Error("נכשל בבקשה מרובה");
      }
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: handleSubmit(onSubmit),
    }),
    []
  );

  const roleName = register("roleName");

  const renderCreateRole = () => {
    return (
      <div className="p-fluid">
        <div className="display-flex title-wrap" style={{ width: "inherit" }}>
          <h2>היררכיה</h2>
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <Hierarchy setValue={setValue} name="hierarchy" />
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="2011">
              <span className="required-field">*</span>שם תפקיד
            </label>
            <span className="p-input-icon-left">
              <i>
                {isJobAlreadyTakenData.isJobTitleAlreadyTaken ? "תפוס" : "פנוי"}
              </i>
              <InputText
                {...roleName}
                onChange={async (e) => {
                  const roleNameToSearch = e.target.value;
                  if (roleNameToSearch && watch("hierarchy")?.id) {
                    const isJobTitleAlreadyTakenResponse =
                      await isJobTitleAlreadyTakenRequest(
                        roleNameToSearch,
                        watch("hierarchy").id
                      );
                    setIsJobAlreadyTakenData(isJobTitleAlreadyTakenResponse);
                  }
                }}
              />
            </span>
          </div>
        </div>
        {formState.errors.comments && <h1>aaaaaaaaaaaaaa</h1>}
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="1900">
              <span className="required-field">*</span>יחידה
            </label>
            <Dropdown
              inputId="1900"
              options={units}
              placeholder="יחידה"
              optionLabel="name"
              {...register("unit")}
              value={watch("unit")}
            />
          </div>
        </div>
        {isJobAlreadyTakenData.isJobTitleAlreadyTaken && (
          <div
            className="p-fluid-item p-fluid-item-flex1"
            style={{ alignItems: "baseline", whiteSpace: "pre-wrap" }}
          >
            <div className="p-field" style={{ display: "flex" }}>
              <div style={{ marginTop: "35px" }}>שמות פנויים:</div>
              <div
                style={{ margin: "20px", display: "flex", flexWrap: "wrap" }}
              >
                {isJobAlreadyTakenData.suggestions.map((suggestion) => (
                  <Button
                    className="p-button-secondary p-button-outlined"
                    style={{ width: "auto" }}
                    onClick={(e) => {
                      setValue("roleName", e.target.innerHTML);
                      setIsJobAlreadyTakenData({
                        isJobTitleAlreadyTaken: false,
                      });
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="1900">
              <span className="required-field">*</span>סיווג תפקיד
            </label>
            <Dropdown
              inputId="1900"
              options={["אדום", "כחול", "סגול"]}
              placeholder="סיווג תפקיד"
              {...register("clearance")}
              value={watch("clearance")}
              onChange={() => trigger("comments")}
            />
          </div>
        </div>
        <div className="p-fluid-item">
          <Approver setValue={setValue} name="approvers" multiple={true} />
        </div>
        <div className="p-field-checkbox" style={{ marginBottom: "10px" }}>
          <Checkbox
            style={{ marginLeft: "10px" }}
            {...register("isTafkidan")}
            onChange={(e) => setValue("isTafkidan", e.checked)}
            checked={watch("isTafkidan")}
          />
          <label>התפקיד נפתח עבור משתמש תפקידן (מילואים / חמ"ל)</label>
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="1902">
              <span></span>הערות
            </label>
            <InputTextarea
              {...register("comments", { required: true })}
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
              name="hierarchy"
              labelText="היררכיה"
            />
          </div>
        </div>
        <div className="p-fluid-item">
          <div className="p-field">
            <label htmlFor="1900">
              <span className="required-field">*</span>יחידה
            </label>
            <Dropdown
              inputId="1900"
              options={units}
              placeholder="יחידה"
              {...register("unit")}
              value={watch("unit")}
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
            href={`${apiBaseUrl}/api/bulk/request/example?bulkType=0`}
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
      <AccordionTab header="שינוי היררכיה לתפקיד">
        {renderCreateRole()}
      </AccordionTab>
      <AccordionTab header="הגשת בקשה מרובה">{renderBulk()}</AccordionTab>
    </Accordion>
  ) : (
    renderCreateRole()
  );
});

export default CreateRoleForm;
