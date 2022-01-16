import configStore from '../store/Config';

export const getSamAccountNameFromEntity = (entity) => {
  const di = entity.digitalIdentities.find((di) => di.source === configStore.USER_SOURCE_DI);
  return di?.uniqueId ? di.uniqueId.split("@")[0]: '';
};

export const getSamAccountNameFromUniqueId = (uniqueId) => {
  return uniqueId.split("@")[0];
};
