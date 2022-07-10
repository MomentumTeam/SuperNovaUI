import React, { useContext, forwardRef } from "react";

import { TableContext } from ".";
import { TableActionsContext } from "./TableActionsMenu";

// Table
import { TableAppliesActionsEnum } from "../../constants";

// Entity
import { tableActionsEnum as usersTableActionsEnum } from "../../constants/usersTable";
import { tableActionsEnum as myRequestsTableActionsEnum } from "../../constants/myRequestsTable";

import FullEntityInformationModal from "../Modals/Entity/FullEntityInformationModal";

// Hierarchy
import { FullHierarchyInformation } from "../Modals/Hierarchy/FullHierarchyInformation";
import { HierarchyDelete } from "../Modals/Hierarchy/HierarchyDelete";

// Role
import { FullRoleInformation } from "../Modals/Role/FullRoleInformation";

// Request
import { PassRequestDialog } from "../Modals/Request/PassRequestDialog";
import PreviewRequestsDialog from "../Modals/Request/PreviewRequestsDialog1";
import { TakeRequest } from "../Modals/Request/TakeRequest";
import { ReturnRequest } from '../Modals/Request/ReturnRequest';
import { useToast } from '../../context/use-toast';
import { RoleDelete } from "../Modals/Role/RoleDelete";

const TableActionsModal = forwardRef((_, ref) => {
  const { actionPopup, toastRef } = useToast();
  const { selectedItem } = useContext(TableContext);
  const {
    actionType,
    isActionModalOpen,
    closeActionModal,
    setIsActionModalOpen,
  } = useContext(TableActionsContext);

  const sendActionPopup = (actionName = actionType, error = null) => {
    actionPopup(actionName, error);
  }

  const renderActionModal = () => {
    if (selectedItem[0] && actionType && isActionModalOpen) {
      switch (actionType) {
        // ENTITY
        case usersTableActionsEnum.VIEW_ENTITY:
          return (
            <FullEntityInformationModal
              user={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeFullDetailsModal={closeActionModal}
              edit={false}
              actionPopup={sendActionPopup}
            />
          );
        case usersTableActionsEnum.EDIT_ENTITY:
          return (
            <FullEntityInformationModal
              user={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeFullDetailsModal={closeActionModal}
              edit={true}
              actionPopup={sendActionPopup}
            />
          );

        // HIERARCHY
        case usersTableActionsEnum.VIEW_HIERARCHY:
          return (
            <FullHierarchyInformation
              hierarchy={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={false}
              actionPopup={sendActionPopup}
            />
          );
        case usersTableActionsEnum.EDIT_HIERARCHY:
          return (
            <FullHierarchyInformation
              hierarchy={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={true}
              actionPopup={sendActionPopup}
            />
          );
        case usersTableActionsEnum.DELETE_HIERARCHY:
          return (
            <HierarchyDelete
              hierarchy={selectedItem[0]}
              isDialogVisible={isActionModalOpen}
              setDialogVisiblity={setIsActionModalOpen}
              actionPopup={sendActionPopup}
            />
          );

        // ROLE
        case usersTableActionsEnum.VIEW_ROLE:
          return (
            <FullRoleInformation
              role={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={false}
              actionPopup={sendActionPopup}
            />
          );
        case usersTableActionsEnum.EDIT_ROLE:
          return (
            <FullRoleInformation
              role={selectedItem[0]}
              isOpen={isActionModalOpen}
              closeModal={closeActionModal}
              edit={true}
              actionPopup={sendActionPopup}
            />
          );
        case usersTableActionsEnum.DELETE_ROLE:
          return (
            <RoleDelete
              role={selectedItem[0]}
              isDialogVisible={isActionModalOpen}
              setDialogVisiblity={setIsActionModalOpen}
              actionPopup={sendActionPopup}
            />
          );

        // REQUESTS
        case myRequestsTableActionsEnum.VIEW_MY_REQUESTS:
          return (
            <PreviewRequestsDialog
              isDialogVisible={isActionModalOpen}
              setDialogVisiblity={setIsActionModalOpen}
              request={selectedItem[0]}
            />
          );
        case TableAppliesActionsEnum.VIEW_APPLY:
        case TableAppliesActionsEnum.VIEW_MY_APPLY:
          return (
            <PreviewRequestsDialog
              isDialogVisible={isActionModalOpen}
              setDialogVisiblity={setIsActionModalOpen}
              request={selectedItem[0]}
            />
          );
        case myRequestsTableActionsEnum.PASS_MY_REQUESTS:
        case TableAppliesActionsEnum.PASS_APPLY:
          return (
            <PassRequestDialog
              request={selectedItem[0]}
              isDialogVisible={isActionModalOpen}
              setDialogVisiblity={setIsActionModalOpen}
              actionPopup={sendActionPopup}
            />
          );
        case TableAppliesActionsEnum.RETURN_APPLY:
          ReturnRequest({ request: selectedItem[0], actionPopup: actionPopup });
          closeActionModal();
          break;
        case TableAppliesActionsEnum.TAKE_APPLY:
          TakeRequest({ request: selectedItem[0], actionPopup: actionPopup });
          closeActionModal();
          break;
        default:
          toastRef.current.show({
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
