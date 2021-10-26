import React, { useContext, forwardRef } from "react";

import FullEntityInformationModal from "../Modals/Entity/FullEntityInformationModal";
import { tableActionsEnum } from "../../constants/table";
import { FullHierarchyInformation } from "../Modals/Hierarchy/FullHierarchyInformation";
import { FullRoleInformation } from "../Modals/Role/FullRoleInformation";
import { HierarchyDelete } from "../Modals/Hierarchy/HierarchyDelete";
import { TableContext } from ".";
import { TableActionsContext } from "./TableActionsMenu";

// TODO: change to reducer?
const TableActionsModal = forwardRef((_, ref) => {
  const { selectedItem } = useContext(TableContext);
  const { actionType, isActionModalOpen, closeActionModal } = useContext(TableActionsContext);

  const actionPopup = (error = null) => {
    if (error === null) {
      ref.show({
        severity: "success",
        summary: "Success Message",
        detail: `Success in action: ${actionType}`,
        life: 3000,
      });
    } else {
      ref.show({
        severity: "error",
        summary: "Error Message",
        detail: error.message || `action: ${actionType} failed`,
        life: 3000,
      });
    }
  };

  const renderActionModal = () => {
    if (selectedItem && actionType && isActionModalOpen) {
      switch (actionType) {
        // ENTITY
        case tableActionsEnum.VIEW_ENTITY:
          return (
            <FullEntityInformationModal
              user={selectedItem}
              isOpen={isActionModalOpen}
              closeFullDetailsModal={closeActionModal}
              edit={false}
              actionPopup={actionPopup}
            />
          );
        case tableActionsEnum.EDIT_ENTITY:
          return (
            <FullEntityInformationModal
              user={selectedItem}
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
              hierarchy={selectedItem}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={false}
              actionPopup={actionPopup}
            />
          );
        case tableActionsEnum.EDIT_HIERARCHY:
          return (
            <FullHierarchyInformation
              hierarchy={selectedItem}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={true}
              actionPopup={actionPopup}
            />
          );
        case tableActionsEnum.DELETE_HIERARCHY:
          return (
            <HierarchyDelete
              hierarchy={selectedItem}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              actionPopup={actionPopup}
            />
          );

        // ROLE
        case tableActionsEnum.VIEW_ROLE:
          return (
            <FullRoleInformation
              role={selectedItem}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={false}
              actionPopup={actionPopup}
            />
          );
        case tableActionsEnum.EDIT_ROLE:
          return (
            <FullRoleInformation
              role={selectedItem}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={true}
              actionPopup={actionPopup}
            />
          );
        default:
          ref.show({
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
