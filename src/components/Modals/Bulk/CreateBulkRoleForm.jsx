import * as Yup from 'yup';
import React, { useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import FormData from 'form-data';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputTextarea } from 'primereact/inputtextarea';

import Hierarchy from '../../Fields/Hierarchy';
import Approver from '../../Fields/Approver';
import BulkRowsPopup from './BulkRowsPopup';
import BulkFileArea from './BulkFileArea';

import { useStores } from '../../../context/use-stores';
import { BulkTypes } from '../../../constants/applies';
import {
  uploadBulkFile,
  getCreateBulkRoleData,
} from '../../../service/AppliesService';
import { STATUSES, USER_TYPE } from '../../../constants';
import { isUserApproverType } from "../../../utils/user";
import { GetDefaultApprovers } from '../../../utils/approver';
import { getOuDisplayName, hierarchyConverse } from '../../../utils/hierarchy';
import { isApproverValid } from '../../../service/ApproverService';
import { StatusFieldTemplate } from '../../Fields/StatusFieldTemplate';

const validationSchema = Yup.object().shape({
  comments: Yup.string().optional(),
  hierarchy: Yup.object().required('נא לבחור היררכיה'),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when('isUserApprover', {
    is: false,
    then: Yup.array().min(1, 'יש לבחור לפחות גורם מאשר אחד').required('יש לבחור לפחות גורם מאשר אחד'),
  }).test({
    name: "check-if-valid",
    message: "יש לבחור מאשרים תקינים (מהיחידה בלבד)",
    test: async (approvers, context) => {
      let isTotalValid = true;

      if (context.parent?.hierarchy?.id && Array.isArray(approvers)) {
        await Promise.all(
          approvers.map(async (approver) => {
            const { isValid } = await isApproverValid(approver.entityId, context.parent.hierarchy.id);
            if (!isValid) isTotalValid = false;
          })
        );
      }

      return isTotalValid;
    },
  }),
  bulkFile: Yup.mixed()
    .test('required', 'יש להעלות קובץ!', (value) => {
      return value && value.length;
    })
    .test('',  async (value, { createError,path }) => {
      const formData = new FormData();
      formData.append('bulkFiles', value[0]);
      const uploadFilesRes = await uploadBulkFile(formData, BulkTypes[0]);

      if (!uploadFilesRes[0]?.valid) {
        if (uploadFilesRes[0]?.errorRows.length === 0) {
          return createError({ path, message: `הקובץ ריק/לא תקין.` });
        }
        else if (uploadFilesRes[0]?.errorRows.length > 0) {
          const errorLines=await Promise.all(uploadFilesRes[0]?.errorRows.map((row)=>row+2));
          return createError({ path, message: `הקובץ לא תקין. אנא תקן/י את שורות ${errorLines.toString()}.` });
        }
      } else {  //when the uploaded file is valid
        return true;
      }
    }),
});

const RenameBulkOGForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore } = useStores();
    const isUserApprover = isUserApproverType(userStore.user);
    const [defaultApprovers, setDefaultApprovers] = useState([]);

    const { register, handleSubmit, setValue, formState, watch } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover },
    });

    const { errors } = formState;

    useEffect(() => {
      const getBulkData = async () => {
        const data = await getCreateBulkRoleData(requestObject.id);
        setValue('comments', requestObject.comments);
        setValue('hierarchy', { name: requestObject.kartoffelParams.hierarchy });
        setValue('rows', data.rows);

        const result = await GetDefaultApprovers({ request: requestObject, onlyForView, user: userStore.user });
        setDefaultApprovers(result || []);
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
      const uploadFilesRes = await uploadBulkFile(formData, BulkTypes[0]);

      const req = {
        commanders: approvers,
        kartoffelParams: {
          directGroup: hierarchy.id,
          hierarchy: hierarchyConverse(hierarchy)
        },
        adParams: {
          ouDisplayName: getOuDisplayName(hierarchy.hierarchy, hierarchy.name),
        },
        excelFilePath: uploadFilesRes[0]?.name,
        comments,
      };

      if (!comments.length) {
        delete req.comments;
      }

      await appliesStore.createRoleBulk(req);
      setIsActionDone(true);

    };

    const statusTemplateEnum = (column) => {
      if (column?.status) {
        const status = STATUSES[column.status];
        return <StatusFieldTemplate status={status}/>;

      } else {
        return '---'
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: handleSubmit(onSubmit),
      }),
      []
    );


    const handleOrgSelected = async (org) => {
      const result = await GetDefaultApprovers({
        request: requestObject,
        user: userStore.user,
        onlyForView,
        groupId: org.id,
      });
      setDefaultApprovers(result || []);
      setValue("isUserApprover", result.length > 0);
      setValue('approvers', []);
    };

    return (
      <div className="p-fluid" id="createBulkRoleForm" style={{ display: "flex", flexDirection: "column" }}>
        <div className="p-fluid-item-flex p-fluid-item">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="hierarchy"
              labelText="היררכיה"
              errors={errors}
              ogValue={watch("hierarchy")}
              disabled={onlyForView}
              onOrgSelected={handleOrgSelected}
              userHierarchy={userStore.user && userStore.user.hierarchy ? userStore.user.hierarchy : null}
            />
          </div>
        </div>
        {!requestObject && <BulkFileArea register={register} bulkType={0} errors={errors} />}
        {!!requestObject && (
          <BulkRowsPopup
            rows={watch("rows")}
            columns={[
              { field: "rowNumber" },
              { field: "jobTitle", header: "שם תפקיד" },
              { field: "clearance", header: "סיווג תפקיד" },
              { field: "roleEntityType", header: "סוג ישות" },
              { field: "status", header: "סטטוס", body: statusTemplateEnum },
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
            defaultApprovers={defaultApprovers}
            disabled={onlyForView || watch("isUserApprover")}
          />
        </div>

        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label>
              <span></span>הערות
            </label>
            <InputTextarea
              id="createBulkRoleForm-comments"
              {...register("comments")}
              type="text"
              autoResize="false"
              disabled={onlyForView}
              placeholder={!onlyForView && "הכנס הערות לבקשה..."}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default RenameBulkOGForm;
