import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Hierarchy from "../../Fields/Hierarchy";
import Approver from "../../Fields/Approver";
import BulkRowsPopup from "./BulkRowsPopup";
import BulkFileArea from "./BulkFileArea";
import { useStores } from "../../../context/use-stores";
import * as Yup from "yup";
import { apiBaseUrl } from "../../../constants/api";
import FormData from "form-data";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  uploadBulkFile,
  getCreateBulkRoleData,
} from "../../../service/AppliesService";
import { USER_TYPE } from '../../../constants';
import { isUserHoldType } from '../../../utils/user';
import { GetDefaultApprovers } from '../../../utils/approver';

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  hierarchy: Yup.object().required(),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when("isUserApprover", {
    is: false,
    then: Yup.array().min(1, "יש לבחור לפחות גורם מאשר אחד").required("יש לבחור לפחות גורם מאשר אחד"),
  }),
  bulkFile: Yup.mixed()
    .test("fileSize", (value) => !!value)
    .required(),
});

const RenameBulkOGForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore } = useStores();
    const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);
    const { register, handleSubmit, setValue, formState, watch } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover },
    });

    const { errors } = formState;

    useEffect(() => {
      const getBulkData = async () => {
        const data = await getCreateBulkRoleData(requestObject.id);
        setValue("hierarchy", data.request.adParams.ouDisplayName);
        setValue("rows", data.rows);
      };
      if (requestObject) {
        getBulkData();
      }
    }, []);


    const onSubmit = async (data) => {
      try {
        await validationSchema.validate(data);
      } catch (err) {
        throw new Error(err.errors);
      }
      const { hierarchy, approvers, bulkFile } = data;

      const formData = new FormData();
      formData.append("bulkFiles", bulkFile[0]);
      const { uploadFiles } = await uploadBulkFile(formData);

      const req = {
        commanders: approvers,
        kartoffelParams: {
          directGroup: hierarchy.id,
          unit:"blablabla"  //TODO- change after backend change
        },
        adParams: {
          ouDisplayName: hierarchy.name,
        },
        excelFilePath: uploadFiles[0],
      };
      await appliesStore.createRoleBulk(req);
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
      <div className="p-fluid" style={{ display: "flex", flexDirection: "column" }}>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="hierarchy"
              labelText="היררכיה"
              errors={errors}
              ogValue={watch("hierarchy")}
              disabled={onlyForView}
            />
          </div>
        </div>
        {!requestObject && (
          <BulkFileArea
            register={register}
            errors={errors}
            downloadUrl={`${apiBaseUrl}/api/bulk/request/example?bulkType=0`}
            fileName="createRoleBulkExample.xlsx"
          />
        )}
        {!!requestObject && (
          <BulkRowsPopup
            rows={watch("rows")}
            columns={[
              { field: "rowNumber" },
              { field: "jobTitle", header: "שם תפקיד" },
              { field: "clearance", header: "סיווג תפקיד" },
              { field: "roleEntityType", header: "סוג ישות" },
            ]}
          />
        )}
        <div className="p-fluid-item-flex p-fluid-item">
          <Approver
            setValue={setValue}
            name="approvers"
            tooltip='רס"ן ומעלה ביחידתך'
            multiple={true}
            errors={errors}
            setValue={setValue}
            name="approvers"
            defaultApprovers={GetDefaultApprovers(requestObject, onlyForView)}
            disabled={onlyForView || isUserApprover}
          />
        </div>
      </div>
    );
  }
);

export default RenameBulkOGForm;
