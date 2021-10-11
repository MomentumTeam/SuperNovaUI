import React, { useRef } from "react";
import { Toast } from "primereact/toast";

import FullEntityInformationModal from "../Modals/Entity/FullEntityInformationModal";
import { tableActionsEnum } from "../../constants/table";
import { FullHierarchyInformation } from "../Modals/Hierarchy/FullHierarchyInformation";
import { FullRoleInformation } from '../Modals/Role/FullRoleInformation';
import { HierarchyDelete } from '../Modals/Hierarchy/HierarchyDelete';

const TableActionsModal = ({ actionType, item, isOpen, closeActionModal }) => {
  const toast = useRef(null);
  
  const renderActionModal = () => {
    if (item && actionType && isOpen) {
      switch (actionType) {
        // ENTITY
        case tableActionsEnum.VIEW_ENTITY:
          return (
            <FullEntityInformationModal
              user={item}
              isOpen={isOpen}
              closeFullDetailsModal={closeActionModal}
              edit={false}
            />
          );
        case tableActionsEnum.EDIT_ENTITY:
          return (
            <FullEntityInformationModal
              user={item}
              isOpen={isOpen}
              closeFullDetailsModal={closeActionModal}
              edit={true}
            />
          );

        // HIERARCHY
        case tableActionsEnum.VIEW_HIERARCHY:
          return (
            <FullHierarchyInformation hierarchy={item} isOpen={isOpen} closeModal={closeActionModal} edit={false} />
          );
        case tableActionsEnum.EDIT_HIERARCHY:
          return (
            <FullHierarchyInformation hierarchy={item} isOpen={isOpen} closeModal={closeActionModal} edit={true} />
          );
        case tableActionsEnum.DELETE_HIERARCHY:
          return <HierarchyDelete hierarchy={item} isOpen={isOpen} closeModal={closeActionModal} />;

        // ROLE
        case tableActionsEnum.VIEW_ROLE:
          return <FullRoleInformation role={item} isOpen={isOpen} closeModal={closeActionModal} edit={false} />;
        case tableActionsEnum.EDIT_ROLE:
          return <FullRoleInformation role={item} isOpen={isOpen} closeModal={closeActionModal} edit={true} />;
        default:
          toast.current.show({
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

  return (
    <>
      <Toast ref={toast} />
      {renderActionModal()}
    </>
  );
};

export { TableActionsModal };
