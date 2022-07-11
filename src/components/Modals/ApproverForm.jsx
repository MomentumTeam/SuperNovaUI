import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import Hierarchy from '../Fields/Hierarchy';
import Approver from '../Fields/Approver';
import { AutoComplete } from 'primereact/autocomplete';
import { useStores } from '../../context/use-stores';
import { toJS } from 'mobx';
import {
  searchEntitiesByFullName,
  getEntityByIdentifier,
  getOGById,
} from '../../service/KartoffelService';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { APPROVER_TYPES, USER_TYPE } from '../../constants';
import {
  isUserApproverType,
  userConverse,
  userTemplate,
  getRelevantApproverTypes,
} from '../../utils/user';
import { GetDefaultApprovers } from '../../utils/approver';
import '../../assets/css/local/components/approverForm.css';
import { Tooltip } from 'primereact/tooltip';
import { hierarchyConverse } from '../../utils/hierarchy';

const validationSchema = Yup.object().shape({
  approverType: Yup.string().required('יש להכניס סוג מאשר'),
  user: Yup.object()
    .required('יש לבחור משתמש')
    .typeError('נא לבחור משתמש')
    .test({
      name: 'valid-user-with-role',
      message: 'לא ניתן להוסיף למשתמש זה הרשאות מכיוון שהוא לא משוייך לתפקיד',
      test: (user) => {
        return user?.directGroup !== '';
      },
    }),
  hierarchy: Yup.object().required('יש לבחור היררכיה'),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when('isUserApprover', {
    is: false,
    then: Yup.array()
      .min(1, 'יש לבחור לפחות גורם מאשר אחד בדרגת סא"ל ומעלה')
      .required('יש לבחור לפחות גורם מאשר אחד בדרגת סא"ל ומעלה'),
  }),
  comments: Yup.string().optional(),
  userName: Yup.string()
    .required('יש לבחור שם משתמש')
    .test({
      name: 'valid-user',
      message: 'נא לבחור משתמש',
      test: (userName, context) => {
        return userName && context.parent?.user;
      },
    }),
  personalNumber: Yup.string().required('יש למלא ערך'),
  hierarchyOf: Yup.object().when('approverType', {
    is: (value) =>
      value === USER_TYPE.ADMIN ||
      value === USER_TYPE.SPECIAL_GROUP ||
      value === USER_TYPE.SECURITY_ADMIN,
    then: Yup.object().required('יש לבחור היררכיה'),
    otherwise: Yup.object(),
  }),
});

const ApproverForm = forwardRef(
  ({ onlyForView, requestObject, setIsActionDone }, ref) => {
    const { appliesStore, userStore, configStore } = useStores();
    const [defaultApprovers, setDefaultApprovers] = useState([]);

    const ApproverOptions = getRelevantApproverTypes(
      userStore.user,
      onlyForView
    );

    const {
      register,
      handleSubmit,
      setValue,
      getValues,
      formState,
      watch,
      clearErrors,
    } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover: isUserApproverType(userStore.user) },
    });
    const [userSuggestions, setUserSuggestions] = useState([]);
    const { errors } = formState;

    useEffect(async () => {
      setValue('approverType', USER_TYPE.COMMANDER);

      if (requestObject) {
        setValue('comments', requestObject.comments);
        setValue('userName', requestObject.additionalParams.displayName);
        setValue('approverType', requestObject.additionalParams.type);
        setValue(
          'personalNumber',
          requestObject.additionalParams.personalNumber ||
            requestObject.additionalParams.identityCard
        );

        try {
          const hierarchy = await getOGById(
            requestObject.additionalParams.directGroup
          );
          setValue('hierarchy', {
            name: hierarchyConverse(hierarchy),
          });

          let hierarchyOfId;
          switch (requestObject.additionalParams.type) {
            case USER_TYPE.ADMIN:
            case USER_TYPE.SECURITY_ADMIN:
              hierarchyOfId = requestObject.additionalParams.groupInChargeId;
              break;

            case USER_TYPE.SPECIAL_GROUP:
              hierarchyOfId = requestObject.additionalParams.specialGroupId;
              break;
          }

          const hierarchyOf = await getOGById(hierarchyOfId);

          setValue('hierarchyOf', {
            name: hierarchyConverse(hierarchyOf),
          });

          watch('hierarchyOf');
        } catch (error) {}
      }

      const result = await GetDefaultApprovers({
        request: requestObject,
        onlyForView,
        user: userStore.user,
        highCommander: true,
      });

      setDefaultApprovers(result || []);
      setValue('isUserApprover', result.length > 0);
    }, []);

    const onSubmit = async (data) => {
      const {
        approvers,
        user,
        hierarchy,
        approverType,
        comments,
        groupInChargeId,
        specialGroupId,
      } = data;

      try {
        await validationSchema.validate(data);
      } catch (err) {
        throw new Error(err.errors);
      }

      const req = {
        status: 'SUBMITTED',
        commanders: approvers,
        additionalParams: {
          entityId: user.id,
          displayName: userConverse(user),
          domainUsers: (user?.digitalIdentities || []).map(
            ({ uniqueId, mail }) => uniqueId || mail
          ),
          type: approverType,
          directGroup: hierarchy.directGroup,
          ...(user.akaUnit && { akaUnit: user.akaUnit }),
          ...(user.personalNumber && { personalNumber: user.personalNumber }),
          ...(user.identityCard && { identityCard: user.identityCard }),
          ...(groupInChargeId && { groupInChargeId }),
          ...(specialGroupId && { specialGroupId }),
        },
        comments,
        due: Date.now(),
      };

      await appliesStore.createNewApproverApply(req);
      setIsActionDone(true);
    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: handleSubmit(onSubmit),
      }),
      []
    );
    const handleApprover = async (e) => {
      setValue('approverType', e.value);
      setValue('groupInChargeId', '');
      setValue('specialGroupId', '');
      setValue('hierarchyOf', undefined);
      clearCurrentUser();

      switch (e.value) {
        case USER_TYPE.ADMIN: {
          setDefaultApprovers(
            toJS(configStore.CREATE_ADMIN_REQS_APPROVERS) || []
          );
          setValue('approvers', toJS(configStore.CREATE_ADMIN_REQS_APPROVERS));
          break;
        }
        case USER_TYPE.BULK: {
          setDefaultApprovers(
            toJS(configStore.CREATE_BULK_REQS_APPROVERS) || []
          );
          setValue('approvers', toJS(configStore.CREATE_BULK_REQS_APPROVERS));
          break;
        }
        case USER_TYPE.SPECIAL_GROUP: {
          setCurrentUser();
          setDefaultApprovers(
            toJS(configStore.CREATE_SPECIAL_GROUP_REQS_APPROVERS) || []
          );
          setValue(
            'approvers',
            toJS(configStore.CREATE_SPECIAL_GROUP_REQS_APPROVERS)
          );
          break;
        }
        case USER_TYPE.SECURITY_ADMIN: {
          setDefaultApprovers(
            toJS(configStore.CREATE_SECURITY_ADMIN_REQS_APPROVERS) || []
          );
          setValue(
            'approvers',
            toJS(configStore.CREATE_SECURITY_ADMIN_REQS_APPROVERS)
          );
          break;
        }
        default: {
          const result = await GetDefaultApprovers({
            request: requestObject,
            user: userStore.user,
            highCommander: true,
          });
          setDefaultApprovers(result || []);
          setValue('isUserApprover', result.length > 0);
          setValue('approvers', []);
          break;
        }
      }
    };

    const onSearchUserByPersonalNumber = async () => {
      const userId = getValues('personalNumber');
      if (!userId) return;

      try {
        const user = await getEntityByIdentifier(userId);

        if (user) {
          setValue('user', user, { shouldValidate: true });
          setValue('userName', userConverse(user));
          setValue('hierarchy', {
            hierarchy: user.hierarchy,
            directGroup: user.directGroup,
          });
        }
      } catch (error) {
        clearErrors('user');
        setValue('user', {});
        setValue('userName', '');
        setValue('hierarchy', '');
      }
    };

    const onSearchUser = async (event) => {
      if (event.query.length > 1) {
        const result = await searchEntitiesByFullName(event.query);
        setUserSuggestions(result.entities || []);
      } else {
        setUserSuggestions([]);
      }
    };

    const setCurrentUser = () => {
      const user = toJS(userStore.user);
      setValue('userName', userConverse(user));
      setValue('user', user, { shouldValidate: true });
      setValue('personalNumber', user.personalNumber || user.identityCard);
      setValue('hierarchy', {
        hierarchy: user.hierarchy,
        directGroup: user.directGroup,
      });
    };

    const clearCurrentUser = () => {
      setValue('userName', '');
      setValue('user', null);
      setValue('personalNumber', '');
      setValue('hierarchy', null);
    };

    const handleOrgSelected = async () => {
      if (getValues('hierarchyOf')?.id) {
        if (
          getValues('approverType') === USER_TYPE.ADMIN ||
          getValues('approverType') === USER_TYPE.SECURITY_ADMIN
        )
          setValue('groupInChargeId', getValues('hierarchyOf').id);
        else if (getValues('approverType') === USER_TYPE.SPECIAL_GROUP)
          setValue('specialGroupId', getValues('hierarchyOf').id);
      }
    };

    return (
      <div className="p-fluid">
        <span
          style={{
            // marginRight: '60px',
            marginBottom: '30px',
            // marginTop: '-20px',
            // display: 'inline-block',
            fontSize: '85%',
            color: '#73777B',
          }}
        >
          בקשה להרשאות במערכת LEGO.
          <br />
          הרשאות מסוג ניהול עבור אישור בקשות במערכת בהתאם לצורך. עבור הרשאת
          מקורות ומערכות מודיעיניות יש לפנות למערכת במוס.
        </span>{' '}
        <div
          className={
            watch('approverType') == USER_TYPE.ADMIN ||
            watch('approverType') === USER_TYPE.SPECIAL_GROUP ||
            watch('approverType') === USER_TYPE.SECURITY_ADMIN
              ? 'p-fluid-item'
              : 'p-fluid-item p-fluid-item-flex1'
          }
        >
          <div className="p-field">
            {onlyForView && (
              <Tooltip
                target={`.approverTypeDiv`}
                content={
                  APPROVER_TYPES.find(
                    (type) => type.value === watch('approverType')
                  )?.label
                }
                tooltipOptions={{ showOnDisabled: true }}
                position="top"
              />
            )}
            <label htmlFor="2011">
              <span className="required-field">*</span>סוג גורם מאשר במערכת LEGO
            </label>
            <div className="approverTypeDiv">
              <Dropdown
                {...register('approverType')}
                disabled={onlyForView}
                className={`dropDownInput ${onlyForView ? `disabled` : ''} `}
                value={watch('approverType')}
                id="approverForm-approverType"
                inputId="2011"
                required
                options={ApproverOptions}
                onChange={handleApprover}
              />
            </div>
          </div>
        </div>
        {(watch('approverType') === USER_TYPE.ADMIN ||
          watch('approverType') === USER_TYPE.SPECIAL_GROUP ||
          watch('approverType') === USER_TYPE.SECURITY_ADMIN) && (
          <div className="p-fluid-item">
            <div className="p-field">
              <Hierarchy
                setValue={setValue}
                name="hierarchyOf"
                errors={errors}
                ogValue={watch('hierarchyOf')}
                disabled={onlyForView}
                labelText={
                  watch('approverType') === USER_TYPE.ADMIN
                    ? 'ההיררכיה שבה תהיו מחשוב יחידתי'
                    : watch('approverType') === USER_TYPE.SPECIAL_GROUP
                    ? 'ההירכיה שבה יתווסף שלב האישור'
                    : 'ההירכיה שבה תהיו קב"ם היחידתי'
                }
                onOrgSelected={handleOrgSelected}
              />
            </div>
          </div>
        )}
        <div className="p-fluid-item" id="username-form">
          <div className="p-field">
            {onlyForView && (
              <Tooltip
                target={`.userNameText`}
                content={watch('userName')}
                tooltipOptions={{ showOnDisabled: true }}
                position="top"
              />
            )}
            <label htmlFor="2020">
              <span className="required-field">*</span>שם מלא
            </label>

            {watch('approverType') !== USER_TYPE.SPECIAL_GROUP && (
              <button
                className="btn-underline left19 approver-fillMe"
                onClick={setCurrentUser}
                type="button"
                title="עבורי"
                id="approverForm-forme"
                style={onlyForView && { display: 'none' }}
              >
                עבורי
              </button>
            )}
            <AutoComplete
              value={watch('userName')}
              suggestions={userSuggestions}
              completeMethod={onSearchUser}
              id="approverForm-userName"
              type="text"
              itemTemplate={userTemplate}
              className="userNameText"
              field={userConverse}
              onSelect={(e) => {
                setValue('user', e.value, { shouldValidate: true });
                setValue(
                  'personalNumber',

                  e.value.entityType === configStore.USER_ROLE_ENTITY_TYPE
                    ? e.value.goalUserId
                    : e.value.employeeId ||
                        e.value.personalNumber ||
                        e.value.identityCard
                );
                setValue('hierarchy', {
                  hierarchy: e.value.hierarchy,
                  directGroup: e.value.directGroup,
                });
              }}
              onChange={(e) => {
                clearErrors('user');
                setValue(
                  'userName',
                  e.value.fullName ? userConverse(e.value) : e.value
                );
                setValue('personalNumber', '');
                setValue('user', null, { shouldValidate: true });
                setValue('hierarchy', '');
              }}
              required
              disabled={
                onlyForView || watch('approverType') === USER_TYPE.SPECIAL_GROUP
              }
            />
            {errors.user && (
              <small style={{ color: 'red' }}>
                {errors.user?.message ? errors.user.message : 'יש למלא ערך'}
              </small>
            )}
          </div>
        </div>
        <div className="p-fluid-item">
          <div className="p-field">
            <label htmlFor="2021">
              {' '}
              <span className="required-field">*</span>מ"א/ת"ז/brole
            </label>
            <InputText
              {...register('personalNumber', { required: true })}
              id="approverForm-personalNumber"
              type="text"
              keyfilter={userStore.isUserExternal ? '' : 'pnum'}
              required
              onBlur={onSearchUserByPersonalNumber}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearchUserByPersonalNumber();
                }
              }}
              onInput={() => {
                clearErrors('user');
                setValue('user', null);
                setValue('userName', '');
                setValue('hierarchy', '');
              }}
              disabled={
                onlyForView || watch('approverType') === USER_TYPE.SPECIAL_GROUP
              }
            />
            {errors.personalNumber && (
              <small style={{ color: 'red' }}>
                {' '}
                {errors.personalNumber?.message
                  ? errors.personalNumber.message
                  : 'יש למלא ערך'}
              </small>
            )}
          </div>
        </div>
        <div className="p-fluid-item">
          <Hierarchy
            disabled={true}
            setValue={setValue}
            name="hierarchy"
            ogValue={
              onlyForView
                ? getValues('hierarchy')
                : getValues('hierarchy')?.hierarchy
            }
            errors={errors}
            userHierarchy={
              userStore.user && userStore.user.hierarchy
                ? userStore.user.hierarchy
                : null
            }
          />
        </div>
        <div className="p-fluid-item">
          <Approver
            setValue={setValue}
            name="approvers"
            multiple={true}
            errors={errors}
            tooltip={'סא"ל ומעלה ביחידתך'}
            isHighRank={true}
            disabled={
              onlyForView ||
              watch('isUserApprover') ||
              watch('approverType') === USER_TYPE.ADMIN ||
              watch('approverType') === USER_TYPE.BULK ||
              watch('approverType') === USER_TYPE.SPECIAL_GROUP ||
              watch('approverType') === USER_TYPE.SECURITY_ADMIN
            }
            defaultApprovers={defaultApprovers}
          />
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="2016">הערות</label>
            <InputTextarea
              {...register('comments')}
              id="approverForm-comments"
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

ApproverForm.defaultProps = {
  onlyForView: undefined,
  approverRequestObj: {},
};

export default ApproverForm;
