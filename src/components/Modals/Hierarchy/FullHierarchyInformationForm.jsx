import * as Yup from "yup";
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { NAME_OG_EXP, USER_TYPE } from "../../../constants";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";
import { GetDefaultApprovers } from "../../../utils/approver";
import { isUserHoldType } from "../../../utils/user";
import { useStores } from "../../../context/use-stores";
import { getHierarchy, getOuDisplayName, hierarchyConverse } from "../../../utils/hierarchy";
import { InputForm, InputTypes } from '../../Fields/InputForm';

const FullHierarchyInformationForm = forwardRef(
  (
    { setIsActionDone, onlyForView, requestObject, reqView = true, setIsEdit },
    ref
  ) => {
    const { userStore, appliesStore } = useStores();
    const [isHierarchyFree, setIsHierarchyFree] = useState(true);
    const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);
    const [hierarchy, setHierarchy] = useState(requestObject);
    const [defaultApprovers, setDefaultApprovers] = useState([]);

    const validationSchema = Yup.object().shape({
      isUserApprover: Yup.boolean(),
      approvers: Yup.array().when('isUserApprover', {
        is: false,
        then: Yup.array()
          .min(1, 'יש לבחור לפחות גורם מאשר אחד')
          .required('יש לבחור לפחות גורם מאשר אחד'),
      }),
      hierarchyName: Yup.string()
        .required('יש לבחור שם היררכיה')
        .matches(NAME_OG_EXP, 'שם לא תקין')
        .test({
          name: 'hierarchy-valid-check',
          message: 'היררכיה תפוסה',
          test: () => {
            return isHierarchyFree;
          },
        })
        .test({
          name: 'hierarchy-changed',
          message: 'נא לבחור שם חדש',
          test: (value) => {
            return value !== requestObject.name;
          },
        }),
      comments: Yup.string().optional(),
    });

    const defaultValues = {
      isUserApprover,
      hierarchyName: hierarchy.name,
    };
    const methods = useForm({
      defaultValues: defaultValues,
      resolver: yupResolver(validationSchema),
    });

    const { errors } = methods.formState;

    useEffect(async () => {
      let groupId;

      if (requestObject) {
        if (reqView) {
          const { hierarchyReadOnly, hierarchyName } = getHierarchy(
            requestObject.adParams.ouDisplayName
          );
          setHierarchy({
            hierarchy: hierarchyReadOnly,
            name: hierarchyName,
            oldName: requestObject.adParams.oldOuName,
            id: requestObject.kartoffelParams.id,
          });
          groupId = requestObject.kartoffelParams.id;
        } else {
          const hierarchyName = hierarchyConverse(requestObject);
          requestObject.hierarchyName = hierarchyName;
          setHierarchy(requestObject);
          groupId = requestObject.id;
        }
      }

      const result = await GetDefaultApprovers({
        request: requestObject,
        onlyForView,
        user: userStore.user,
        groupId,
      });
      setDefaultApprovers(result || []);
      methods.setValue('isUserApprover', result.length > 0);
    }, []);

    const onSubmit = async (data) => {
      try {
        await validationSchema.validate(data);
      } catch (err) {
        console.log(err);
        throw new Error(err.errors);
      }
      const { approvers, comments, hierarchyName } = data;
      const ouDisplayName = getOuDisplayName(
        hierarchy.hierarchy,
        hierarchy.name,
        false
      );

      const req = {
        commanders: approvers,
        kartoffelParams: {
          id: hierarchy.id,
          name: hierarchyName,
          hierarchy: hierarchyConverse({
            hierarchy: hierarchy.hierarchy,
            name: hierarchyName,
          }),
          oldHierarchy: hierarchyConverse(hierarchy),
        },
        adParams: {
          ouDisplayName: ouDisplayName,
          oldOuName: hierarchy.name,
          newOuName: hierarchyName,
        },
        comments,
        due: Date.now(),
      };

      await appliesStore.renameOGApply(req);
      setIsEdit(false);
      setIsActionDone(true);

    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: methods.handleSubmit(onSubmit),
      }),
      []
    );

    const formFields = [
      {
        fieldName: reqView ? "hierarchy": "hierarchyName",
        displayName: reqView ? "היררכיה חדשה" : "היררכיה",
        inputType: InputTypes.HIERARCHY_CHANGE,
        force: true,
        canEdit: true,
        setFunc: (value) => setIsHierarchyFree(value),
        item: reqView ? requestObject?.kartoffelParams : null,
      },
      {
        fieldName: 'oldHierarchy',
        displayName: 'היררכיה ישנה',
        inputType: InputTypes.HIERARCHY_CHANGE,
        force: true,
        secured: () => reqView,
        item: requestObject?.kartoffelParams,
      },
      {
        fieldName: 'jobnum',
        displayName: 'מספר תפקידים',
        inputType: InputTypes.TEXT,
        secured: () => !reqView,
        force: true,
        placeholder: hierarchy?.directRoles ? hierarchy.directRoles?.length : 0,
      },
      {
        fieldName: 'id',
        displayName: 'מזהה היררכיה',
        inputType: InputTypes.TEXT,
        force: true,
      },
      {
        fieldName: 'approvers',
        inputType: InputTypes.APPROVER,
        tooltip: 'רס"ן ומעלה ביחידתך',
        default: defaultApprovers,
        disabled: onlyForView || methods.watch('isUserApprover'),
        force: true,
        secured: () => !onlyForView || reqView,
      },
      {
        fieldName: 'comments',
        displayName: 'הערות',
        inputType: InputTypes.TEXTAREA,
        force: true,
        secured: () => reqView || !onlyForView,
        placeholder: 'הכנס הערות לבקשה...',
        additionalClass: 'p-fluid-item-flex1',
        canEdit: true,
      },
    ];

    return (
      <div className="p-fluid">
        <InputForm
          fields={formFields}
          item={hierarchy}
          isEdit={!onlyForView}
          errors={errors}
          methods={methods}
        />
      </div>
    );
  }
);

export { FullHierarchyInformationForm };
