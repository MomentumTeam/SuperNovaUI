import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useStores } from "../../../context/use-stores";
import Hierarchy from "../Hierarchy";
import Approver from "../../Fields/Approver";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { GetDefaultApprovers } from '../../../utils/approver';
import { isUserHoldType } from '../../../utils/user';
import { USER_SOURCE_DI, USER_TYPE } from '../../../constants';

const validationSchema = Yup.object().shape({
  newHierarchy: Yup.string().required(),
  parentHierarchy: Yup.object().required(),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when("isUserApprover", {
    is: false,
    then: Yup.array().min(1, "יש לבחור לפחות גורם מאשר אחד").required("יש לבחור לפחות גורם מאשר אחד"),
  }),
  comments: Yup.string().optional(),
});

const CreateOGForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore } = useStores();
    const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);
    const { register, handleSubmit, setValue, formState, watch } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover },
    });

    const { errors } = formState;

    useEffect(() => {
      if (requestObject) {
        setValue("comments", requestObject.comments);
        setValue("newHierarchy", requestObject.adParams.name);
        setValue("parentHierarchy", { name: requestObject.adParams.ouName });
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
        // status: 'SUBMITTED',
        commanders: approvers,
        kartoffelParams: {
          name: newHierarchy,
          parent: parentHierarchy.id,
          source: USER_SOURCE_DI,
        },
        adParams: {
          ouDisplayName: parentHierarchy.name,
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
          />
        </div>
        <div className="p-fluid-item">
          <div className="p-field">
            <label htmlFor="2021">
              <span className="required-field">*</span>שם היררכיה חדשה
            </label>
            <InputText
              {...register("newHierarchy")}
              id="2021"
              type="text"
              required
              placeholder="שם היררכיה חדשה"
              disabled={onlyForView}
            />
            <label>{errors.newHierarchy && <small style={{ color: "red" }}>יש למלא ערך</small>}</label>
          </div>
        </div>
        <div className="p-fluid-item">
          <Approver
            setValue={setValue}
            name="approvers"
            multiple={true}
            errors={errors}
            isHighRank={true}
            tooltip='רס"ן ומעלה ביחידתך'
            disabled={onlyForView || isUserApprover}
            defaultApprovers={GetDefaultApprovers(requestObject, onlyForView)}
          />
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="2023">הערות</label>
            <InputTextarea {...register("comments")} id="2023" type="text" placeholder="הערות" disabled={onlyForView} />
          </div>
        </div>
      </div>
    );
  }
);

export default CreateOGForm;
