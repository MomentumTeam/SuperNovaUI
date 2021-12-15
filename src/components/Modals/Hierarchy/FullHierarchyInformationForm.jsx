import * as Yup from "yup";
import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { yupResolver } from "@hookform/resolvers/yup";

import { ContainerRoleList } from "./FullHierarchyContainerRoleList";
import { FullHierarchyInformationFooter } from "./FullHierarchyInformationFooter";
import { getLabel, disabledInputStyle } from "../../Fields/InputCommon";
import { HierarchyDelete } from "./HierarchyDelete";
import { NAME_OG_EXP, USER_TYPE } from "../../../constants";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";
import Approver from "../../Fields/Approver";
import { HierarchyField } from "../../Fields/HierarchyChangeField";
import { GetDefaultApprovers } from "../../../utils/approver";
import { isUserHoldType } from "../../../utils/user";
import { useStores } from "../../../context/use-stores";
import { getHierarchy } from "../../../utils/hierarchy";
import { InputTextarea } from "primereact/inputtextarea";

const FullHierarchyInformationForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject, reqView = true }, ref) => {
    const { userStore, appliesStore } = useStores();
    // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isHierarchyFree, setIsHierarchyFree] = useState(true);
    const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);
    const [hierarchy, setHierarchy] = useState(requestObject);

    const validationSchema = Yup.object().shape({
      isUserApprover: Yup.boolean(),
      approvers: Yup.array().when("isUserApprover", {
        is: false,
        then: Yup.array().min(1, "יש לבחור לפחות גורם מאשר אחד").required("יש לבחור לפחות גורם מאשר אחד"),
      }),
      hierarchyName: Yup.string()
        .matches(NAME_OG_EXP, "שם לא תקין")
        .required("יש לבחור שם היררכיה")
        .test({
          name: "hierarchy-valid-check",
          message: "היררכיה תפוסה",
          test: () => {
            return isHierarchyFree;
          },
        })
        .test({
          name: "hierarchy-changed",
          message: "נא לבחור שם חדש",
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
      if (requestObject) {
        if (reqView) {
          const { hierarchyReadOnly, hierarchyName } = getHierarchy(requestObject.adParams.ouDisplayName);
          setHierarchy({
            hierarchy: hierarchyReadOnly,
            name: hierarchyName,
            oldName: requestObject.adParams.oldOuName,
            id: requestObject.kartoffelParams.id,
          });
        } else {
          setHierarchy(requestObject);
        }
      }
    }, [requestObject]);

    const onSubmit = async (data) => {
      try {
        await validationSchema.validate(data);
      } catch (err) {
        console.log(err);
        throw new Error(err.errors);
      }
      const { approvers, comments, hierarchyName } = data;

      const req = {
        commanders: approvers,
        kartoffelParams: {
          id: hierarchy.id,
          name: hierarchyName,
        },
        adParams: {
          ouDisplayName: `${hierarchy.hierarchy}/${hierarchyName}`,
          oldOuName: hierarchy.name,
          newOuName: hierarchyName,
        },
        comments,
        due: Date.now(),
      };

      const res = await appliesStore.renameOGApply(req);
      setIsActionDone(true);
    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: methods.handleSubmit(onSubmit),
        resetForm: () => {
          // TODO: SET DEFAULT
        },
      }),
      []
    );

    return (
      <FormProvider {...methods}>
        <div className="p-fluid">
          <div className="p-fluid-item p-fluid-item">
            <div className="p-field">
              <label>
                <span className="required-field">*</span>
                {reqView ? "היררכיה חדשה" : "היררכיה"}
              </label>
              <HierarchyField
                isEdit={!onlyForView}
                hierarchy={hierarchy}
                setIsHierarchyFree={setIsHierarchyFree}
                methods={methods}
              />
            </div>
          </div>

          {reqView && (
            <div className="p-fluid-item p-fluid-item">
              <div className="p-field">
                <label>
                  <span className="required-field">*</span>
                  היררכיה ישנה
                </label>
                <HierarchyField
                  isEdit={!onlyForView}
                  hierarchy={{ hierarchy: hierarchy.hierarchy, name: hierarchy.oldName }}
                  setIsHierarchyFree={setIsHierarchyFree}
                  methods={methods}
                />
              </div>
            </div>
          )}

          {!reqView && (
            <div className="p-fluid-item p-fluid-item">
              <div className="p-field">
                {getLabel({ labelName: "מספר תפקידים" })}
                <InputText
                  id="2011"
                  type="text"
                  disabled
                  style={disabledInputStyle}
                  placeholder={hierarchy?.directRoles ? hierarchy.directRoles?.length : 0}
                />
              </div>
            </div>
          )}

          <div className="p-fluid-item p-fluid-item">
            <div className="p-field">
              {getLabel({ labelName: "מזהה היררכיה" })}
              <InputText id="2011" type="text" disabled style={disabledInputStyle} placeholder={hierarchy.id} />
            </div>
          </div>

          {(!onlyForView || reqView) && (
            <div className="p-fluid-item">
              <Approver
                setValue={methods.setValue}
                name="approvers"
                tooltip='רס"ן ומעלה ביחידתך'
                multiple={true}
                errors={errors}
                trigger={methods.trigger}
                defaultApprovers={GetDefaultApprovers([], false)}
                disabled={isUserHoldType}
              />
            </div>
          )}

          {(reqView || !onlyForView) && (
            <div className="p-fluid-item p-fluid-item-flex1">
              <div className="p-field">
                <label>
                  <span></span>הערות
                </label>
                <InputTextarea
                  {...methods.register("comments")}
                  id="2028"
                  type="text"
                  placeholder="הכנס הערות לבקשה..."
                  disabled={onlyForView}
                />
              </div>
            </div>
          )}
        </div>
      </FormProvider>
    );
  }
);

export { FullHierarchyInformationForm };
