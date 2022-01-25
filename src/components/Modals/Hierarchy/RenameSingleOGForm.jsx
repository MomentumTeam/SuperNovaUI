import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { set, useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import Hierarchy from '../../Fields/Hierarchy';
import Approver from '../../Fields/Approver';
import { useStores } from '../../../context/use-stores';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  getRolesUnderOG,
  getRoleByRoleId,
  searchRolesByRoleId,
  getOGById,
} from '../../../service/KartoffelService';
import HorizontalLine from '../../HorizontalLine';
import { GetDefaultApprovers } from '../../../utils/approver';
import { isUserApproverType } from '../../../utils/user';
import { getOuDisplayName, hierarchyConverse } from '../../../utils/hierarchy';
import { getSamAccountNameFromUniqueId } from '../../../utils/fields';
import { AutoComplete } from 'primereact/autocomplete';
import { isApproverValid } from '../../../service/ApproverService';

const validationSchema = Yup.object().shape({
  role: Yup.object().required('יש לבחור תפקיד מהרשימה'),
  roleId: Yup.string('יש להכניס מזהה תקין')
    .required('יש למלא ערך')
    .matches(/.*@.*/, 'יש להכניס מזהה תקין'),
  hierarchy: Yup.object()
    .required('יש לבחור היררכיה חדשה')
    .test(
      'does-user-already-exist-in-hierarchy',
      'שם התפקיד קיים בהיררכיה שבחרת. יש לערוך את שמו דרך טבלת התפקידים',
      (hierarchy, context) => {
        if (!Array.isArray(hierarchy?.directRoles)) return false;
        return !hierarchy.directRoles
          .map((role) => role.jobTitle)
          .includes(context.parent?.role?.jobTitle);
      }
    )
    .test({
      name: 'check-if-hierarchies-are-different',
      message: 'יש לבחור היררכיה שונה מההיררכיה הנוכחית!',
      test: async (hierarchy, context) => {
        if (hierarchy?.id === context.parent?.currentHierarchy?.id) {
          return false;
        }
        return true;
      },
    }),
  currentHierarchy: Yup.object().required('יש לבחור היררכיה נוכחית'),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array()
    .when('isUserApprover', {
      is: false,
      then: Yup.array()
        .min(1, 'יש לבחור לפחות גורם מאשר אחד בדרגת סא"ל ומעלה')
        .required('יש לבחור לפחות גורם מאשר אחד בדרגת סא"ל ומעלה'),
    })
    .test({
      name: 'check-if-valid',
      message: 'יש לבחור מאשרים תקינים (מהיחידה בלבד)',
      test: async (approvers, context) => {
        let isTotalValid = true;

        if (
          approvers &&
          Array.isArray(approvers) &&
          context.parent?.currentHierarchy?.id
        ) {
          await Promise.all(
            approvers.map(async (approver) => {
              const { isValid } = await isApproverValid(
                approver.entityId,
                context.parent.currentHierarchy.id
              );
              if (!isValid) isTotalValid = false;
            })
          );
        }

        return isTotalValid;
      },
    }),
  comments: Yup.string().optional(),
});

const RenameSingleOGForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore } = useStores();
    const [roleSuggestions, setRoleSuggestions] = useState([]);
    const [defaultApprovers, setDefaultApprovers] = useState([]);

    const { register, handleSubmit, setValue, watch, formState, getValues } =
      useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: { isUserApprover: isUserApproverType(userStore.user) },
      });
    const [roles, setRoles] = useState([]);
    const { errors } = formState;

    useEffect(() => {
      const initializeValues = async () => {
        setValue('comments', requestObject.comments);
        setValue('roleId', requestObject.kartoffelParams.roleId);
        setValue('hierarchy', {name:requestObject.kartoffelParams.hierarchy}); 
        setValue(
          'currentHierarchy',
          {name:requestObject.kartoffelParams.oldHierarchy}
        );

        const oldRole = requestObject?.kartoffelParams?.role
          ? requestObject?.kartoffelParams?.role
          : await getRoleByRoleId(requestObject.kartoffelParams.roleId);

        setValue("role", oldRole);
        setRoles([oldRole]);

        const result = await GetDefaultApprovers({
          request: requestObject,
          onlyForView,
          user: userStore.user,
        });
        setDefaultApprovers(result || []);
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
      const { roleId, approvers, hierarchy, comments, role, currentHierarchy } =
        data;
      const req = {
        comments: comments,
        commanders: approvers,
        kartoffelParams: {
          roleId: roleId,
          directGroup: hierarchy.id,
          currentJobTitle: role.jobTitle,
          hierarchy: hierarchyConverse(hierarchy),
          oldHierarchy: hierarchyConverse(currentHierarchy),
          role: role,
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

    const handleOrgSelected = async (org) => {
      const result = await GetDefaultApprovers({
        request: requestObject,
        user: userStore.user,
        onlyForView,
        groupId: org.id,
        highCommander: true,
      });
      setDefaultApprovers(result || []);
      setValue('isUserApprover', result.length > 0);
      setValue('approvers', []);

      const roles = await getRolesUnderOG({ id: org.id, direct: true });
      setRoles(roles || []);
      setValue('roleId', '');
      setValue('role', null);
    };

    const initializeRoleIdDependencies = () => {
      setValue('currentHierarchy', '');
      setValue('role', '');
      setRoles([]);
    };

    const onRoleIdSelected = async () => {
      const roleId = getValues('roleId');

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

          const result = await GetDefaultApprovers({
            request: requestObject,
            user: userStore.user,
            onlyForView,
            groupId: role.directGroup,
            highCommander: true,
          });
          setDefaultApprovers(result || []);
          setValue('isUserApprover', result.length > 0);

          setValue('currentHierarchy', hierarchy);
          setValue('role', role);

          setRoles([role]);
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
      <div className="p-fluid" id="renameSingleOGForm">
        <div className="display-flex title-wrap" style={{ width: 'inherit' }}>
          <h2>היררכיה נוכחית</h2>
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="currentHierarchy"
              onOrgSelected={handleOrgSelected}
              ogValue={watch('currentHierarchy')}
              errors={errors}
              disabled={onlyForView}
              userHierarchy={
                userStore.user && userStore.user.hierarchy
                  ? userStore.user.hierarchy
                  : null
              }
            />
          </div>
        </div>
        <div className="p-fluid-item p-fluid-item">
          <div className="p-field">
            <label>
              <span className="required-field">*</span>בחירת תפקיד מתוך רשימה
            </label>
            <Dropdown
              id="renameSingleOGForm-role"
              options={roles}
              optionLabel="jobTitle"
              placeholder="תפקיד"
              {...register('role')}
              onChange={(e) => {
                setValue('roleId', e.target.value.roleId);
                setValue('role', e.target.value);
              }}
              value={watch('role')}
              disabled={onlyForView}
            />
            <label htmlFor="2021">
              {' '}
              {errors.role && (
                <small style={{ color: 'red' }}>
                  {errors['role'].type !== 'typeError' && errors.role?.message
                    ? errors.role.message
                    : 'יש למלא ערך'}
                </small>
              )}
            </label>{' '}
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label>
              <span className="required-field">*</span>מזהה תפקיד
            </label>
            <AutoComplete
              id="renameSingleOGForm-roleId"
              value={watch('roleId')}
              field="roleId"
              suggestions={roleSuggestions}
              completeMethod={onSearchRoleId}
              onChange={(e) => {
                setValue('role', null);
                setValue('roleId', e.value.roleId ? e.value.roleId : e.value);
              }}
              onSelect={() => onRoleIdSelected()}
              type="text"
              required
              placeholder="מזהה תפקיד"
              disabled={onlyForView}
              tooltip={onlyForView ? '' : 'לדוגמה: "T12345678"'}
              tooltipOptions={{ position: 'top' }}
            />
            <label>
              {errors.roleId && (
                <small style={{ color: 'red' }}>
                  {errors.roleId?.message
                    ? errors.roleId?.message
                    : 'יש למלא ערך'}
                </small>
              )}
            </label>
          </div>
        </div>
        <HorizontalLine />
        <div className="display-flex title-wrap" style={{ width: 'inherit' }}>
          <h2>היררכיה חדשה</h2>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="hierarchy"
              errors={errors}
              ogValue={watch('hierarchy')}
              disabled={onlyForView}
              userHierarchy={
                userStore.user && userStore.user.hierarchy
                  ? userStore.user.hierarchy
                  : null
              }
              withRoles={true}
            />
          </div>
        </div>
        <div className="p-fluid-item">
          <Approver
            setValue={setValue}
            name="approvers"
            multiple={true}
            errors={errors}
            tooltip='סא"ל ומעלה ביחידתך'
            disabled={onlyForView || watch('isUserApprover')}
            defaultApprovers={defaultApprovers}
          />
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label>
              <span></span>הערות
            </label>
            <InputTextarea
              id="renameSingleOGForm-comments"
              {...register('comments')}
              type="text"
              autoResize="false"
              disabled={onlyForView}
              placeholder={!onlyForView && 'הכנס הערות לבקשה...'}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default RenameSingleOGForm;
