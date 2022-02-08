import * as Yup from "yup";
import { forwardRef, useImperativeHandle } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";

import Approver from "../../Fields/Approver";
import { Dropdown } from "primereact/dropdown";
import { useStores } from "../../../context/use-stores";
import { toJS } from "mobx";
import { USER_TYPE } from "../../../constants";
import { getUserPassOptions } from "../../../utils/applies";

const validationSchema = Yup.object().shape({
  approverType: Yup.string().required("יש לבחור סוג גורם מטפל"),
  approvers: Yup.array()
    .min(1, "יש לבחור לפחות גורם מטפל אחד")
    .required("יש לבחור לפחות גורם מטפל אחד"),
  comment: Yup.string().optional(),
});

const PassRequestForm = forwardRef(({ request, setActionIsDone }, ref) => {
  const { userStore, appliesStore } = useStores();
  const user = toJS(userStore.user);
  const passOptions = getUserPassOptions(request, user);

  const { register, handleSubmit, setValue, watch, formState } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      approverType: passOptions.length > 0 ? passOptions[0].value : "",
    },
  });
  const { errors } = formState;

  const onSubmit = async (data) => {
    const { approvers, comment, approverType } = data;

    try {
      await validationSchema.validate(data);
    } catch (err) {
      throw new Error(err.errors);
    }

    const req = {
      user,
      approvers,
      approversType: approverType,
      reqId: request.id,
      overrideApprovers: true,
    };

    if (comment.length > 0) req.comment = comment;
    await appliesStore.transferApprovers(req);
    setActionIsDone(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: handleSubmit(onSubmit),
    }),
    []
  );

  return (
    <div className="p-fluid" id="passRequestForm">
      <div className="p-fluid-item" style={{ width: "100%" }}>
        <label htmlFor="12023">
          העברה לטיפול (בקשה {request?.serialNumber})
        </label>
        <div className="display-flex">
          <div className="p-field">
            {passOptions.length > 1 && (
              <Dropdown
                id="passRequestForm-approverType"
                {...register('approverType')}
                className="dropdown-autocomplete"
                value={watch('approverType')}
                options={passOptions}
                placeholder="סוג גורם מטפל"
                onChange={(e) => {
                  setValue('approverType', e.value);
                  setValue('approvers', []);
                }}
              />
            )}
            <label htmlFor="2020">
              {" "}
              {errors.approverType && (
                <small style={{ color: "red" }}>
                  {errors.approverType.message}
                </small>
              )}
            </label>
          </div>
          <div className="AutoCompleteWrap" style={{ width: '100%' }}>
            <Approver
              setValue={setValue}
              name="approvers"
              errors={errors}
              type={watch("approverType")}
              defaultApprovers={
                watch("approverType") === USER_TYPE.COMMANDER
                  ? request.commanders
                  : []
              }
              tooltip={`גורם מאשר מסוג: ${passOptions.find(passOption => passOption.value === watch('approverType')).label}`}
              multiple={watch("approverType") === USER_TYPE.COMMANDER}
              title={`גורם מאשר מסוג: ${passOptions.find(passOption => passOption.value === watch('approverType')).label}`}
            />
          </div>
        </div>
      </div>
      <div className="p-fluid-item" style={{ width: '100%' }}>
        <div className="p-field">
          <label htmlFor="12024">הערות</label>
          <InputTextarea
            {...register('comment')}
            id="passRequestForm-comment"
            type="text"
            placeholder="הכנס הערות לבקשה..."
          />
        </div>
      </div>
    </div>
  );
});

export { PassRequestForm };
