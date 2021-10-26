import { USER_CITIZEN, USER_SOURCE_DI, USER_TYPE } from '../constants';
import { toJS } from 'mobx';
import { TableTypes } from '../constants/table';
import { useStores } from '../context/use-stores';

export const canEditEntity = (selectedEntity, user) => {
  return (
    selectedEntity &&
    selectedEntity.serviceType === USER_CITIZEN &&
    (user.types.includes(USER_TYPE.ADMIN) || selectedEntity.id === user.id)
  );
};

export const CanSeeUserClearance = () => {
  const { userStore } = useStores();
  const user = toJS(userStore.user);

  const field = TableTypes.entities.find(
    (field) => field.field === 'clearance'
  );
  return field.secured.some((allowedType) => user.types.includes(allowedType));
};

export const getSamAccountName = (entity) => {
  return entity.digitalIdentities.find((di) => di.source === USER_SOURCE_DI)
    .uniqueId;
};
