import * as Yup from "yup";
import { forwardRef, useImperativeHandle, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";

import Approver from "../../Fields/Approver";
import { Dropdown } from "primereact/dropdown";

const validationSchema = Yup.object().shape({
  approvers: Yup.array().min(1).required(),
  comments: Yup.string().optional(),
});

const PassRequestForm = forwardRef(({ request }, ref) => {
  const [approverType, setApproverType] = useState("");

  const { register, handleSubmit, setValue, getValues, watch, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { errors } = formState;

  const onSubmit = async (data) => {
    const { approvers, comments } = data;

    try {
      await validationSchema.validate(data);
    } catch (err) {
      throw new Error(err.errors);
    }

    const req = {
      commanders: approvers,
      // kartoffelParams: {
      //   name: newHierarchy,
      //   parent: parentHierarchy.id,
      //   source: "oneTree",
      // },
      // adParams: {
      //   ouDisplayName: parentHierarchy.name,
      //   ouName: parentHierarchy.name,
      //   name: newHierarchy,
      // },
      comments,
    };

    // await appliesStore.createOGApply(req);
    // setIsActionDone(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: handleSubmit(onSubmit),
    }),
    []
  );

  return (
    <div>
      <div className="p-fluid">
        <div className="p-fluid-item" style={{ width: "100%" }}>
          <div className="AutoCompleteWrap">
            <label htmlFor="12023">העבר לטיפול</label>
            <div className="display-flex p-field-item">
              <Dropdown options={[]} placeholder="גורם מטפל" />
              <Approver
                setValue={setValue}
                name="approvers"
                errors={errors}
                multiple={true}
                defaultApprovers={[]}
                type={approverType}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="p-fluid">
        <div className="p-fluid-item" style={{ width: "100%" }}>
          <div className="p-field">
            <label htmlFor="12024">הערות</label>
            <InputTextarea {...register("comments")} id="2028" type="text" placeholder="הערות" />
          </div>
        </div>
      </div>
    </div>
  );
});

export { PassRequestForm };
