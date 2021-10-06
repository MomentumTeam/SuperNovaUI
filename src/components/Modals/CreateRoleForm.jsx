import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import {
  createRoleRequest,
  isJobTitleAlreadyTakenRequest,
} from "../../service/AppliesService";
import Hierarchy from "./Hierarchy";
import Approver from "./Approver";
import { useStores } from "../../context/use-stores";


const CreateRoleForm = forwardRef((props, ref) => {
  const { userStore, appliesStore } = useStores();

  const { register, handleSubmit, setValue, watch } = useForm();
  const [units, setUnits] = useState([]);
  const [isRoleAlreadyTaken, setIsRoleAlreadyTaken] = useState(false);

  const onSubmit = async (data) => {
    const { approvers, hierarchy, roleName, unit, clearance, comments } = data;
    const req = {
      status: "SUBMITTED",
      commanders: approvers,
      kartoffelParams: {
        jobTitle: roleName,
        directGroup: hierarchy.id,
        source: "oneTree",
        clearance: clearance,
        isRoleAttachable: true,
        // TODO: check this
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
    };

    return appliesStore.createRoleApply(req);
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
              <i>{isRoleAlreadyTaken ? "תפוס" : "פנוי"}</i>
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

                    setIsRoleAlreadyTaken(
                      isJobTitleAlreadyTakenResponse.isRoleAlreadyTaken
                    );
                  }
                }}
              />
            </span>
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
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

        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field" style={{ display: "flex" }}>
            <div style={{ marginTop: "35px" }}>שמות פנויים:</div>
            <div style={{ margin: "20px", display: "flex" }}>
              {/*
              TODO: get
              <Button className="p-button-secondary p-button-outlined">
                Blue
              </Button>*/}
            </div>
          </div>
        </div>
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
            />
          </div>
        </div>
        <div className="p-fluid-item">
          <Approver setValue={setValue} name="approvers" multiple={true} />
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="1902">
              <span></span>הערות
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

  return renderCreateRole();
});

export default CreateRoleForm;
