import React, { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import Hierarchy from "./Hierarchy";
import Unit from "./Unit";
import Approver from "./Approver";
import { useStores } from "../../context/use-stores";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { isJobTitleAlreadyTakenRequest } from "../../service/AppliesService";

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  hierarchy: Yup.object().required(),
  approvers: Yup.array().min(1).required(),
  comments: Yup.string().optional(),
  clearance: Yup.string().required(),
  unit: Yup.object().required(),
  roleName: Yup.string().required(),
  isTafkidan: Yup.boolean().default(false),
  isJobAlreadyTakenData: Yup.object()
    .shape({
      isJobTitleAlreadyTaken: Yup.boolean().oneOf([false]).required(),
    })
    .required(),
});

const RenameSingleOGForm = forwardRef(({ setIsActionDone }, ref) => {
  const { appliesStore } = useStores();

  const { register, handleSubmit, setValue, watch, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      await validationSchema.validate(data);
    } catch (err) {
      throw new Error(err.errors);
    }
    const {
      approvers,
      hierarchy,
      comments,
      clearance,
      unit,
      roleName,
      isTafkidan, // TODO: check
    } = data;
    const req = {
      commanders: approvers,
      kartoffelParams: {
        jobTitle: roleName,
        directGroup: hierarchy.id,
        isRoleAttachable: true,
        source: "oneTree",
        type: "domainUser",
        unit: unit.id,
        clearance,
      },
      adParams: {
        ouDisplayName: hierarchy.name,
        jobTitle: roleName,
        samAccountName: "???", // TODO: check
      },
      comments,
      due: Date.now(),
    };
    await appliesStore.createRoleApply(req);
    setIsActionDone(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: handleSubmit(onSubmit),
    }),
    []
  );

  const onRoleNameChange = async (e) => {
    const roleNameToSearch = e.target.value;

    if (roleNameToSearch && watch("hierarchy")?.id) {
      const isJobTitleAlreadyTakenResponse =
        await isJobTitleAlreadyTakenRequest(
          roleNameToSearch,
          watch("hierarchy").id
        );

      setValue("isJobAlreadyTakenData", isJobTitleAlreadyTakenResponse);
    }
  };

  const onAvailableRoleName = (e) => {
    setValue("roleName", e.target.innerHTML);
    setValue("isJobAlreadyTakenData", {
      isJobTitleAlreadyTaken: false,
    });
  };

  return (
    <div className="p-fluid">
      <div className="display-flex title-wrap" style={{ width: "inherit" }}>
        <h2>היררכיה</h2>
      </div>
      <div className="p-fluid-item p-fluid-item-flex1">
        <div className="p-field">
          <Hierarchy setValue={setValue} name="hierarchy" errors={errors} />
        </div>
      </div>
      <div className="p-fluid-item p-fluid-item">
        <div className="p-field">
          <label>
            <span className="required-field">*</span>שם תפקיד
          </label>
          <span className="p-input-icon-left">
            <i>
              {watch("isJobAlreadyTakenData")?.isJobTitleAlreadyTaken
                ? "תפוס"
                : "פנוי"}
            </i>
            <InputText {...register("roleName")} onChange={onRoleNameChange} />
            <label>{errors.roleName && <small style={{ color: "red" }}>יש למלא ערך</small>}</label>
            <label>
              {errors.isJobAlreadyTakenData && (
                <small>יש לבחור תפקיד פנוי</small>
              )}
            </label>
          </span>
        </div>
      </div>
      <div className="p-fluid-item">
        <Unit setValue={setValue} name="unit" errors={errors} />
      </div>
      {watch("isJobAlreadyTakenData")?.isJobTitleAlreadyTaken && (
        <div
          className="p-fluid-item p-fluid-item-flex1"
          style={{ alignItems: "baseline", whiteSpace: "pre-wrap" }}
        >
          <div className="p-field" style={{ display: "flex" }}>
            <div style={{ marginTop: "35px" }}>שמות פנויים:</div>
            <div style={{ margin: "20px", display: "flex", flexWrap: "wrap" }}>
              {watch("isJobAlreadyTakenData").suggestions.map((suggestion) => (
                <Button
                  className="p-button-secondary p-button-outlined"
                  style={{ width: "auto" }}
                  onClick={onAvailableRoleName}
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
          <label>
            <span className="required-field">*</span>סיווג תפקיד
          </label>
          <Dropdown
            options={["אדום", "כחול", "סגול"]}
            placeholder="סיווג תפקיד"
            {...register("clearance")}
            value={watch("clearance")}
          />
          <label>{errors.clearance && <small style={{ color: "red" }}>יש למלא ערך</small>}</label>
        </div>
      </div>
      <div className="p-fluid-item">
        <Approver
          setValue={setValue}
          name="approvers"
          multiple={true}
          errors={errors}
        />
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
          <label>
            <span></span>הערות
          </label>
          <InputTextarea
            {...register("comments")}
            type="text"
            autoResize="false"
          />
          <label>{errors.comments && <small style={{ color: "red" }}>יש למלא ערך</small>}</label>
        </div>
      </div>
    </div>
  );
});

export default RenameSingleOGForm;