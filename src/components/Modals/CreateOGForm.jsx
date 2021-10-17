import React, { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useStores } from "../../context/use-stores";
import Hierarchy from "./Hierarchy";
import Approver from "./Approver";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const validationSchema = Yup.object().shape({
  newHierarchy: Yup.string().required(),
  parentHierarchy: Yup.object().required(),
  approvers: Yup.array().min(1).required(),
  comments: Yup.string().optional(),
});

const CreateOGForm = forwardRef(({ setIsActionDone }, ref) => {
  const { appliesStore } = useStores();
  const { register, handleSubmit, setValue, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { errors } = formState;


  const onSubmit = async (data) => {
    const { newHierarchy, parentHierarchy, approvers, comments } = data;

    try {
      await validationSchema.validate(data);
    } catch (err) {
      throw new Error(err.errors);
    }

    const req = {
      status: 'SUBMITTED',
      commanders: approvers,
      kartoffelParams: {
        name: newHierarchy,
        parent: parentHierarchy.id,
        source: 'oneTree',
      },
      adParams: {
        ouDisplayName: parentHierarchy.name,
        ouName: parentHierarchy.name,
        name: newHierarchy,
      },
      comments,
      due: Date.now(),
    };

    await appliesStore.createOGApply(req);
    setIsActionDone(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: handleSubmit(onSubmit),
    }),
    []
  );

  return (
    <div className='p-fluid'>
      <div className='p-fluid-item p-fluid-item-flex1'>
        <Hierarchy setValue={setValue} name='parentHierarchy' errors={errors} labelText={'היררכיית אב'} />
      </div>
      <div className='p-fluid-item'>
        <div className='p-field'>
          <label htmlFor='2021'>
            <span className='required-field'>*</span>שם היררכיה חדשה
          </label>
          <InputText
            {...register('newHierarchy')}
            id='2021'
            type='text'
            required
            placeholder="שם היררכיה חדשה"
          />
          <label>
            {errors.newHierarchy && (
              <small style={{ color: "red" }}>יש למלא ערך</small>
            )}
          </label>
        </div>
      </div>
      <div className='p-fluid-item'>
        <Approver
          setValue={setValue}
          name='approvers'
          defaultApprovers={[]}
          multiple={true}
          errors={errors}
        />
      </div>
      <div className='p-fluid-item p-fluid-item-flex1'>
        <div className='p-field'>
          <label htmlFor='2023'>הערות</label>
          <InputTextarea {...register('comments')} id='2023' type='text' placeholder='הערות' />
        </div>
      </div>
    </div>
  );
});

export default CreateOGForm;
