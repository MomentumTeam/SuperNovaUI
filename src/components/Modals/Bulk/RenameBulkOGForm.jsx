import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Hierarchy from "../Hierarchy";
import Approver from "../../Fields/Approver";
import BulkFileArea from "./BulkFileArea";
import BulkRowsPopup from "./BulkRowsPopup";
import { useStores } from "../../../context/use-stores";
import * as Yup from "yup";
import { apiBaseUrl } from "../../../constants/api";
import FormData from "form-data";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  uploadBulkFile,
  getBulkChangeRoleHierarchyData,
} from "../../../service/AppliesService";

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  hierarchy: Yup.object().required(),
  approvers: Yup.array().min(1).required(),
  bulkFile: Yup.mixed()
    .test("fileSize", (value) => !!value)
    .required(),
});

const RenameBulkOGForm = forwardRef(
  ({ setIsActionDone, requestObject, onlyForView }, ref) => {
    const { appliesStore } = useStores();
    const { register, handleSubmit, setValue, formState, watch } = useForm({
      resolver: yupResolver(validationSchema),
    });

    const { errors } = formState;

    useEffect(() => {
      const getBulkData = async () => {
        const data = await getBulkChangeRoleHierarchyData(requestObject.id);
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
        },
        adParams: {
          ouDisplayName: hierarchy.name,
        },
        excelFilePath: uploadFiles[0],
      };
      await appliesStore.changeRoleHierarchyBulk(req);
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
      <div className="p-fluid">
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="currentHierarchy"
              labelText="היררכיה נוכחית"
              errors={errors}
              disabled={onlyForView}
            />
          </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="hierarchy"
              labelText="היררכיה חדשה"
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
            downloadUrl={`${apiBaseUrl}/api/bulk/request/example?bulkType=1`}
            fileName="renameOGBulkExample.xlsx"
          />
        )}
        {!!requestObject && (
          <BulkRowsPopup
            rows={watch("rows")}
            columns={[
              { field: "rowNumber" },
              { field: "currentJobTitle", header: "תפקיד נוכחי" },
              { field: "newJobTitle", header: "תפקיד חדש" },
              { field: "roleId", header: "מזהה תפקיד" },
            ]}
          />
        )}
        <div className="p-fluid-item-flex p-fluid-item">
          <Approver
            setValue={setValue}
            name="approvers"
            multiple={true}
            errors={errors}
            defaultApprovers={requestObject?.approvers || []}
            disabled={onlyForView}
          />
        </div>
      </div>
    );
  }
);

export default RenameBulkOGForm;
