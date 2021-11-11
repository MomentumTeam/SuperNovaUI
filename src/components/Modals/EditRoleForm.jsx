import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import Hierarchy from './Hierarchy';
import Approver from '../Fields/Approver';
import { useStores } from '../../context/use-stores';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  getRolesUnderOG,
  getRoleByRoleId,
} from '../../service/KartoffelService';

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  hierarchy: Yup.object().required(),
  role: Yup.object().required(),
  approvers: Yup.array().min(1).required(),
  comments: Yup.string().optional(),
  identifier: Yup.string().email().required(),
  jobTitle: Yup.string().required(),
  clearance: Yup.number(),
});

const EditRoleForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore } = useStores();
    const [hierarchyByIdentifier, setHierarchyByIdentifier] = useState(null);

    const { register, handleSubmit, setValue, watch, formState } = useForm({
      resolver: yupResolver(validationSchema),
    });
    const [roles, setRoles] = useState([]);
    const { errors } = formState;

    useEffect(() => {
      const initializeValues = async () => {
        setValue('commanders', requestObject.commanders);
        setValue('prevJobTitle', requestObject.prevJobTitle);
        setValue('jobTitle', requestObject.kartoffelParams.jobTitle);
        setValue('identifier', requestObject.kartoffelParams.roleId);
        setValue('hierarchy', requestObject.adParams.ouDisplayName);
        const role = await getRoleByRoleId(
          requestObject.kartoffelParams.roleId
        );
        console.log('this is the role:', role);
        setHierarchyByIdentifier(role.hierarchy);

        setValue('role', role);
        setValue('clearance', role.clearance);

        setRoles([role]);
      };

      if (requestObject) {
        console.log(requestObject);
        initializeValues();
      }
    }, []);

    const onSubmit = async (data) => {
      try {
        await validationSchema.validate(data);
      } catch (err) {
        throw new Error(err.errors);
      }
      const { identifier, approvers, hierarchy, comments, role } = data;
      const req = {
        comments: comments,
        commanders: approvers,
        kartoffelParams: {
          roleId: identifier,
          directGroup: hierarchy.id,
          jobTitle: role.jobTitle,
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

      if (value?.id) {
        setRoles((await getRolesUnderOG(value.id)).roles);
      }
    };

    return (
      <div className='p-fluid'>
        <div className='p-fluid-item p-fluid-item'>
          <div className='p-field'>
            <label htmlFor='2021'>
              <span className='required-field'>*</span>שם תפקיד
            </label>
            <InputText
              {...register('jobTitle')}
              id='2021'
              type='text'
              required
              value={watch('jobTitle')}
              placeholder='שם תפקיד'
              disabled={onlyForView}
            />
            <label>
              {errors.jobTitle && (
                <small style={{ color: 'red' }}>יש למלא ערך</small>
              )}
            </label>
          </div>
        </div>
        <div className='p-fluid-item p-fluid-item'>
          <div className='p-field'>
            <label htmlFor='2021'>
              <span className='required-field'>*</span>שם תפקיד לשעבר
            </label>
            <InputText
              {...register('prevJobTitle')}
              id='2021'
              type='text'
              required
              value={watch('prevJobTitle')}
              placeholder='שם תפקיד לשעבר'
              disabled={onlyForView}
            />
            <label>
              {errors.jobTitle && (
                <small style={{ color: 'red' }}>יש למלא ערך</small>
              )}
            </label>
          </div>
        </div>
        <div className='p-fluid-item p-fluid-item'>
          <div className='p-field'>
            <Hierarchy
              setValue={setCurrentHierarchyFunction}
              name='currentHierarchy'
              ogValue={hierarchyByIdentifier}
              errors={errors}
              disabled={onlyForView}
            />
          </div>
        </div>
        <div className='p-fluid-item-flex p-fluid-item'>
          <div className='p-field'>
            <label>
              <span className='required-field'>*</span>סיווג תפקיד
            </label>
            <Dropdown
              placeholder={watch('clearance')}
              {...register('clearance')}
              value={watch('clearance')}
              optionLabel={watch('clearance')}
              disabled={onlyForView}
            />
            <label>
              {errors.clearance && (
                <small style={{ color: 'red' }}>יש למלא ערך</small>
              )}
            </label>
          </div>
        </div>
        <div className='p-fluid-item-flex p-fluid-item'>
          <div className='p-field'>
            <label>
              <span className='required-field'></span>יוזר
            </label>
            <InputText
              {...register('identifier')}
              type='text'
              placeholder='מזהה תפקיד'
              disabled={onlyForView}
            />
            <label>
              {errors.identifier && (
                <small style={{ color: 'red' }}>יש למלא ערך</small>
              )}
            </label>
          </div>
        </div>
        <div className='p-fluid-item'>
          <Approver
            setValue={setValue}
            name='approvers'
            multiple={true}
            errors={errors}
            defaultApprovers={requestObject?.commanders || []}
            disabled={onlyForView}
          />
        </div>
      </div>
    );
  }
);

export default EditRoleForm;
