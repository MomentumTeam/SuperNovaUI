import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import Hierarchy from "../../Fields/Hierarchy";
import Approver from "../../Fields/Approver";
import { useStores } from "../../../context/use-stores";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getRolesUnderOG, getRoleByRoleId, searchRolesByRoleId, getOGById } from "../../../service/KartoffelService";
import HorizontalLine from "../../HorizontalLine";
import { GetDefaultApprovers } from "../../../utils/approver";
import { isUserHoldType } from "../../../utils/user";
import { USER_TYPE } from "../../../constants";
import { getOuDisplayName } from '../../../utils/hierarchy';
import { getSamAccountNameFromUniqueId } from '../../../utils/fields';
import { AutoComplete } from 'primereact/autocomplete';

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  hierarchy: Yup.object().required("יש למלא ערך").test("does-user-already-exist-in-hierarchy","שם התפקיד קיים בהיררכיה שבחרת. יש לערוך את שמו דרך טבלת התפקידים", function(hierarchy) {
    if(!Array.isArray(hierarchy?.directRoles)) {
      return false
    }
    return !hierarchy.directRoles.map(role => role.jobTitle).includes(this.parent.role.jobTitle)
  }),
  currentHierarchy: Yup.object().required("יש למלא ערך"),
  role: Yup.object().required(),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when("isUserApprover", {
    is: false,
    then: Yup.array().min(1, "יש לבחור לפחות גורם מאשר אחד").required("יש לבחור לפחות גורם מאשר אחד"),
  }),
  comments: Yup.string().optional(),
  roleId: Yup.string("יש להכניס מזהה תקין").required("יש למלא ערך").matches(/.*@.*/, "יש להכניס מזהה תקין"),
});

const RenameSingleOGForm = forwardRef(({ setIsActionDone, onlyForView, requestObject }, ref) => {
  const { appliesStore, userStore } = useStores();
  const [hierarchyByRoleId, setHierarchyByRoleId] = useState(null);
  const [roleSuggestions, setRoleSuggestions] = useState([]);

  const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);

  const { register, handleSubmit, setValue, watch, formState, getValues } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { isUserApprover },
  });
  const [roles, setRoles] = useState([]);
  const { errors } = formState;

  useEffect(() => {
    const initializeValues = async () => {
      setValue("comments", requestObject.comments);
      setValue("roleId", requestObject.kartoffelParams.roleId);
      setValue("hierarchy", requestObject.adParams.ouDisplayName);
      const role = await getRoleByRoleId(requestObject.kartoffelParams.roleId);
      setHierarchyByRoleId(role.hierarchy);
      setValue("role", role);
      setRoles([role]);
    };

    if (requestObject) {
      initializeValues();
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      await validationSchema.validate(data);
    } catch (err) {
      throw new Error(err.errors);
    }
    const { roleId, approvers, hierarchy, comments, role } = data;
    const req = {
      comments: comments,
      commanders: approvers,
      kartoffelParams: {
        roleId: roleId,
        directGroup: hierarchy.id,
        currentJobTitle: role.jobTitle,
      },
      adParams: {
        samAccountName: getSamAccountNameFromUniqueId(roleId),
        ouDisplayName: getOuDisplayName(hierarchy.hierarchy, hierarchy.name),
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

    if (value?.id) {
      const roles = await getRolesUnderOG({ id: value.id });
      setRoles(roles);
    }
  };

  const initializeRoleIdDependencies = () => {
    setValue("currentHierarchy", "");
    setValue("role", "");
    setRoles([]);
    setHierarchyByRoleId("");
  };

  const onRoleIdSelected = async () => {
    const roleId = getValues("roleId");

    if (roleId) {
      try {
        let role;
        if (!role) {
          role = roleSuggestions.find((role) => role.roleId === roleId);
        }

        if (!role) {
          role = await getRoleByRoleId(roleId);
        }

         let hierarchy;
         if (!hierarchy) {
           hierarchy = await getOGById(role.directGroup);
         }

        setValue("currentHierarchy", hierarchy);
        setValue("role", role);

        setRoles([role]);
        setHierarchyByRoleId(role.hierarchy);
      } catch (e) {
        initializeRoleIdDependencies();
      }
    } else {
      initializeRoleIdDependencies();
    }
  };

   const onSearchRoleId = async (event) => {
     if (event.query.length > 1) {
       const result = await searchRolesByRoleId(event.query);
       setRoleSuggestions(result || []);
     } else {
       setRoleSuggestions([]);
     }
   };

  return (
    <div className="p-fluid">
      <div className="display-flex title-wrap" style={{ width: "inherit" }}>
        <h2>היררכיה נוכחית</h2>
      </div>
      <div className="p-fluid-item p-fluid-item-flex1">
        <div className="p-field">
          <Hierarchy
            setValue={setCurrentHierarchyFunction}
            name="currentHierarchy"
            ogValue={hierarchyByRoleId}
            errors={errors}
            disabled={onlyForView}
            userHierarchy={userStore.user && userStore.user.hierarchy ? userStore.user.hierarchy : null}
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
              setValue("roleId", e.target.value.roleId);
              setValue("role", e.target.value);
            }}
            value={watch("role")}
            disabled={onlyForView}
          />
          {errors.role && <small style={{ color: "red" }}>יש למלא ערך</small>}
        </div>
      </div>
      <div className="p-fluid-item-flex p-fluid-item">
        <div className="p-field">
          <label>
            <span className="required-field">*</span>מזהה תפקיד
          </label>
          <AutoComplete
            value={watch("roleId")}
            field="roleId"
            suggestions={roleSuggestions}
            completeMethod={onSearchRoleId}
            onChange={(e) => {
              setValue("roleId", e.value.roleId ? e.value.roleId : e.value);
            }}
            onSelect={() => onRoleIdSelected()}
            type="text"
            required
            placeholder="מזהה תפקיד"
            disabled={onlyForView}
            tooltip={'לדוגמה: "T12345678"'}
            tooltipOptions={{ position: "top" }}
          />
          <label>
            {errors.roleId && (
              <small style={{ color: "red" }}>{errors.roleId?.message ? errors.roleId?.message : "יש למלא ערך"}</small>
            )}
          </label>
        </div>
      </div>
      <HorizontalLine />
      <div className="display-flex title-wrap" style={{ width: "inherit" }}>
        <h2>היררכיה חדשה</h2>
      </div>
      <div className="p-fluid-item-flex p-fluid-item">
        <div className="p-field">
          <Hierarchy
            setValue={setValue}
            name="hierarchy"
            errors={errors}
            ogValue={watch("hierarchy")}
            disabled={onlyForView}
            userHierarchy={userStore.user && userStore.user.hierarchy ? userStore.user.hierarchy : null}
          />
        </div>
      </div>
      <div className="p-fluid-item">
        <Approver
          setValue={setValue}
          name="approvers"
          multiple={true}
          errors={errors}
          tooltip='רס"ן ומעלה ביחידתך'
          disabled={onlyForView || isUserApprover}
          defaultApprovers={GetDefaultApprovers(requestObject, onlyForView)}
        />
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
            disabled={onlyForView}
            placeholder="הכנס הערות לבקשה..."
          />
        </div>
      </div>
    </div>
  );
});

export default RenameSingleOGForm;
