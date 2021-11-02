import React, { useContext, forwardRef } from "react";

import { TableContext } from ".";
import { TableActionsContext } from "./TableActionsMenu";

import { tableActionsEnum } from "../../constants/table";
import FullEntityInformationModal from "../Modals/Entity/FullEntityInformationModal";
import { FullHierarchyInformation } from "../Modals/Hierarchy/FullHierarchyInformation";
import { FullRoleInformation } from "../Modals/Role/FullRoleInformation";
import { HierarchyDelete } from "../Modals/Hierarchy/HierarchyDelete";

import { TableAppliesActionsEnum } from "../../constants";
import { PassRequestDialog } from "../Modals/Request/PassRequestDialog";
import PreviewRequestsDialog from "../Modals/Request/PreviewRequestsDialog1";

// TODO: change to reducer?
const TableActionsModal = forwardRef((_, ref) => {
  const {toastRef, contextMenuRef} = ref;
  const { selectedItem } = useContext(TableContext);
  const { actionType, isActionModalOpen, closeActionModal, setIsActionModalOpen, currEvent } =
    useContext(TableActionsContext);

  const actionPopup = (error = null) => {
    if (error === null) {
      toastRef.show({
        severity: "success",
        summary: "Success Message",
        detail: `Success in action: ${actionType}`,
        life: 3000,
      });
    } else {
      toastRef.show({
        severity: "error",
        summary: "Error Message",
        detail: error.message || `action: ${actionType} failed`,
        life: 3000,
      });
    }
  };

  const renderActionModal = () => {
    if (selectedItem[0] && actionType && isActionModalOpen) {
      switch (actionType) {
        // ENTITY
        case tableActionsEnum.VIEW_ENTITY:
          return (
            <FullEntityInformationModal
              user={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeFullDetailsModal={closeActionModal}
              edit={false}
              actionPopup={actionPopup}
            />
          );
        case tableActionsEnum.EDIT_ENTITY:
          return (
            <FullEntityInformationModal
              user={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeFullDetailsModal={closeActionModal}
              edit={true}
              actionPopup={actionPopup}
            />
          );

        // HIERARCHY
        case tableActionsEnum.VIEW_HIERARCHY:
          return (
            <FullHierarchyInformation
              hierarchy={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={false}
              actionPopup={actionPopup}
            />
          );
        case tableActionsEnum.EDIT_HIERARCHY:
          return (
            <FullHierarchyInformation
              hierarchy={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={true}
              actionPopup={actionPopup}
            />
          );
        case tableActionsEnum.DELETE_HIERARCHY:
          return (
            <HierarchyDelete
              hierarchy={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              actionPopup={actionPopup}
            />
          );

        // ROLE
        case tableActionsEnum.VIEW_ROLE:
          return (
            <FullRoleInformation
              role={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={false}
              actionPopup={actionPopup}
            />
          );
        case tableActionsEnum.EDIT_ROLE:
          return (
            <FullRoleInformation
              role={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={true}
              actionPopup={actionPopup}
            />
          );
        case TableAppliesActionsEnum.VIEW_APPLY:
        case TableAppliesActionsEnum.VIEW_MY_APPLY:
          return (
            <PreviewRequestsDialog
              isDialogVisible={isActionModalOpen}
              setDialogVisiblity={setIsActionModalOpen}
              request={selectedItem[0]}
              isApprover={actionType === TableAppliesActionsEnum.VIEW_MY_APPLY}
            />
          );
        case TableAppliesActionsEnum.PASS_APPLY:
          return (
            <PassRequestDialog
              request={selectedItem[0]}
              isDialogVisible={isActionModalOpen}
              setDialogVisiblity={setIsActionModalOpen}
              currEvent={currEvent}
            />
          );
        case TableAppliesActionsEnum.TAKE_APPLY:
        default:
          toastRef.show({
            severity: "error",
            summary: "פעולה לא ממומשת",
            detail: `פעולה זו לא ממומשת במערכת עדיין`,
            life: 1000,
          });
          closeActionModal();
      }
    }

    return <></>;
  };

  return <>{renderActionModal()}</>;
});

export { TableActionsModal };
