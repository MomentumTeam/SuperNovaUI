import * as Yup from 'yup';
import React, { useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

import Hierarchy from '../../Fields/Hierarchy';
import Approver from '../../Fields/Approver';
import { isHierarchyAlreadyTakenRequest } from "../../../service/KartoffelService";
import { useStores } from '../../../context/use-stores';
import { GetDefaultApprovers } from '../../../utils/approver';
import { isUserHoldType } from '../../../utils/user';
import { USER_SOURCE_DI, USER_TYPE } from '../../../constants';
import { getOuDisplayName } from '../../../utils/hierarchy';

const validationSchema = Yup.object().shape({
  newHierarchy: Yup.string().required(),
  parentHierarchy: Yup.object().required(),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when('isUserApprover', {
    is: false,
    then: Yup.array()
      .min(1, 'יש לבחור לפחות גורם מאשר אחד')
      .required('יש לבחור לפחות גורם מאשר אחד'),
  }),
  comments: Yup.string().optional(),
});

const CreateOGForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore } = useStores();
    const [defaultApprovers, setDefaultApprovers] = useState([]);

    const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);
    const { register, handleSubmit, setValue, formState, watch } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover },
    });

    const { errors } = formState;

    useEffect(() => {
      if (requestObject) {
        setValue('comments', requestObject.comments);
        setValue('newHierarchy', requestObject.adParams.name);
        setValue('parentHierarchy', { name: requestObject.adParams.ouName });
      }
    }, []);

    const onSubmit = async (data) => {
      const { newHierarchy, parentHierarchy, approvers, comments } = data;

      try {
        await validationSchema.validate(data);
      } catch (err) {
        throw new Error(err.errors);
      }

      const req = {
        commanders: approvers,
        kartoffelParams: {
          name: newHierarchy,
          parent: parentHierarchy.id,
          source: USER_SOURCE_DI,
        },
        adParams: {
          ouDisplayName: getOuDisplayName(parentHierarchy.hierarchy, parentHierarchy.name),
          ouName: parentHierarchy.name,
          name: newHierarchy,
        },
        comments,
      };

      await appliesStore.createOGApply(req);
      setIsActionDone(true);
    };

    useImperativeHandle(ref, () => ({
      handleSubmit: handleSubmit(onSubmit),
    }));

    const onHierarchyNameChange = async (e) => {
      const hierarchyNameToSearch = e.target.value;
      setValue('newHierarchy', e.target.value)
      
      if (hierarchyNameToSearch && watch("parentHierarchy")?.id) {
        const isHierarchyAlreadyTakenResponse =
          await isHierarchyAlreadyTakenRequest(
            hierarchyNameToSearch,
            watch("parentHierarchy").id
          );

        setValue("isHierarchyAlreadyTakenData", isHierarchyAlreadyTakenResponse);
      }
    };

    const handleOrgSelected = async (org) => {
      const result = await GetDefaultApprovers({
        request: requestObject,
        user: userStore.user,
        onlyForView,
        groupId: org.id,
      });
      setDefaultApprovers(result || []);
      setValue("isUserApprover", result.length > 0);
    };

    return (
      <div className="p-fluid">
        <div className="p-fluid-item p-fluid-item-flex1">
          <Hierarchy
            setValue={setValue}
            name="parentHierarchy"
            errors={errors}
            labelText={"היררכיית אב"}
            ogValue={watch("parentHierarchy")}
            disabled={onlyForView}
            userHierarchy={userStore.user && userStore.user.hierarchy ? userStore.user.hierarchy : null}
            onOrgSelected={handleOrgSelected}
          />
        </div>
        <div className="p-fluid-item">
          <div className="p-field">
            <label htmlFor="2021">
              <span className="required-field">*</span>שם היררכיה חדשה
            </label>
            <span className="p-input-icon-left">
              {watch("parentHierarchy") && watch("newHierarchy") && (
                <i>{watch("isHierarchyAlreadyTakenData")?.isOGNameAlreadyTaken ? "תפוס" : "פנוי"}</i>
              )}
              <InputText
                {...register("newHierarchy")}
                id="2021"
                type="text"
                required
                disabled={onlyForView}
                onChange={onHierarchyNameChange}
              />
              <label>{errors.isHierarchyAlreadyTakenData && <small>יש לבחור תפקיד פנוי</small>}</label>
              <label>{errors.newHierarchy && <small style={{ color: "red" }}>יש למלא ערך</small>}</label>
            </span>
          </div>
        </div>
        <div className="p-fluid-item">
          <Approver
            setValue={setValue}
            name="approvers"
            multiple={true}
            errors={errors}
            isHighRank={true}
            tooltip='סא"ל ומעלה ביחידתך'
            disabled={onlyForView || watch("isUserApprover")}
            defaultApprovers={defaultApprovers}
          />
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="2023">הערות</label>
            <InputTextarea
              {...register("comments")}
              id="2023"
              type="text"
              placeholder="הכנס הערות לבקשה..."
              disabled={onlyForView}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default CreateOGForm;
