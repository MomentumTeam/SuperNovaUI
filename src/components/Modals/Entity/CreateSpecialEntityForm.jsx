import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useStores } from '../../../context/use-stores';
import {PHONE_REG_EXP, USER_TYPE} from '../../../constants';
import Approver from '../../Fields/Approver';
import { GetDefaultApprovers } from '../../../utils/approver';
import { isUserHoldType } from '../../../utils/user';


const validationSchema = Yup.object().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  identityNumber: Yup.string().required(),
  phone: Yup.string().matches(PHONE_REG_EXP, "מספר לא תקין").required(),
  classification: Yup.string().required(),
  approvers: Yup.array().min(1).required('יש לבחור לפחות גורם מאשר אחד'),
  comments: Yup.string().optional(),
  sex: Yup.string().optional().nullable(),
});

const CreateSpecialEntityForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { register, handleSubmit, watch, setValue, formState } = useForm({
      resolver: yupResolver(validationSchema),
    });
    const { errors } = formState;
    const { appliesStore, userStore} = useStores();

    useEffect(() => {
      if (requestObject) {
        setValue("comments", requestObject.comments);
        setValue("firstName", requestObject.kartoffelParams.firstName);
        setValue("lastName", requestObject.kartoffelParams.lastName);
        setValue("identityNumber", requestObject.kartoffelParams.identityCard);
        setValue("phone", requestObject.kartoffelParams.mobilePhone[0]);
        setValue("classification", requestObject.kartoffelParams.clearance);
        setValue("sex", requestObject.kartoffelParams.sex);
      }
    }, []);

    const onSubmit = async (data) => {
      try {
        await validationSchema.validate(data);
      } catch (err) {
        throw new Error(err.errors);
      }

      const {
        firstName,
        lastName,
        identityNumber,
        phone,
        classification,
        comments,
        sex,
        approvers,
      } = data;

      const req = {
        commanders: approvers,
        kartoffelParams: {
          firstName,
          lastName,
          identityCard: identityNumber,
          mobilePhone: [phone],
          clearance: classification,
          sex,
          // TODO: put it correct type
          entityType: "civillian", //TODO: what should this be??
          serviceType: "???", //TODO: what should this be??
        },
        comments,
        adParams: {}, // IS THIS NEEDED???
      };

      await appliesStore.createEntityApply(req);
      await setIsActionDone(true);
    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: handleSubmit(onSubmit),
      }),
      []
    );

    return (
      <div className="p-fluid">
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="1900">
              <span className="required-field">*</span>שם פרטי
              <InputText {...register("firstName")} id="firstName" type="text" disabled={onlyForView} />
              <label htmlFor="2020"> {errors?.firstName && <small style={{ color: "red" }}>יש למלא ערך</small>}</label>
            </label>
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="1900">
              <span className="required-field">*</span>שם משפחה
              <InputText {...register("lastName")} id="lastName" type="text" disabled={onlyForView} />
              <label htmlFor="2020"> {errors?.lastName && <small style={{ color: "red" }}>יש למלא ערך</small>}</label>
            </label>
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="1900">
              <span className="required-field">*</span>ת״ז
              <InputText {...register("identityNumber")} id="identityNumber" type="text" disabled={onlyForView} />
              <label htmlFor="2020">
                {" "}
                {errors?.identityNumber && <small style={{ color: "red" }}> יש למלא ערך חוקי</small>}
              </label>
            </label>
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="1900">
              <span className="required-field">*</span>טלפון
              <InputText {...register("phone")} id="phone" type="text" disabled={onlyForView} />
              <label htmlFor="2020"> {errors?.phone && <small style={{ color: "red" }}>יש למלא ערך חוקי</small>}</label>
            </label>
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="1900">
              <span className="required-field">*</span>סיווג המשתמש
              <InputText {...register("classification")} id="classification" type="text" disabled={onlyForView} />
              <label htmlFor="2020">
                {" "}
                {errors?.classification && <small style={{ color: "red" }}>יש למלא ערך חוקי</small>}
              </label>
            </label>
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <label htmlFor="1900">
              מגדר
              <Dropdown
                {...register("sex")}
                inputId="sex"
                options={[
                  { label: "-", value: null },
                  { label: "זכר", value: "1" },
                  { label: "נקבה", value: "2" },
                ]}
                disabled={onlyForView}
                placeholder="מגדר"
                value={watch("sex")}
                onChange={(e) => {
                  setValue("sex", e.value);
                }}
              />
            </label>
          </div>
        </div>
        <div className="p-fluid-item">
          <Approver
            setValue={setValue}
            name="approvers"
            multiple={true}
            defaultApprovers={GetDefaultApprovers(requestObject, onlyForView, setValue)}
            disabled={onlyForView || isUserHoldType(userStore.user, USER_TYPE.COMMANDER)}
            tooltip='רס"ן ומעלה ביחידתך'
          />
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="2028">הערות</label>
            <InputTextarea
              {...register("comments")}
              id="comments"
              type="text"
              disabled={onlyForView}
              placeholder="הכנס הערות לבקשה..."
            />
          </div>
        </div>
      </div>
    );
});

export default CreateSpecialEntityForm;
