import React, { useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import Hierarchy from "./Hierarchy";
import Approver from "./Approver";
import { useStores } from "../../context/use-stores";
import * as Yup from "yup";
import { apiBaseUrl } from "../../constants";
import FormData from "form-data";
import { yupResolver } from "@hookform/resolvers/yup";
import { uploadBulkFile } from "../../service/AppliesService";

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  hierarchy: Yup.object().required(),
  approvers: Yup.array().min(1).required(),
});

const RenameBulkOGForm = forwardRef(({ setIsActionDone }, ref) => {
  const { appliesStore } = useStores();
  const { register, handleSubmit, setValue, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      await validationSchema.validate(data);
    } catch (err) {
      throw new Error(err.errors);
    }

    const formData = new FormData();
    formData.append("bulkFiles", data.bulkFile[0]);
    const { uploadFiles } = await uploadBulkFile(formData);

    const { hierarchy, approvers } = data;

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
    await appliesStore.assignRoleToEntityApply(req);
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
          />
        </div>
      </div>
      <div className="p-fluid-item-flex p-fluid-item">
        <div className="p-field">
          <label>
            <span className="required-field">*</span>העלאת קובץ
          </label>
          <span className="p-input-icon-left">
            <i className="pi pi-file-excel" />
            <InputText
              {...register("bulkFile")}
              type="file"
              required
              placeholder="קובץ"
              style={{ paddingTop: "10px" }}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
            <label>{errors.bulkFile && <small>יש למלא ערך</small>}</label>
          </span>
        </div>
      </div>
      <div
        className="p-fluid-item-flex p-fluid-item"
        style={{ alignItems: "center" }}
      >
        {/* TODO: bring good excel example route */}
        <a
          href={`${apiBaseUrl}/api/bulk/request/example?bulkType=1`}
          style={{ textDecoration: "underline" }}
          download="exampleFile"
        >
          להורדת הפורמט לחץ כאן
        </a>
      </div>
      <div className="p-fluid-item-flex p-fluid-item">
        <Approver
          setValue={setValue}
          name="approvers"
          multiple={true}
          errors={errors}
        />
      </div>
    </div>
  );
});

export default RenameBulkOGForm;
