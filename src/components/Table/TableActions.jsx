import { toJS } from "mobx";
import { useStores } from "../../context/use-stores";

import { TableAppliesActionsTypes } from "../../constants/applies";
import { TableActionsTypes, TableNames } from "../../constants/table";
import { USER_TYPE } from "../../constants";
import { canEditEntity } from "../../utils/entites";
import { canEditRole } from "../../utils/roles";
import { canEditHierarchy } from "../../utils/hierarchy";
import { useContext } from "react";
import { TableContext } from ".";
import { isUserHoldType } from "../../utils/user";

// TODO: change to reducer
const TableActions = ({ setActionType, openActionModal, setEvent }) => {
  const { selectedItem, tableType } = useContext(TableContext);
  const { userStore } = useStores();

  let actions = [];
  const user = toJS(userStore.user);
  const dictAction = {...TableActionsTypes,...TableAppliesActionsTypes}
  const tableActions = dictAction[tableType];

  const getAction = (labelName, action) => {
    return {
      label: labelName,
      command: (e) => {
        setActionType(action);
        setEvent(e);
        openActionModal();
      },
    }
  };


  if (tableActions) {
    // Add view action
    if (tableActions.view) actions.push(getAction('צפייה', tableActions.view));

    // Add edit action
    if (tableActions.edit) {
      if (
        (tableType === TableNames.entities.tab && canEditEntity(selectedItem[0], user)) ||
        (tableType === TableNames.roles.tab && canEditRole(selectedItem[0], user)) ||
        (tableType === TableNames.hierarchy.tab && canEditHierarchy(user))
      ) {
        actions.push(getAction("עריכה", tableActions.edit));
      }
    }

    // Add delete action
    if (tableActions.delete) {
      if (isUserHoldType(user, USER_TYPE.COMMANDER)) {
        actions.push(getAction("מחיקה", tableActions.delete));
      }
    }

    // Add view action
    if (tableActions.pass) actions.push(getAction("העבר לטיפול גורם אחר", tableActions.pass));
    if (tableActions.take) actions.push(getAction("העברה לטיפולי", tableActions.take));

    return actions;
  }
};

export { TableActions };
