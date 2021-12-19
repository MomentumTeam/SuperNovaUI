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
import { Calendar } from 'primereact/calendar';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import HorizontalLine from '../HorizontalLine';
import '../../assets/css/local/components/calendar.css';
import InfoPopup from '../InfoPopup';
import '../../assets/css/local/components/approverForm.css';

import {
  searchEntitiesByFullName,
  getRolesUnderOG,
  getRoleByRoleId,
  getOGById,
  getEntityByIdentifier,
  getEntityByRoleId,
  getEntityByMongoId,
} from '../../service/KartoffelService';
import { isApproverValid } from '../../service/ApproverService';
import { USER_SOURCE_DI, USER_TYPE } from '../../constants';
import { isUserHoldType } from '../../utils/user';
import { GetDefaultApprovers } from '../../utils/approver';
import { getSamAccountNameFromUniqueId } from '../../utils/fields';

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  userName: Yup.string().required(),
  personalNumber: Yup.string().required(),
  hierarchy: Yup.object().required(),
  role: Yup.object().required(),
  roleId: Yup.string().required(), // TODO: talk with liron
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when('isUserApprover', {
    is: false,
    then: Yup.array()
      .min(1, 'יש לבחור לפחות גורם מאשר אחד')
      .required('יש לבחור לפחות גורם מאשר אחד'),
  }),
  comments: Yup.string().optional(),
  approverErrorMessage: Yup.string().length(0),
});

const AssignRoleToEntityForm = forwardRef(
  ({ showJob = true, setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore } = useStores();
    const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);
    const [approvers, setApprovers] = useState(
      GetDefaultApprovers(requestObject, onlyForView, showJob)
    );

    const { register, handleSubmit, setValue, getValues, watch, formState } =
      useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: { isUserApprover },
      });
    const [userSuggestions, setUserSuggestions] = useState([]);
    const [roles, setRoles] = useState([]);
    const { errors } = formState;

    useEffect(() => {
      const initializeValues = async () => {
        setValue('userName', requestObject.adParams.fullName);
        setValue('comments', requestObject.comments);
        setValue('roleId', requestObject.adParams.newSAMAccountName);
        const user = await getEntityByMongoId(requestObject.kartoffelParams.id);
        setValue('user', user);
        setValue('personalNumber', user.personalNumber || user.identityCard);
        const role = await getRoleByRoleId(
          requestObject.adParams.newSAMAccountName
        );
        setValue('hierarchy', role.hierarchy);
        setValue('role', role);
        setRoles([role]);
        await handleRoleSelected(requestObject.adParams.newSAMAccountName);

        // TODO: fix due
        setValue('changeRoleAt', +requestObject.due);
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
      const { changeRoleAt, approvers, roleId, comments, user } = data;
      console.log('approvers', approvers);
      const userRole = getUserRole();
      const req = {
        commanders: approvers,
        kartoffelParams: {
          id: user.id,
          uniqueId: roleId,
          needDisconnect: showJob,
        },
        adParams: {
          newSAMAccountName: roleId,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          rank: user.rank,
          roleSerialCode: '???', // TODO: WTF is this??,
        },
        comments,
        due: changeRoleAt ? new Date(changeRoleAt).getTime() : Date.now(),
      };

      if (
        userRole?.digitalIdentityUniqueId &&
        userRole?.digitalIdentityUniqueId !== ''
      ) {
        req.adParams.oldSAMAccountName = getSamAccountNameFromUniqueId(
          userRole?.digitalIdentityUniqueId
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

      if (!user) {
        return null;
      }

      if (user?.digitalIdentities && Array.isArray(user?.digitalIdentities)) {
        const relevantIdentity = user.digitalIdentities.find(
          (identity) => identity.source === USER_SOURCE_DI
        );
        if (relevantIdentity && relevantIdentity.role) {
          return relevantIdentity.role;
        }
      }

      return null;
    };

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

    const handleOrgSelected = async (org) => {
      const result = await getRolesUnderOG({ id: org.id });
      setRoles(result || []);
    };

    const onSearchUserById = async () => {
      const userId = getValues('personalNumber');

      if (!userId) {
        return;
      }

      const user = await getEntityByIdentifier(userId);

      if (user) {
        setValue('user', user);
        setValue('userName', user.fullName);
        setValue('userRole', user.jobTitle);
      }
    };

    const handleRoleSelected = async (roleId) => {
      try {
        const entity = await getEntityByRoleId(roleId);
        if (entity) {
          setValue('currentRoleUser', entity.fullName);
          if (isUserApprover) {
            setApprovers([entity]);
            if (entity.identityCard === '') delete entity.identityCard;
            if (entity.personalNumber === '') delete entity.personalNumber;
            setValue('approvers', [entity]);
          }
        }
      } catch (err) {
        setValue('roleId', roleId);
        if (isUserApprover) {
          setApprovers([userStore.user]);
        }
      }
    };

    const onRoleIdChanged = async () => {
      const roleId = getValues('roleId');

      if (!roleId) {
        setValue('role', null);
        setValue('currentRoleUser', '');
        if (isUserApprover) {
          setApprovers([]);
        }
        return;
      }

      let role = roles.find((role) => role.digitalIdentityUniqueId === roleId);

      if (!role) {
        role = await getRoleByRoleId(roleId);
      }

      let hierarchy = getValues('hierarchy');

      if (!hierarchy) {
        hierarchy = await getOGById(role.directGroup);
      }

      setValue('hierarchy', hierarchy);
      setRoles(Array.from(new Set([...roles, role])));
      setValue('role', role);

      handleRoleSelected(role.roleId);
    };

    const itemTemplate = (item) => <>{item.displayName}</>;

    const setApproverValue = async (name, data) => {
      const newGroupId = watch('hierarchy')?.id;

      if (!newGroupId) {
        setValue('approverErrorMessage', 'יש לבחור היררכיה');
      } else {
        data.forEach(async (item) => {
          try {
            const { isValid } = await isApproverValid(item.id, newGroupId);
            if (!isValid) {
              setValue(
                'approverErrorMessage',
                'יש לבחור מאשרים תקינים (מהיחידה בלבד)'
              );
            } else {
              setValue('approverErrorMessage', '');
            }
          } catch (err) {
            if (err) {
              setValue(
                'approverErrorMessage',
                'יש לבחור מאשרים תקינים (מהיחידה בלבד)'
              );
            }
          }
        });
      }

      return setValue(name, data);
    };

    const userRole = getUserRole();
    const userRoleDisplay = userRole ? userRole.jobTitle : ' - ';

    return (
      <div className="p-fluid" style={{ flexDirection: 'column' }}>
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
                  style={onlyForView && { display: 'none' }}
                >
                  עבורי
                </button>
              )}
              <AutoComplete
                value={watch('userName')}
                suggestions={userSuggestions}
                completeMethod={onSearchUser}
                id="2020"
                type="text"
                itemTemplate={itemTemplate}
                field="fullName"
                onSelect={(e) => {
                  setValue('user', e.value);
                  setValue(
                    'personalNumber',
                    e.value.personalNumber || e.value.identityCard
                  );
                  setValue('userRole', e.value.jobTitle);
                }}
                onChange={(e) => {
                  setValue(
                    'userName',
                    e.value.fullName ? e.value.fullName : e.value
                  );
                  if (e.value === '') {
                    setValue('personalNumber', '');
                    setValue('user', null);
                  }
                }}
                required
                disabled={onlyForView}
              />
              <label htmlFor="2020">
                {' '}
                {errors.userName && (
                  <small style={{ color: 'red' }}>יש למלא ערך</small>
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
                <span className="required-field">*</span>מ"א/ת"ז
              </label>
              <InputText
                {...register('personalNumber', { required: true })}
                id="2021"
                type="text"
                required
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
                  <small style={{ color: 'red' }}>יש למלא ערך</small>
                )}
              </label>
            </div>
          </div>
          {showJob ? (
            <div className="p-fluid-item">
              <div className="p-field p-field-blue">
                <label htmlFor="2022">תפקיד</label>
                <InputText
                  id="2022"
                  disabled
                  type="text"
                  placeholder="תפקיד"
                  value={userRoleDisplay}
                />
              </div>
            </div>
          ) : null}
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
          <h2 style={{ padding: 0 }}>מעבר לתפקיד</h2>
          <InfoPopup
            infoText='שימו לב❣️ במידה והתפקיד אינו פנוי יש לבחור תאריך ושעה לביצוע ההחלפה בתיאום מראש עם מבצע התפקיד.עבור רס"ן ומעלה הגורם המאשר יהיה מבצע התפקיד.'
            name="מעבר לתפקיד"
            visible={!onlyForView}
            withTitle={false}
            warning
          ></InfoPopup>
        </div>
        <div style={{ display: 'flex' }}>
          <div className="p-fluid-item-flex p-fluid-item">
            <Hierarchy
              ogValue={watch('hierarchy')}
              setValue={setValue}
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
              <label htmlFor="2025">שם תפקיד</label>
              <Dropdown
                {...register('role')}
                inputId="2025"
                options={roles}
                optionLabel="jobTitle"
                value={watch('role')}
                onChange={(e) => {
                  setValue('role', e.value);
                  setValue('roleId', e.value.digitalIdentityUniqueId);
                  handleRoleSelected(e.value.roleId);
                }}
                disabled={onlyForView}
              />
              <label htmlFor="2021">
                {' '}
                {errors.role && (
                  <small style={{ color: 'red' }}>יש למלא ערך</small>
                )}
              </label>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div className="p-fluid-item">
            <div className="p-field">
              <label htmlFor="2026">מזהה תפקיד (T)</label>
              <InputText
                {...register('roleId')}
                id="2026"
                type="text"
                onBlur={onRoleIdChanged}
                tooltip={'לדוגמה: "T12345678"'}
                tooltipOptions={{ position: 'top' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onRoleIdChanged();
                  }
                }}
                disabled={onlyForView}
              />
              <label htmlFor="2021">
                {' '}
                {errors.roleId && (
                  <small style={{ color: 'red' }}>יש למלא ערך</small>
                )}
              </label>
            </div>
          </div>
          <div className="p-fluid-item-flex p-fluid-item">
            {watch('roleId') && (
              <div
                className={`p-field ${
                  watch('currentRoleUser') ? 'p-field-red' : 'p-field-green'
                }`}
                style={{ marginLeft: '10px' }}
              >
                <label htmlFor="2024">סטטוס תפקיד</label>
                <InputText
                  {...register('roleStatus')}
                  id="2024"
                  disabled
                  type="text"
                  placeholder={watch('currentRoleUser') ? 'לא פנוי' : 'פנוי'}
                />
              </div>
            )}
            {watch('currentRoleUser') && (
              <div className="p-field">
                <label htmlFor="2030">מבצע תפקיד</label>
                <InputText
                  {...register('currentRoleUser')}
                  id="2030"
                  type="text"
                  disabled
                  placeholder="מבצע תפקיד"
                />
              </div>
            )}
          </div>
        </div>
        <div className="row3flex">
          {watch('currentRoleUser') && (
            <div className="p-fluid-item">
              <div className="p-field">
                <label htmlFor="2027">בצע החלפה בתאריך</label>
                <Calendar
                  {...register('changeRoleAt')}
                  id="2027"
                  showTime
                  value={watch('changeRoleAt')}
                  onChange={(e) => setValue('changeRoleAt', e.target.value)}
                  placeholder="בצע החלפה בתאריך"
                  disabled={onlyForView}
                />
                <label htmlFor="2021">
                  {' '}
                  {errors.changeRoleAt && (
                    <small style={{ color: 'red' }}>יש למלא ערך</small>
                  )}
                </label>
              </div>
            </div>
          )}
          <div className="p-fluid-item">
            <Approver
              setValue={setApproverValue}
              name="approvers"
              tooltip='רס"ן ומעלה ביחידתך'
              multiple={true}
              defaultApprovers={approvers}
              disabled={onlyForView || isUserApprover}
              errors={errors}
            />
            <label htmlFor="2021">
              {watch('approverErrorMessage') && (
                <small style={{ color: 'red' }}>
                  {watch('approverErrorMessage')}
                </small>
              )}
            </label>
          </div>
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="2028">סיבת מעבר</label>
            <InputTextarea
              {...register('comments')}
              id="2028"
              type="text"
              placeholder={!onlyForView && 'הכנס הערות לבקשה...'}
              disabled={onlyForView}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default AssignRoleToEntityForm;
