import configStore from '../store/Config';
import { USER_TYPE } from "../constants";
import { toJS } from "mobx";
import { TableTypes } from "../constants/usersTable";
import { useStores } from "../context/use-stores";
import { isUserHoldType } from "./user";

export const canEditEntity = (selectedEntity, user) => {
  return (
    selectedEntity &&
    selectedEntity.entityType === configStore.USER_CITIZEN_ENTITY_TYPE &&
    (isUserHoldType(user, USER_TYPE.SUPER_SECURITY) ||
      isUserHoldType(user, USER_TYPE.SECURITY) ||
      selectedEntity.id === user.id)
  );
};

export const CanEditEntityFields = (selectedEntity) => {
  const { userStore } = useStores();
  const user = toJS(userStore.user);
  return selectedEntity.id === user.id;
};

export const CanSeeUserClearance = () => {
  const { userStore } = useStores();
  const user = toJS(userStore.user);

  const field = TableTypes.entities.find(
    (field) => field.field === "clearance"
  );
  return field.secured.some((allowedType) => isUserHoldType(user, allowedType));
};

