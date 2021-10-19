import { toJS } from "mobx";
import { useStores } from "../../context/use-stores";

import { TableActionsTypes, TableNames } from "../../constants/table";
import { USER_TYPE } from "../../constants";
import { canEditEntity } from "../../utils/entites";
import { canEditRole } from "../../utils/roles";
import { canEditHierarchy } from "../../utils/hierarchy";
import { useContext } from "react";
import { TableContext } from ".";

// TODO: change to reducer
const TableActions = ({ setActionType, openActionModal }) => {
  const { selectedItem, tableType } = useContext(TableContext);
  const { userStore } = useStores();

  let actions = [];
  const user = toJS(userStore.user);
  const tableActions = TableActionsTypes[tableType];

  const viewAction = {
    label: "צפייה",
    command: () => {
      setActionType(tableActions.view);
      openActionModal();
    },
  };

  const editAction = {
    label: "עריכה",
    command: () => {
      setActionType(tableActions.edit);
      openActionModal();
    },
  };

  const deleteAction = {
    label: "מחיקה",
    command: () => {
      setActionType(tableActions.delete);
      openActionModal();
    },
  };

  if (tableActions) {
    // Add view action
    if (tableActions.view) actions.push(viewAction);

    // Add edit action
    if (tableActions.edit) {
      if (
        (tableType === TableNames.entities.tab && canEditEntity(selectedItem, user)) ||
        (tableType === TableNames.roles.tab && canEditRole(selectedItem, user)) ||
        (tableType === TableNames.hierarchy.tab && canEditHierarchy(user))
      ) {
        actions.push(editAction);
      }
    }

    // Add delete action
    if (tableActions.delete) {
      if (user.types.includes(USER_TYPE.COMMANDER)) {
        actions.push(deleteAction);
      }
    }

    return actions;
  }
};

export { TableActions };
