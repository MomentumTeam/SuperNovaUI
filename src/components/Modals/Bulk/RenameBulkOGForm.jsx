import * as Yup from "yup";
import FormData from "form-data";
import React, { useImperativeHandle, forwardRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputTextarea } from "primereact/inputtextarea";

import Hierarchy from "../../Fields/Hierarchy";
import Approver from "../../Fields/Approver";
import BulkFileArea from "./BulkFileArea";
import BulkRowsPopup from "./BulkRowsPopup";

import { useStores } from "../../../context/use-stores";
import { BulkTypes } from '../../../constants/applies';
import {
  uploadBulkFile,
  getBulkChangeRoleHierarchyData,
} from "../../../service/AppliesService";
import { GetDefaultApprovers } from '../../../utils/approver';
import { isUserHoldType } from '../../../utils/user';
import { USER_TYPE } from '../../../constants';

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  comments: Yup.string().optional(),
  hierarchy: Yup.object().required(),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when("isUserApprover", {
    is: false,
    then: Yup.array().min(1, "יש לבחור לפחות גורם מאשר אחד").required("יש לבחור לפחות גורם מאשר אחד"),
  }),
  bulkFile: Yup.mixed()
    .test('required', 'יש להעלות קובץ!', (value) => {
      return value && value.length;
    })
    .test('', 'יש להעלות קובץ תקין! ראה פורמט', async (value) => {
      const formData = new FormData();
      formData.append('bulkFiles', value[0]);
      const uploadFilesRes = await uploadBulkFile(formData, BulkTypes[1]);
      if (!uploadFilesRes) {
        //Table uploaded is illegl !
        return false;
      } else {
        return uploadFilesRes?.uploadFiles[0];
      }
    }),
});

const RenameBulkOGForm = forwardRef(
  ({ setIsActionDone, requestObject, onlyForView }, ref) => {
    const { appliesStore, userStore } = useStores();
    const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);
    const { register, handleSubmit, setValue, formState, watch } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover },
    });

    const { errors } = formState;

    useEffect(() => {
      const getBulkData = async () => {
        const data = await getBulkChangeRoleHierarchyData(requestObject.id);
        setValue('comments', requestObject.comments);
        setValue('hierarchy', data.request.adParams.ouDisplayName);
        setValue('rows', data.rows);
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
      const { hierarchy, approvers, bulkFile, comments } =
        data;

      const formData = new FormData();
      formData.append('bulkFiles', bulkFile[0]);
      const { uploadFiles } = await uploadBulkFile(formData, BulkTypes[1]);

      const req = {
        commanders: approvers,
        kartoffelParams: {
          directGroup: hierarchy.id,
        },
        adParams: {
          ouDisplayName: hierarchy.name,
        },
        excelFilePath: uploadFiles[0],
        comments,
      };

      if (!comments.length) {
        delete req.comments;
      }

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
              userHierarchy={userStore.user && userStore.user.hierarchy ? userStore.user.hierarchy : null}
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
              ogValue={watch('hierarchy')}
              disabled={onlyForView}
              userHierarchy={userStore.user && userStore.user.hierarchy ? userStore.user.hierarchy : null}
            />
          </div>
        </div>
        {!requestObject && (
          <BulkFileArea
            register={register}
            bulkType={1}
            errors={errors}
          />
        )}
        {!!requestObject && (
          <BulkRowsPopup
            rows={watch('rows')}
            columns={[
              { field: 'rowNumber' },
              { field: 'currentJobTitle', header: 'תפקיד נוכחי' },
              { field: 'newJobTitle', header: 'תפקיד חדש' },
              { field: 'roleId', header: 'מזהה תפקיד' },
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
            disabled={onlyForView || isUserApprover}
            defaultApprovers={GetDefaultApprovers(requestObject, onlyForView)}
          />
        </div>

        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label>
              <span></span>הערות
            </label>
            <InputTextarea
              {...register('comments')}
              id="2028"
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

export default RenameBulkOGForm;
