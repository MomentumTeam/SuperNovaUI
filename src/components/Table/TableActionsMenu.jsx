import React, { createContext, forwardRef, useContext, useEffect, useRef, useState } from "react";
import { ContextMenu } from "primereact/contextmenu";
import { Toast } from "primereact/toast";

import { TableActions } from "./TableActions";
import { TableActionsModal } from "./TableActionsModal";
import { TableContext } from ".";

export const TableActionsContext = createContext(null);

const TableActionsMenu = forwardRef((_, ref) => {
  const toast = useRef(null);
  const { selectedItem } = useContext(TableContext);
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
      <TableActionsContext.Provider
        value={{ actionType, setActionType, isActionModalOpen, openActionModal, closeActionModal }}
      >
        <ContextMenu model={TableActions({ setActionType, openActionModal })} popup ref={ref} />
        <TableActionsModal ref={toast.current} />
        <Toast ref={toast} />
      </TableActionsContext.Provider>
    </>
  );
});

export { TableActionsMenu };
