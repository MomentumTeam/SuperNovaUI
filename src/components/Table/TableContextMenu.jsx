import React, { forwardRef, useEffect, useState } from "react";
import { ContextMenu } from "primereact/contextmenu";

import { TableActions } from "./TableActions";
import { TableActionsModal } from "./TableActionsModal";

const TableContextMenu = forwardRef(({ selectedItem, tableType }, ref) => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const openActionModal = () => setIsActionModalOpen(true);
  const closeActionModal = () => setIsActionModalOpen(false);

  useEffect(() => {
    setActionType(null);
    closeActionModal();
  }, [selectedItem]);

  return (
    <>
      <ContextMenu model={TableActions({ tableType, setActionType, openActionModal, selectedItem })} popup ref={ref} />

      <TableActionsModal
        actionType={actionType}
        item={selectedItem}
        isOpen={isActionModalOpen}
        closeActionModal={closeActionModal}
      />
    </>
  );
});

export { TableContextMenu };
