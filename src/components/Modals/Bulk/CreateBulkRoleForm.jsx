import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { useStores } from '../../../context/use-stores';
import Hierarchy from '../Hierarchy';
import Approver from '../../Fields/Approver';
import BulkRowsPopup from './BulkRowsPopup';
import BulkFileArea from './BulkFileArea';
import * as Yup from 'yup';
import FormData from 'form-data';
import { yupResolver } from '@hookform/resolvers/yup';
import { BulkTypes } from '../../../constants/applies';
import {
  uploadBulkFile,
  getCreateBulkRoleData,
} from '../../../service/AppliesService';

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  comments: Yup.string().optional(),
  hierarchy: Yup.object().required(),
  approvers: Yup.array().min(1).required(),
  bulkFile: Yup.mixed()
    .test('required', 'יש להעלות קובץ!', (value) => {
      return value && value.length;
    })
    .test('', 'יש להעלות קובץ תקין! ראה פורמט', async (value) => {
      const formData = new FormData();
      formData.append('bulkFiles', value[0]);
      const uploadFilesRes = await uploadBulkFile(formData, BulkTypes[0]);
      if (!uploadFilesRes) {
        //Table uploaded is illegl !
        return false;
      } else {
        return uploadFilesRes?.uploadFiles[0];
      }
    }),
});

const RenameBulkOGForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore } = useStores();
    const { register, handleSubmit, setValue, formState, watch } = useForm({
      resolver: yupResolver(validationSchema),
    });

    const { errors } = formState;

    useEffect(() => {
      const getBulkData = async () => {
        const data = await getCreateBulkRoleData(requestObject.id);
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
      const { hierarchy, approvers, bulkFile, comments } = data;

      const formData = new FormData();
      formData.append('bulkFiles', bulkFile[0]);
      const { uploadFiles } = await uploadBulkFile(formData, BulkTypes[0]);

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
      <div
        className="p-fluid"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="hierarchy"
              labelText="היררכיה"
              errors={errors}
              ogValue={watch('hierarchy')}
              disabled={onlyForView}
            />
          </div>
        </div>
        {!requestObject && (
          <BulkFileArea
            register={register}
            bulkType={0}
            errors={errors}
          />
        )}
        {!!requestObject && (
          <BulkRowsPopup
            rows={watch('rows')}
            columns={[
              { field: 'rowNumber' },
              { field: 'jobTitle', header: 'שם תפקיד' },
              { field: 'clearance', header: 'סיווג תפקיד' },
              { field: 'roleEntityType', header: 'סוג ישות' },
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
            defaultApprovers={requestObject?.commanders || []}
            disabled={onlyForView}
          />
        </div>

        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label>
              <span></span>הערות
            </label>
            <InputTextarea
              {...register('comments')}
              type="text"
              autoResize="false"
              disabled={onlyForView}
              placeholder="הכנס הערות לבקשה..."
            />
          </div>
        </div>
      </div>
    );
  }
);

export default RenameBulkOGForm;
