import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import Hierarchy from '../Fields/Hierarchy';
import Approver from '../Fields/Approver';
import { useStores } from '../../context/use-stores';
import { toJS } from 'mobx';
import { AutoComplete } from 'primereact/autocomplete';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import HorizontalLine from '../HorizontalLine';
import '../../assets/css/local/components/calendar.css';
import InfoPopup from '../InfoPopup';
import '../../assets/css/local/components/approverForm.css';
import { Tooltip } from 'primereact/tooltip';

import {
  searchEntitiesByFullName,
  getRolesUnderOG,
  getRoleByRoleId,
  getOGById,
  getEntityByIdentifier,
  getEntityByRoleId,
  getEntityByMongoId,
  searchRolesByRoleId,
} from '../../service/KartoffelService';
import { getUserTypeReq, isApproverValid } from '../../service/ApproverService';
import { USER_TYPE } from '../../constants';
import { isUserApproverType } from '../../utils/user';
import { GetDefaultApprovers } from '../../utils/approver';
import {
  getSamAccountNameFromUniqueId,
  getUserRelevantIdentity,
} from '../../utils/fields';
import { InputCalanderField } from '../Fields/InputCalander';
import { hierarchyConverse } from '../../utils/hierarchy';

const validationSchema = Yup.object().shape({
  isSwitchRole: Yup.boolean(),
  user: Yup.object()
    .required('נא לבחור משתמש')
    .typeError('נא לבחור משתמש')
    .when('isSwitchRole', {
      is: true,
      then: Yup.object()
        .typeError('נא לבחור משתמש')
        .test({
          name: 'user-doesnt-have-role',
          message: `נראה שהמשתמש אינו מחובר לתפקיד, לא ניתן לקיים את הבקשה, נא לעבור לטופס של משתמש חדש`,
          test: (user) => {
            const relevantIdentity = getUserRelevantIdentity(user);
            return relevantIdentity;
          },
        }),
      otherwise: Yup.object()
        .typeError('נא לבחור משתמש')
        .test({
          name: 'user-has-role',
          message: `נראה שהמשתמש כבר מחובר לתפקיד, לא ניתן לקיים את הבקשה, נא לעבור לטופס של מעבר תפקיד`,
          test: (user) => {
            const relevantIdentity = getUserRelevantIdentity(user);
            return !relevantIdentity;
          },
        }),
    }),
  userName: Yup.string()
    .required('יש למלא שם משתמש')
    .test({
      name: 'valid-user',
      message: 'נא לבחור משתמש',
      test: (userName, context) => {
        return userName && context.parent?.user;
      },
    }),
  personalNumber: Yup.string().required('יש למלא ערך'),
  hierarchy: Yup.object().required('נא לבחור היררכיה'),
  role: Yup.object()
    .required('נא לבחור תפקיד')
    .test({
      name: 'valid-roleid',
      message: 'לא ניתן לשייך תפקיד זה למשתמש',
      test: (role) => {
        return (
          role?.digitalIdentityUniqueId && role.digitalIdentityUniqueId !== ''
        );
      },
    })
    .test({
      name: 'is-current-role',
      message: 'נראה שבחרת את התפקיד הנוכחי שלך... אנא בחר תפקיד אחר',
      test: (role, context) => {
        const { user } = context.parent;

        if (user) {
          const isRoleConnectedToUser = role?.digitalIdentityUniqueId;
          const hasDigitalIdentityAlready =
            user?.digitalIdentities && isRoleConnectedToUser
              ? user.digitalIdentities.find(
                (identity) =>
                  identity.uniqueId === role.digitalIdentityUniqueId
              )
              : false;

          return !hasDigitalIdentityAlready;
        }

        return true;
      },
    }),
  roleId: Yup.string().required('יש למלא מזהה תפקיד'),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array()
    .when('isUserApprover', {
      is: false,
      then: Yup.array()
        .min(1, 'יש לבחור לפחות גורם מאשר אחד')
        .required('יש לבחור לפחות גורם מאשר אחד'),
    })
    .test({
      name: 'check-if-valid',
      message: 'יש לבחור מאשרים תקינים (מהיחידה בלבד)',
      test: async (approvers, context) => {
        let isTotalValid = true;

        if (context.parent?.hierarchy?.id && Array.isArray(approvers)) {
          await Promise.all(
            approvers.map(async (approver) => {
              if (
                !approver?.types ||
                !approver?.types.includes(USER_TYPE.ADMIN)
              ) {
                const { isValid } = await isApproverValid(
                  approver?.entityId || approver?.id,
                  context.parent.hierarchy.id
                );
                if (!isValid) isTotalValid = false;
              }
            })
          );
        }

        return isTotalValid;
      },
    }),
  comments: Yup.string().optional(),
  changeRoleAt: Yup.date().when('currentRoleUser', {
    is: (value) => value !== '',
    then: Yup.date()
      .typeError('תאריך לא תקין')
      .required('יש לבחור תאריך החלפה'),
    otherwise: Yup.date(),
  }),
});

const AssignRoleToEntityForm = forwardRef(
  ({ showJob = true, setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore } = useStores();
    const [roles, setRoles] = useState([]);
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [roleSuggestions, setRoleSuggestions] = useState([]);
    const [defaultApprovers, setDefaultApprovers] = useState([]);

    const isUserApprover = isUserApproverType(userStore.user);

    const {
      register,
      handleSubmit,
      setValue,
      getValues,
      watch,
      formState,
      clearErrors,
    } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover, role: null, user: null },
    });

    const { errors } = formState;

    useEffect(() => {
      setValue('isSwitchRole', showJob);
      const getNewEntity = async () => {
        // new entity
        try {
          const user = await getEntityByMongoId(
            requestObject.kartoffelParams.id
          );
          setValue('user', user);
          setValue('personalNumber', user.personalNumber || user.identityCard);
        } catch (error) { }
      };

      const getOldRole = async (roleId) => {
        // old role
        try {
          const oldRole = requestObject?.kartoffelParams?.role
            ? requestObject?.kartoffelParams?.role
            : await getRoleByRoleId(roleId);

          setValue('role', oldRole, { shouldValidate: true });
          setValue('clearance', oldRole?.clearance || '- - -');

          setRoles([oldRole]);
        } catch (error) {
          setValue('role', {});
          setValue('role', "");
          setValue('clearance', '- - -');

          setRoles([]);
        }
      };

      const initDefaultApprovers = async () => {
        const result = await GetDefaultApprovers({
          request: requestObject,
          onlyForView,
          user: userStore.user,
        });
        setDefaultApprovers(result || []);
      };

      const initializeValues = async () => {
        const roleId = requestObject.kartoffelParams.roleId;
        setValue('roleId', roleId);
        setValue('comments', requestObject.comments);
        setValue('userName', requestObject.adParams.fullName);
        setValue('changeRoleAt', +requestObject.due);
        setValue('hierarchy', {
          name: requestObject.kartoffelParams.hierarchy,
        });
        setValue(
          'currentRoleUser',
          requestObject?.kartoffelParams?.name
            ? requestObject.kartoffelParams.name
            : ''
        );

        await Promise.all[
          (getNewEntity(), getOldRole(roleId), initDefaultApprovers())
        ];
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
      const {
        changeRoleAt,
        approvers,
        roleId,
        comments,
        user,
        role,
        hierarchy,
        currentRoleUser,
      } = data;

      const userRole = getUserRole();

      const req = {
        commanders: approvers,
        kartoffelParams: {
          id: user.id,
          uniqueId: role.digitalIdentityUniqueId,
          needDisconnect: showJob,
          roleId: roleId,
          hierarchy: hierarchyConverse(hierarchy),
          directGroup: hierarchy.id,
          role: role,
          ...(currentRoleUser && { name: currentRoleUser }), // name of old entity if there is
        },
        adParams: {
          newSAMAccountName: getSamAccountNameFromUniqueId(roleId),
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          ...(user.rank && { rank: user.rank }),
          roleSerialCode: '?',
        },
        comments,
        due: changeRoleAt ? changeRoleAt.getTime() : Date.now(),
      };

      if (userRole?.roleId && userRole?.roleId !== '') {
        req.adParams.oldSAMAccountName = getSamAccountNameFromUniqueId(
          userRole?.roleId
        );
      }

      await appliesStore.assignRoleToEntityApply(req);
      setIsActionDone(true);
    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: handleSubmit(onSubmit),
      }),
      []
    );

    const getUserRole = () => {
      const user = watch('user');

      if (
        user &&
        user?.digitalIdentities &&
        Array.isArray(user?.digitalIdentities)
      ) {
        const relevantIdentity = getUserRelevantIdentity(user);
        if (relevantIdentity && relevantIdentity.role)
          return relevantIdentity.role;
      }

      return null;
    };

    // Submitted user
    const setCurrentUser = () => {
      const user = toJS(userStore.user);
      setValue('user', user);
      setValue('userName', user.fullName);
      setValue('personalNumber', user.personalNumber || user.identityCard);
    };

    const onSearchUser = async (event) => {
      if (event.query.length > 1) {
        const result = await searchEntitiesByFullName(event.query);
        setUserSuggestions(result.entities || []);
      } else {
        setUserSuggestions([]);
      }
    };

    const onSearchUserById = async () => {
      const userId = getValues('personalNumber');
      if (!userId) return;

      try {
        const user = await getEntityByIdentifier(userId);
        if (user) {
          setValue('user', user);
          setValue('userName', user.fullName);
          setValue('userRole', user.jobTitle);
        }
      } catch (error) {
        setValue('user', null);
        setValue('userName', '');
        setValue('userRole', '');
      }
    };

    // Form
    const handleOrgSelected = async (org) => {
      const result = await getRolesUnderOG({ id: org.id, direct: true });
      setRoles(result || []);
      setValue('roleId', '');
      setValue('currentRoleUser', '');
      setValue('clearance', '- - -');

    };

    const handleRoleSelected = async (roleId) => {
      let approver = [],
        entity;

      try {
        entity = await getEntityByRoleId(roleId);
        if (entity && entity.id != watch('user')?.id) {
          // If role is taken
          setValue('currentRoleUser', entity.fullName);

          // Check if the entity is approver, if not, set the
          const { type } = await getUserTypeReq(entity.id);
          const isEntityApprover = [USER_TYPE.COMMANDER, USER_TYPE.ADMIN].some(
            (userType) => type.includes(userType)
          );

          if (isEntityApprover) approver = [entity];
        } else {
          setValue('currentRoleUser', '');
          setValue('roleId', roleId);
          setValue('role.digitalIdentityUniqueId', '');
        }
      } catch (err) {
        setValue('currentRoleUser', '');
        setValue('roleId', roleId);
      }

      try {
        if (
          (isUserApprover && !entity) ||
          (isUserApprover && approver.length === 0)
        ) {
          const result = await GetDefaultApprovers({
            request: requestObject,
            onlyForView,
            user: userStore.user,
            groupId: getValues('hierarchy').id,
          });
          approver = result;
        }
      } catch (error) { }
      setDefaultApprovers(approver);
      setValue('approvers', approver);
      setValue('isUserApprover', approver.length > 0);
    };

    const onSearchRoleId = async (event) => {
      if (event.query.length > 1) {
        const result = await searchRolesByRoleId(event.query);
        setRoleSuggestions(result || []);
      } else {
        setRoleSuggestions([]);
      }
    };

    const onRoleIdSelected = async () => {
      const roleId = getValues('roleId');

      if (!roleId) {
        setValue('jobTitle', '');
        setValue('role', null);
        setValue('currentRoleUser', '');
        setValue('clearance', '- - -');

        if (isUserApprover) {
          setDefaultApprovers([]);
        }
        return;
      }

      // Get role
      let role = roles.find((role) => role.roleId === roleId);
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

      setValue('hierarchy', hierarchy, { shouldValidate: true });
      setRoles(Array.from(new Set([...roles, role])));
      setValue('role', role, { shouldValidate: true });
      setValue('clearance', role?.clearance || '- - -');

      handleRoleSelected(role.roleId);
    };

    const itemTemplate = (item) => (
      <>
        {item.displayName
          ? item.displayName
          : item.fullName + `${item.jobTitle ? '-' + item.jobTitle : ''}`}
      </>
    );

    const userRole = getUserRole();
    const userRoleDisplay = userRole ? userRole.jobTitle : ' - ';

    return (
      <div
        className="p-fluid"
        style={{ flexDirection: 'column' }}
        id="assignRoleToEntityForm"
      >
        <div style={{ display: 'flex' }}>
          <div className="p-fluid-item-flex p-fluid-item">
            <div className="p-field">
              <label htmlFor="2020">
                <span className="required-field">*</span>שם משתמש
              </label>

              {showJob && (
                <button
                  className="btn-underline left19 approver-fillMe"
                  onClick={setCurrentUser}
                  type="button"
                  title="עבורי"
                  id="assignRoleToEntityForm-id"
                  style={onlyForView && { display: 'none' }}
                >
                  עבורי
                </button>
              )}
              <AutoComplete
                value={watch('userName')}
                suggestions={userSuggestions}
                completeMethod={onSearchUser}
                id="assignRoleToEntityForm-userName"
                type="text"
                itemTemplate={itemTemplate}
                field="fullName"
                onSelect={(e) => {
                  setValue('user', e.value, { shouldValidate: true });
                  setValue(
                    'personalNumber',
                    e.value.employeeId ||
                      e.value.personalNumber ||
                      e.value.identityCard
                  );
                  setValue('userRole', e.value.jobTitle);
                }}
                onChange={(e) => {
                  setValue(
                    'userName',
                    e.value.fullName ? e.value.fullName : e.value
                  );
                  setValue('personalNumber', '');
                  setValue('user', null);
                }}
                required
                disabled={onlyForView}
              />
              <label htmlFor="2020">
                {' '}
                {errors.userName && (
                  <small style={{ color: 'red' }}>
                    {' '}
                    {errors.userName?.message
                      ? errors.userName.message
                      : 'יש למלא ערך'}
                  </small>
                )}
              </label>
            </div>
          </div>
          <div
            className="p-fluid-item-flex p-fluid-item"
            style={{ marginLeft: '10px' }}
          >
            <div className="p-field">
              <label htmlFor="2021">
                {' '}
                <span className='required-field'>*</span>מ"א/ת"ז
                {userStore.isUserExternal ? '/מזהה עובד' : ''}
                {userStore.isUserExternal && (
                  <>
                    <Tooltip target='.pi-caret-down' />
                    <i
                      data-pr-tooltip={`מזהה עובד יכתב בפורמט הבא -
                      x-y
                      כאשר x הוא מספר יחידה מלא
                      y הוא מספר עובד
                      ומקף מפריד בינהם `}
                      data-pr-position='left'
                      className='pi pi-caret-down'
                      style={{ fontSize: '10px', paddingRight: '5px' }}
                    ></i>
                  </>
                )}
              </label>
              <InputText
                {...register('personalNumber', { required: true })}
                id='assignRoleToEntityForm-personalNumber'
                type='text'
                keyfilter={userStore.isUserExternal ? '' : 'pnum'}
                required
                onInput={() => {
                  setValue('user', null);
                  setValue('userName', '');
                  setValue('userRole', '');
                }}
                onBlur={onSearchUserById}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearchUserById();
                  }
                }}
                disabled={onlyForView}
              />
              <label htmlFor="2021">
                {' '}
                {errors.personalNumber && (
                  <small style={{ color: 'red' }}>
                    {' '}
                    {errors.personalNumber?.message
                      ? errors.personalNumber.message
                      : 'יש למלא ערך'}
                  </small>
                )}
              </label>
            </div>
          </div>
          {showJob ? (
            <div className="p-fluid-item">
              <div className="p-field p-field-blue">
                <label htmlFor="2022">תפקיד</label>
                <InputText
                  id="assignRoleToEntityForm-role"
                  disabled
                  type="text"
                  placeholder="תפקיד"
                  value={userRoleDisplay}
                />
              </div>
            </div>
          ) : null}
          <label htmlFor="2020">
            {' '}
            <br></br>
            {errors.user && (
              <small style={{ color: 'red' }}>
                {' '}
                {errors.user?.message ? errors.user.message : 'יש למלא ערך'}
              </small>
            )}
          </label>
        </div>
        <HorizontalLine />
        <div
          className="display-flex title-wrap"
          style={{
            width: 'inherit',
            justifyContent: 'start',
            paddingBottom: '10px',
          }}
        >
          <h2 style={{ padding: 0 }}>
            {showJob ? 'מעבר לתפקיד' : 'חיבור לתפקיד'}
          </h2>
          <InfoPopup
            infoText={`שימו לב❣️
            ${showJob ? 'במעבר תפקיד ה-T מתחלף ל-T שאליו ביקשת לעבור!' : ''}
            במידה והתפקיד אינו פנוי יש לבחור תאריך ושעה לביצוע ההחלפה בתיאום מראש עם מבצע התפקיד.עבור רס"ן ומעלה הגורם המאשר יהיה מבצע התפקיד.`}
            name="מעבר לתפקיד"
            visible={!onlyForView}
            withTitle={true}
            warning
          ></InfoPopup>
        </div>
        <div style={{ display: 'flex' }}>
          <div className="p-fluid-item">
            <Hierarchy
              ogValue={watch('hierarchy')}
              setValue={(name, value) => {
                setValue('role', '');
                setValue('roleId', '');
                setValue('currentRoleUser', '');
                setValue('clearance', '- - -');
                setValue(name, value);
              }}
              name="hierarchy"
              onOrgSelected={handleOrgSelected}
              errors={errors}
              disabled={onlyForView}
              userHierarchy={
                userStore.user && userStore.user.hierarchy
                  ? userStore.user.hierarchy
                  : null
              }
            />
          </div>
          <div className="p-fluid-item ">
            <div className="p-field p-field-blue">
              <label htmlFor="2025">בחירת תפקיד מתוך רשימה</label>
              <Dropdown
                {...register('role')}
                id="assignRoleToEntityForm-role-dropdown"
                options={roles}
                optionLabel="jobTitle"
                value={watch('role')}
                onChange={(e) => {
                  setValue('role', e.value, { shouldValidate: true });
                  setValue('roleId', e.value.roleId, { shouldValidate: true });
                  setValue('clearance', e.value?.clearance || '- - -');
                  setValue('approvers', [], { shouldValidate: true });
                  setDefaultApprovers([]);

                  onRoleIdSelected();
                }}
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
              </label>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div className="p-fluid-item">
            <div className="p-field">
              <label htmlFor="2026">מזהה תפקיד (T)</label>
              <AutoComplete
                value={watch('roleId')}
                suggestions={roleSuggestions}
                completeMethod={onSearchRoleId}
                id="assignRoleToEntityForm-roleId"
                type="text"
                field="roleId"
                tooltip={!onlyForView && 'לדוגמה: "T12345678"'}
                tooltipOptions={{ position: 'top' }}
                onSelect={() => onRoleIdSelected()}
                onChange={(e) => {
                  setValue(
                    'roleId',
                    e.value.roleId ? e.value.roleId : e.value,
                    { shouldValidate: true }
                  );

                  setValue('currentRoleUser', '');
                  setValue('role', '');
                  setValue('clearance', '- - -');

                  setValue('approvers', []);
                  setDefaultApprovers([]);
                }}
                disabled={onlyForView}
              />
              <label htmlFor="2021">
                {errors.roleId && (
                  <small style={{ color: 'red' }}>
                    {errors.roleId?.message
                      ? errors.roleId.message
                      : 'יש למלא ערך'}
                  </small>
                )}
              </label>
            </div>
          </div>
          <div className="p-fluid-item-flex p-fluid-item">
            {watch('role') && (
              <div className="p-field" style={{ marginLeft: '10px' }}>
                <label htmlFor="2030">סיווג התפקיד</label>
                <InputText
                  {...register('clearance')}
                  id="assignRoleToEntityForm-clearance"
                  type="text"
                  disabled
                  style={{
                    textAlign: watch('clearance') === '- - -' && 'center',
                  }}
                />
              </div>
            )}
            {watch('roleId') &&
              watch('role') &&
              watch('role')?.digitalIdentityUniqueId && (
                <div
                  className={`p-field ${
                    watch('currentRoleUser') ? 'p-field-red' : 'p-field-green'
                  }`}
                >
                  <label htmlFor="2024">סטטוס תפקיד</label>
                  <InputText
                    {...register('roleStatus')}
                    id="assignRoleToEntityForm-roleStatus"
                    disabled
                    type="text"
                    placeholder={watch('currentRoleUser') ? 'לא פנוי' : 'פנוי'}
                  />
                </div>
              )}
          </div>
        </div>
        <div className="row3flex">
          {watch('currentRoleUser') && (
            <div className="p-fluid-item">
              <div className="p-field">
                <label htmlFor="2030">מבצע תפקיד נוכחי</label>
                <InputText
                  {...register('currentRoleUser')}
                  id="assignRoleToEntityForm-currentRoleUser"
                  type="text"
                  disabled
                  placeholder="מבצע תפקיד"
                />
              </div>
            </div>
          )}
          {watch('currentRoleUser') && (
            <InputCalanderField
              setValue={setValue}
              watch={watch}
              register={register}
              clearErrors={clearErrors}
              errors={errors}
              fieldName="changeRoleAt"
              displayName="בצע החלפה בתאריך"
              isEdit={!onlyForView}
              item={requestObject}
              canEdit={true}
              fromNow={true}
              showTime={true}
              id="assignRoleToEntityForm-changeRoleAt"
            />
          )}
          <div className="p-fluid-item">
            <Approver
              setValue={setValue}
              name="approvers"
              tooltip='רס"ן ומעלה בהיררכיה הנבחרת שבה נמצא התפקיד'
              multiple={true}
              defaultApprovers={defaultApprovers}
              disabled={onlyForView || watch('isUserApprover')}
              errors={errors}
            />
          </div>
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="2028">סיבת מעבר</label>
            <InputTextarea
              {...register('comments')}
              id="assignRoleToEntityForm-comments"
              type="text"
              placeholder={!onlyForView && 'הכנס הערות לבקשה...'}
              readOnly={onlyForView}
              className={onlyForView ? 'disabled' : ''}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default AssignRoleToEntityForm;
