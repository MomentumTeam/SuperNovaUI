import React, { useState, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import Hierarchy from "./Hierarchy";
import Approver from "../Fields/Approver";
import { useStores } from "../../context/use-stores";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getRolesUnderOG,
  getRoleByRoleId,
} from "../../service/KartoffelService";

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  hierarchy: Yup.object().required(),
  approvers: Yup.array().min(1).required(),
  comments: Yup.string().optional(),
  identifier: Yup.string().email().required(),
});

const RenameSingleOGForm = forwardRef(({ setIsActionDone }, ref) => {
  const { appliesStore } = useStores();
  const [hierarchyByIdentifier, setHierarchyByIdentifier] = useState(null);

  const { register, handleSubmit, setValue, watch, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [roles, setRoles] = useState([]);
  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      await validationSchema.validate(data);
    } catch (err) {
      throw new Error(err.errors);
    }
    const { identifier, approvers, hierarchy, comments } = data;
    const req = {
      comments: comments,
      commanders: approvers,
      kartoffelParams: {
        roleId: identifier,
        directGroup: hierarchy.id,
      },
      adParams: {
        samAccountName: identifier,
        ouDisplayName: hierarchy.name,
      },
    };
    await appliesStore.changeRoleHierarchy(req);
    setIsActionDone(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: handleSubmit(onSubmit),
    }),
    []
  );

  const setCurrentHierarchyFunction = async (name, value) => {
    setValue(name, value);

    if (value.id) {
      setRoles((await getRolesUnderOG(value.id)).roles);
    }
  };

  const initializeIdentifierDependencies = () => {
    setValue("currentHierarchy", "");
    setValue("role", "");
    setRoles([]);
    setHierarchyByIdentifier("");
  };

  const onIdentifierChange = async (e) => {
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
  };

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
            errors={errors}
          />
        </div>
      </div>
      <div className="p-fluid-item p-fluid-item">
        <div className="p-field">
          <label>
            <span className="required-field">*</span>תפקיד
          </label>
          <Dropdown
            options={roles}
            optionLabel="jobTitle"
            placeholder="תפקיד"
            {...register("role")}
            onChange={(e) => {
              setValue("identifier", e.target.value.roleId);
              setValue("role", e.target.value);
            }}
            value={watch("role")}
          />
          {errors.role && <small style={{ color: "red" }}>יש למלא ערך</small>}
        </div>
      </div>
      <div className="p-fluid-item-flex p-fluid-item">
        <div className="p-field">
          <label>
            <span className="required-field">*</span>מזהה תפקיד
          </label>
          <InputText
            {...register("identifier")}
            onChange={onIdentifierChange}
            type="text"
            required
            placeholder="מזהה תפקיד"
          />
          <label>{errors.identifier && <small style={{ color: "red" }}>יש למלא ערך</small>}</label>
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
          <Hierarchy setValue={setValue} name="hierarchy" errors={errors} />
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
      <div className="p-fluid-item p-fluid-item-flex1">
        <div className="p-field">
          <label>
            <span></span>סיבת מעבר
          </label>
          <InputTextarea
            {...register("comments")}
            type="text"
            autoResize="false"
          />
        </div>
      </div>
    </div>
  );
});

export default RenameSingleOGForm;
