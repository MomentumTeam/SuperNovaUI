import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";

import { ContainerRoleList } from "./FullHierarchyContainerRoleList";
import { FullHierarchyInformationFooter } from "./FullHierarchyInformationFooter";
import { HierarchyDelete } from "./HierarchyDelete";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";
import { FullHierarchyInformationForm } from "./FullHierarchyInformationForm";

const FullHierarchyInformation = ({ hierarchy, isOpen, closeModal, edit, actionPopup }) => {
  const [isEdit, setIsEdit] = useState(edit);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isActionDone, setIsActionDone] = useState(false);
  const ref = useRef(null);

  const handleRequest = async () => {
    try {
      await ref.current.handleSubmit();
    } catch (e) {
      actionPopup("עריכת קבוצה", e.message || "Message Content");
    }
  };

  const resetForm = () => ref.current.resetForm();

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  useEffect(() => {
    if (isActionDone) {
      actionPopup();
      closeModal();
    }
  }, [isActionDone]);
  return (
    <>
      <Dialog
        className={classNames("dialogClass5")}
        header={isEdit ? "עריכת היררכיה" : "פרטי היררכיה"}
        visible={isOpen}
        style={{ borderRadius: "30px" }}
        onHide={closeModal}
        dismissableMask={true}
        footer={
          <FullHierarchyInformationFooter
            hierarchy={hierarchy}
            isEdit={isEdit}
            closeModal={closeModal}
            setIsEdit={setIsEdit}
            handleRequest={handleRequest}
            resetForm={resetForm}
            openDeleteModal={openDeleteModal}
          />
        }
      >
        <FullHierarchyInformationForm
          ref={ref}
          reqView={false}
          requestObject={hierarchy}
          setIsActionDone={setIsActionDone}
          onlyForView={!isEdit}
        />

        <div className="p-fluid-item p-fluid-item-flex1">
          <hr />
          <h2>רשימת תפקידים</h2>
        </div>
        <div className="containerRoleList">
          <ContainerRoleList roles={hierarchy.directRoles} />
        </div>
      </Dialog>
      <HierarchyDelete hierarchy={hierarchy} isOpen={isDeleteModalOpen} closeModal={closeDeleteModal} />
    </>
  );
};

export { FullHierarchyInformation };
