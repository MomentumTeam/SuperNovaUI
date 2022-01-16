import { toJS } from "mobx";
import { useStores } from "../../context/use-stores";

import { TableAppliesActionsTypes } from "../../constants/applies";
import {
  TableActionsTypes as UsersTableActionsTypes,
  TableNames as UsersTableNames,
} from "../../constants/usersTable";
import {
  TableActionsTypes as MyRequestsTableActionsTypes,
  TableNames as MyRequestsUsersTableNames,
} from "../../constants/myRequestsTable";
import { canEditEntity } from "../../utils/entites";
import { canEditRole } from "../../utils/roles";
import { canEditHierarchy } from "../../utils/hierarchy";
import { useContext } from "react";
import { TableContext } from ".";
import { isUserApproverType } from "../../utils/user";
import { canPassApply, isApproverAndCanEdit } from "../../utils/applies";

const TableActions = ({ setActionType, openActionModal, setEvent }) => {
  const { selectedItem, tableType } = useContext(TableContext);
  const { userStore } = useStores();

  let actions = [];
  const user = toJS(userStore.user);
  const dictAction = {
    ...UsersTableActionsTypes,
    ...MyRequestsTableActionsTypes,
    ...TableAppliesActionsTypes,
  };
  const tableActions = dictAction[tableType];

  const getAction = (labelName, action) => {
    return {
      label: labelName,
      command: (e) => {
        setActionType(action);
        setEvent(e);
        openActionModal();
      },
    };
  };

  if (tableActions) {
    // Add view action
    if (tableActions.view) actions.push(getAction("צפייה", tableActions.view));

    // Add edit action
    if (tableActions.edit) {
      if (
        (tableType === UsersTableNames.entities.tab &&
          canEditEntity(selectedItem[0], user)) ||
        (tableType === UsersTableNames.roles.tab &&
          canEditRole(selectedItem[0], user)) ||
        (tableType === UsersTableNames.hierarchy.tab && canEditHierarchy(user))
      ) {
        actions.push(getAction("עריכה", tableActions.edit));
      }
    }

    // Add delete action
    if (tableActions.delete) {
      if (isUserApproverType(userStore.user)) {
        actions.push(getAction("מחיקה", tableActions.delete));
      }
    }

    // Add view action
    if (tableActions.pass && canPassApply(selectedItem[0], user))
      actions.push(getAction("העבר לטיפול גורם אחר", tableActions.pass));
    if (tableActions.take && canPassApply(selectedItem[0], user) && !isApproverAndCanEdit(selectedItem[0], user))
      actions.push(getAction("העברה לטיפולי", tableActions.take));

    return actions;
  }
};

export { TableActions };
