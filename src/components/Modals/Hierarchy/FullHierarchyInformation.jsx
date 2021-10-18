import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { yupResolver } from "@hookform/resolvers/yup";

import { ContainerRoleList } from "./FullHierarchyContainerRoleList";
import { FullHierarchyInformationFooter } from "./FullHierarchyInformationFooter";
import { getLabel, disabledInputStyle } from "../../Fields/InputCommon";
import { HierarchyDelete } from "./HierarchyDelete";
import { NAME_OG_EXP } from '../../../constants';

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";
import Approver from '../../Fields/Approver';
import { HierarchyField } from '../../Fields/Hierarchy';


const FullHierarchyInformation = ({ hierarchy, isOpen, closeModal, edit, actionPopup }) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHierarchyFree, setIsHierarchyFree] = useState(true);

  const validationSchema = Yup.object().shape({
    approvers: Yup.array().min(1, "יש לבחור לפחות גורם מאשר אחד").required("יש לבחור לפחות גורם מאשר אחד"),
    hierarchyName: Yup.string()
      .matches(NAME_OG_EXP, "שם לא תקין")
      .required("יש לבחור שם היררכיה")
      .test({
        name: "hierarchy-valid-check",
        message: "היררכיה תפוסה",
        test: () => {
          return isHierarchyFree;
        },
      }),
  });

  const methods = useForm({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    defaultValues: {},
    resolver: yupResolver(validationSchema),
  });

  const { errors } = methods.formState;

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <FormProvider {...methods}>
      <Dialog
        className={classNames("dialogClass5")}
        header={isEdit ? "עריכת היררכיה" : "פרטי היררכיה"}
        visible={isOpen}
        style={{ borderRadius: "30px" }}
        onHide={closeModal}
        footer={
          <FullHierarchyInformationFooter
            isEdit={isEdit}
            closeModal={closeModal}
            setIsEdit={setIsEdit}
            openDeleteModal={openDeleteModal}
            hierarchy={hierarchy}
            actionPopup={actionPopup}
          />
        }
      >
        <div className="p-fluid">
          <div className="p-fluid-item p-fluid-item-flex1">
            <div className="p-field">
              {getLabel({ isEdit, canEdit: true, labelName: "היררכיה" })}
              <HierarchyField isEdit={isEdit} hierarchy={hierarchy} setIsHierarchyFree={setIsHierarchyFree} />
            </div>
          </div>

          <div className="p-fluid-item">
            <div className="p-field">
              {getLabel({ labelName: "מספר תפקידים" })}
              <InputText
                id="2011"
                type="text"
                disabled
                style={disabledInputStyle}
                placeholder={hierarchy.directRoles ? hierarchy.directRoles.length : 0}
              />
            </div>
          </div>

          <div className="p-fluid-item">
            <div className="p-field">
              {getLabel({ labelName: "מפתח" })}
              <InputText id="2011" type="text" disabled style={disabledInputStyle} placeholder={hierarchy.id} />
            </div>
          </div>

          {isEdit && (
            <div className="p-fluid-item">
              <Approver
                setValue={methods.setValue}
                name="approvers"
                multiple={true}
                errors={errors}
                trigger={methods.trigger}
              />
            </div>
          )}
        </div>

        <div className="p-fluid-item p-fluid-item-flex1">
          <hr />
          <h2>רשימת תפקידים</h2>
        </div>
        <div className="containerRoleList">
          <ContainerRoleList roles={hierarchy.directRoles} />
        </div>
      </Dialog>
      <HierarchyDelete hierarchy={hierarchy} isOpen={isDeleteModalOpen} closeModal={closeDeleteModal} />
    </FormProvider>
  );
};

FullHierarchyInformation.defaultProps = {
  approverRequestObj: {},
};

export { FullHierarchyInformation };
