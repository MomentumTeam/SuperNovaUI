import * as Yup from 'yup';
import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputText } from 'primereact/inputtext';
import datesUtil from '../../../utils/dates';
import { debounce } from 'lodash';

import Hierarchy from '../../Fields/Hierarchy';
import { useStores } from '../../../context/use-stores';
import { isUserApproverType, isUserHoldType } from '../../../utils/user';
import { ROLE_CLEARANCE, ROLE_EXP, USER_TYPE } from '../../../constants';
import {
  getEntityByRoleId,
  getRoleByRoleId,
  getDIByUniqueId,
  isJobTitleAlreadyTakenRequest,
  getEntityByMongoId,
} from '../../../service/KartoffelService';
import Approver from '../../Fields/Approver';
import { GetDefaultApprovers } from '../../../utils/approver';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { getSamAccountNameFromUniqueId } from '../../../utils/fields';
import { CanEditRoleFields } from '../../../utils/roles';
import { Dropdown } from 'primereact/dropdown';
import { getSamAccountNameFromEntity } from "../../../utils/fields";
import DisconnectRoleFromEntityPopup from './DisconnectRoleFromEntityPopup';

const validationSchema = Yup.object().shape({
  oldRole: Yup.object(),
  isUserApprover: Yup.boolean(),
  canEditRoleFields: Yup.boolean(),
  isUserSecurity: Yup.boolean(),
  approvers: Yup.array().when('isUserApprover', {
    is: false,
    then: Yup.array()
      .min(1, 'יש לבחור לפחות גורם מאשר אחד')
      .required('יש לבחור לפחות גורם מאשר אחד'),
  }),
  roleName: Yup.string().when('canEditRoleFields', {
    is: true,
    then: Yup.string()
      .required('יש לבחור שם תפקיד')
      .matches(ROLE_EXP, 'תפקיד לא תקין')
      .test({
        name: 'jobTitle-changed',
        message: 'נא לבחור שם חדש',
        test: (newJobTitle, context) => {
          return (
            newJobTitle !== context.parent.oldRole.jobTitle ||
            context.parent.clearance !== context.parent.oldRole.clearance
          );
        },
      }),
  }),
  isJobTitleAlreadyTaken: Yup.boolean().when('canEditRoleFields', {
    is: true,
    then: Yup.boolean()
      // .oneOf([false], 'תפקיד תפוס')
      .test({
        name: 'jobTitle-valid-check-after',
        message: 'תפקיד תפוס',
        test: async (_, context) => {
          if (context.parent.roleName !== context.parent.oldRole.jobTitle) {
            try {
              const result = await isJobTitleAlreadyTakenRequest(
                context.parent.roleName,
                context.parent.oldRole.directGroup
              );
              return !result.isJobTitleAlreadyTaken;
            } catch (error) {}
          } else {
            return true;
          }
          return false;
        },
      }),
  }),
  clearance: Yup.string().when('canEditRoleFields', {
    is: true,
    then: Yup.string()
      // .required('יש לבחור סיווג')      //commented-in case some roles don't have clearance
      .test({
        name: 'clearance-is-the-same',
        message: 'יש לבחור סיווג!',
        test: async (clearance, context) => {
          return (
            clearance !== context.parent.oldRole.clearance ||
            context.parent.roleName !== context.parent.oldRole.jobTitle
          );
        },
      }),
  }),
  comments: Yup.string().optional(),
  entityId: Yup.string().optional(),
});

const FullRoleInformationForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject, reqView = true }, ref) => {
    const { appliesStore, userStore } = useStores();
    const [jobTitleSuggestions, setJobTitleSuggestions] = useState([]);
    const [entity, setEntity] = useState({});
    const [role, setRole] = useState();
    const [digitalIdentity, setDigitalIdentity] = useState();
    const [defaultApprovers, setDefaultApprovers] = useState([]);
    const [showDisconnectRoleModal, setShowDisconnectRoleModal] = useState(false);

    const isUserApprover = isUserApproverType(userStore.user);
    const canEditRoleFields = CanEditRoleFields(requestObject);

    const isUserSecurity =
      isUserHoldType(userStore.user, USER_TYPE.SECURITY) ||
      isUserHoldType(userStore.user, USER_TYPE.SUPER_SECURITY) ||
      isUserHoldType(userStore.user, USER_TYPE.SECURITY_ADMIN);

    const debouncedRoleName = useRef(
      debounce(async (roleNameToSearch, roleCheck) => {
        if (roleNameToSearch && roleCheck.directGroup) {
          const result = await isJobTitleAlreadyTakenRequest(
            roleNameToSearch,
            roleCheck.directGroup
          );
          setValue('isJobTitleAlreadyTaken', result.isJobTitleAlreadyTaken, {
            shouldValidate: true,
          });
          setJobTitleSuggestions(result.suggestions);
        }
      }, 300)
    );

    const defaultValues = {
      oldRole: requestObject,
      comments: reqView ? requestObject?.comments : '',
      roleName: reqView
        ? requestObject?.kartoffelParams?.jobTitle
        : requestObject.jobTitle,
      clearance: reqView
        ? requestObject?.kartoffelParams?.clearance
        : requestObject.clearance,
      isUserApprover,
      canEditRoleFields,
      isUserSecurity,
    };

    const { register, handleSubmit, setValue, watch, clearErrors, formState } =
      useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
      });
    const { errors } = formState;
    const samAccountName = getSamAccountNameFromEntity(entity);
    const initDefaultApprovers = async () => {
      const result = await GetDefaultApprovers({
        request: requestObject,
        onlyForView,
        user: userStore.user,
        groupId: role?.directGroup,
      });
      setDefaultApprovers(result || []);
      setValue('isUserApprover', result.length > 0);
    };

    useEffect(async () => {
      if (requestObject) {
        setValue('comments', reqView ? requestObject?.comments : '');
        setValue(
          'roleName',
          reqView
            ? requestObject?.kartoffelParams?.jobTitle
            : requestObject.jobTitle
        );

        if (reqView) {
          const oldRole = requestObject?.kartoffelParams?.role
            ? requestObject?.kartoffelParams?.role
            : await getRoleByRoleId(requestObject?.kartoffelParams?.roleId);

          setValue('oldClearance', oldRole.clearance);

          setRole(oldRole);

          if (requestObject?.kartoffelParams?.entityId) {
            try {
              const entityRes = await getEntityByMongoId(
                requestObject?.kartoffelParams?.entityId
              );
              setEntity(entityRes);
            } catch (error) {}
          }
        } else {
          setRole(requestObject);

          try {
            const entityRes = await getEntityByRoleId(
              requestObject?.roleId || requestObject?.kartoffelParams?.roleId
            );
            setEntity(entityRes);
            setValue('entityId', entityRes.id);
          } catch (error) {}

          try {
            if (requestObject?.digitalIdentityUniqueId) {
              const di = await getDIByUniqueId(
                requestObject.digitalIdentityUniqueId
              );
              setDigitalIdentity(di);
            }
          } catch (error) {}
        }
      }

      await initDefaultApprovers();
    }, [requestObject, onlyForView]);

    const onSubmit = async (data) => {
      try {
        await validationSchema.validate(data);
      } catch (err) {
        console.log(err);
        throw new Error(err.errors);
      }
      const { approvers, comments, roleName, clearance, oldRole, entityId } =
        data;
      const req = {
        commanders: approvers,
        kartoffelParams: {
          roleId: requestObject.roleId,
          jobTitle: roleName,
          oldJobTitle: requestObject.jobTitle,
          role: oldRole,
          ...(entityId && { entityId }),
          ...(clearance && { clearance }),
        },
        adParams: {
          samAccountName: getSamAccountNameFromUniqueId(requestObject.roleId),
          jobTitle: roleName,
        },

        comments,
        due: Date.now(),
      };

      if (oldRole.jobTitle !== roleName) {
        // if the submitter edited the roleName
        req.adParams = {
          samAccountName: getSamAccountNameFromUniqueId(requestObject.roleId),
          jobTitle: roleName,
        };
      }

      await appliesStore.renameRoleApply(req);
      setIsActionDone(true);
    };

    const onRoleNameChange = async (e) => {
      const roleNameToSearch = e.target.value;
      debouncedRoleName.current(roleNameToSearch, role);
      setValue('roleName', roleNameToSearch, { shouldValidate: true });
    };

    const onAvailableRoleName = (e) => {
      setValue('roleName', e.target.innerHTML);
      setValue('isJobTitleAlreadyTaken', false, { shouldValidate: true });
      setJobTitleSuggestions([]);
      clearErrors('roleName');
    };

    const openDisconnectRoleFromEntityModal = () => {
      setShowDisconnectRoleModal(true);
    }

    const closeDisconnectRoleFromEntityModal = () => {
      setShowDisconnectRoleModal(false);
    }

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: handleSubmit(onSubmit),
        resetForm: () => {
          setValue(
            'roleName',
            reqView
              ? requestObject?.kartoffelParams?.jobTitle
              : requestObject.jobTitle
          );
          setValue('comments', reqView ? requestObject?.comments : '');
        },
      }),
      []
    );

    return (
      <div className="p-fluid">
        <div className="p-fluid-item p-fluid-item">
          <div className="p-field">
            <label>
              <span className="required-field">*</span>
              {reqView &&
              requestObject?.kartoffelParams?.oldJobTitle !==
                requestObject?.kartoffelParams?.jobTitle
                ? "שם תפקיד חדש"
                : "שם תפקיד"}
            </label>
            <span className="p-input-icon-left">
              {watch("roleName") && !errors.roleName && !onlyForView && (
                <i>{watch("isJobTitleAlreadyTaken") ? "תפוס" : "פנוי"}</i>
              )}
              <InputText
                id="editSingleRoleForm-roleName"
                {...register("roleName")}
                onChange={onRoleNameChange}
                disabled={onlyForView || !canEditRoleFields}
              />
              <label>
                {(errors.roleName || errors.isJobTitleAlreadyTaken) && (
                  <small style={{ color: "red" }}>
                    {errors?.roleName?.message
                      ? errors.roleName?.message
                      : errors.isJobTitleAlreadyTaken?.message
                      ? errors.isJobTitleAlreadyTaken.message
                      : "יש למלא ערך"}
                  </small>
                )}
              </label>
            </span>
          </div>
        </div>
        {watch("isJobTitleAlreadyTaken") && !errors.roleName && (
          <div
            className="p-fluid-item p-fluid-item-flex1"
            style={{ alignItems: "baseline", whiteSpace: "pre-wrap" }}
          >
            <div className="p-field" style={{ display: "flex" }}>
              <div style={{ marginTop: "35px" }}>שמות פנויים:</div>
              <div
                style={{ margin: "20px", display: "flex", flexWrap: "wrap" }}
              >
                {jobTitleSuggestions.map((suggestion) => (
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

        {reqView &&
          requestObject?.kartoffelParams?.oldJobTitle !==
            requestObject?.kartoffelParams?.jobTitle && (
            <div className="p-fluid-item p-fluid-item">
              <div className="p-field">
                <label> שם תפקיד ישן </label>
                <InputText
                  id="fullRoleInfoForm-oldJobTitle"
                  value={
                    requestObject?.kartoffelParams?.oldJobTitle ||
                    role?.jobTitle ||
                    "- - -"
                  }
                  disabled={onlyForView}
                />
              </div>
            </div>
          )}

        {!reqView && (
          <div className="p-fluid-item-flex p-fluid-item">
            <div className="p-field">
              <Hierarchy
                disabled={true}
                name="hierarchy"
                labelText="היררכיה"
                errors={errors}
                ogValue={role?.hierarchy}
                userHierarchy={
                  userStore.user && userStore.user.hierarchy
                    ? userStore.user.hierarchy
                    : null
                }
              />
            </div>
          </div>
        )}

        <div className="p-fluid-item p-fluid-item">
          <div className="p-field">
            <label>
              {" "}
              <span className="required-field">*</span>
              {reqView &&
              requestObject?.kartoffelParams?.clearance &&
              requestObject?.kartoffelParams?.clearance !==
                watch("oldClearance")
                ? "סיווג תפקיד חדש"
                : "סיווג התפקיד"}{" "}
            </label>
            <Dropdown
              id="fullRoleInfoForm-clearance"
              options={ROLE_CLEARANCE}
              placeholder={watch("clearance") || "- - -"}
              {...register("clearance")}
              value={watch("clearance")}
              className={`dropDownInput ${
                onlyForView || !canEditRoleFields ? `disabled` : ""
              } `}
              disabled={onlyForView || !canEditRoleFields}
              style={{
                textAlignLast: !watch("clearance") && "center",
              }}
            />
            <label>
              {errors.clearance && (
                <small style={{ color: "red" }}>
                  {errors.clearance?.message
                    ? errors.clearance?.message
                    : "יש למלא ערך"}
                </small>
              )}
            </label>
            {/* <InputText id="fullRoleInfoForm-clearance" value={role?.clearance || "---"} disabled={true} /> */}
          </div>
        </div>

        {reqView &&
          requestObject?.kartoffelParams?.clearance &&
          requestObject?.kartoffelParams?.clearance !==
            watch("oldClearance") && (
            <div className="p-fluid-item p-fluid-item">
              <div className="p-field">
                <label> סיווג תפקיד ישן</label>
                <InputText
                  id="fullRoleInfoForm-oldClearance"
                  value={watch("oldClearance") || "- - -"}
                  disabled={onlyForView}
                  style={{
                    textAlign: !watch("oldClearance") && "center",
                  }}
                />
              </div>
            </div>
          )}

        {!reqView && (
          <div className="p-fluid-item p-fluid-item">
            <div className="p-field">
              <label> תאריך עדכון </label>
              <InputText
                value={
                  role?.updatedAt
                    ? datesUtil.formattedDateTime(role.updatedAt)
                    : "- - -"
                }
                id="fullRoleInfoForm-updatedAt"
                disabled={true}
                style={{
                  textAlign: !role?.updatedAt && "center",
                }}
              />
            </div>
          </div>
        )}
        <div className="p-fluid-item p-fluid-item">
          <div className="p-field">
            <label> מזהה תפקיד </label>
            <InputText
              id="fullRoleInfoForm-roleId"
              value={role?.roleId || "- - -"}
              disabled={true}
              style={{
                textAlign: !role?.roleId && "center",
              }}
            />
          </div>
        </div>

        <div className="p-fluid-item p-fluid-item">
          <div className="p-field">
            <label> משתמש בתפקיד </label>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <InputText
                id="fullRoleInfoForm-entity"
                value={entity?.fullName || "- - -"}
                disabled={true}
                style={{
                  textAlign: !entity?.fullName && "center",
                  position: "absolute",
                }}
              />
              {userStore.user.types.includes(USER_TYPE.ADMIN) &&  (
                <button
                  id="disconectButton"
                  className='p-button p-component btn-gradient red'
                  onClick={(e) => {
                    openDisconnectRoleFromEntityModal();
                  }}
                >
                  ניתוק
                </button>
              )}
            </div>
          </div>
        </div>

        {!reqView && (
          <div className="p-fluid-item p-fluid-item">
            <div className="p-field">
              <label> מזהה כרטיס </label>
              <InputText
                id="fullRoleInfoForm-upn"
                value={digitalIdentity?.upn ? digitalIdentity.upn : "- - -"}
                disabled={true}
                style={{
                  textAlign: !digitalIdentity?.upn && "center",
                }}
              />
            </div>
          </div>
        )}

        {!(!reqView && onlyForView) && (
          <div className="p-fluid-item">
            <Approver
              setValue={setValue}
              name="approvers"
              tooltip='רס"ן ומעלה ביחידתך'
              multiple={true}
              errors={errors}
              disabled={onlyForView || watch("isUserApprover")}
              defaultApprovers={defaultApprovers}
            />
          </div>
        )}

        {(reqView || !onlyForView) && (
          <div className="p-fluid-item p-fluid-item-flex1">
            <div className="p-field">
              <label>
                <span></span>הערות
              </label>
              <InputTextarea
                {...register("comments")}
                id="fullRoleInfoForm-comments"
                type="text"
                placeholder={!onlyForView && "הכנס הערות לבקשה..."}
                disabled={onlyForView}
              />
            </div>
          </div>
        )}
       <DisconnectRoleFromEntityPopup
          user={userStore.user}
          role={role}
          entity={entity}
          samAccountName={samAccountName}
          showModal={showDisconnectRoleModal}
          closeModal={closeDisconnectRoleFromEntityModal}
        />
      </div>
    );
  }
);

export { FullRoleInformationForm };
