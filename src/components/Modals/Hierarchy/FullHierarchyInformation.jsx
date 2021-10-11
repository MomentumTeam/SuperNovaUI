import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";

import { ContainerRoleList } from "./FullHierarchyContainerRoleList";
import { FullHierarchyInformationFooter } from "./FullHierarchyInformationFooter";
import { getLabel, disabledInputStyle } from "../../Fields/InputCommon";
import { getHierarchy } from '../../../utils/hierarchy';
import { HierarchyDelete } from "./HierarchyDelete";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";

const FullHierarchyInformation = ({ hierarchy, isOpen, closeModal, edit }) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [form, setForm] = useState(hierarchy);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {setIsDeleteModalOpen(false)};

  useEffect(() => {
    const { hierarchyReadOnly, hierarchyName } = getHierarchy(hierarchy.hierarchy);
    const tempForm = { ...hierarchy };
    tempForm.oldName = hierarchyName;
    tempForm.name = hierarchyName;
    tempForm.hierarchyPrefix = hierarchyReadOnly;

    setForm(tempForm);
  }, [isEdit]);

  return (
    <>
      <Dialog
        className={classNames("dialogClass5")}
        header={isEdit ? "עריכת היררכיה" : "פרטי היררכיה"}
        visible={isOpen}
        style={{ borderRadius: "30px" }}
        onHide={closeModal}
        footer={
          <FullHierarchyInformationFooter
            isEdit={isEdit}
            closeFullDetailsModal={closeModal}
            setIsEdit={setIsEdit}
            form={form}
            openDeleteModal={openDeleteModal}
          />
        }
      >
        <div className="p-fluid">
          <div className="p-fluid-item p-fluid-item-flex1">
            <div className="p-field">
              {getLabel({ isEdit, canEdit: true, labelName: "היררכיה" })}
              <div className="textWithPrefix p-inputgroup">
                <InputText
                  type="text"
                  disabled={!isEdit}
                  style={isEdit ? {} : disabledInputStyle}
                  placeholder={form.name}
                  onChange={(e) => {
                    let tempForm = { ...form };
                    tempForm.name = e.target.value;
                    setForm(tempForm);
                  }}
                  value={form.name}
                  keyfilter={/^[\w\s\u0590-\u05FF]+$/}
                />
                <span id="perfixSlash">/</span>
                <span className="textPrefix p-inputgroup-addon">{form.hierarchyPrefix}</span>
              </div>
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
                placeholder={hierarchy.directRoles? hierarchy.directRoles.length: 0}
              />
            </div>
          </div>

          <div className="p-fluid-item">
            <div className="p-field">
              {getLabel({ labelName: "מפתח" })}
              <InputText id="2011" type="text" disabled style={disabledInputStyle} placeholder={hierarchy.id} />
            </div>
          </div>
        </div>

        <div className="p-fluid-item p-fluid-item-flex1">
          <hr />
          <h2>רשימת תפקידים</h2>
        </div>
        <div className="containerRoleList">
          <ContainerRoleList roles={hierarchy.directRoles} />
        </div>
      </Dialog>
      <HierarchyDelete hierarchy={form} isOpen={isDeleteModalOpen} closeModal={closeDeleteModal} />
    </>
  );
};

export { FullHierarchyInformation };
