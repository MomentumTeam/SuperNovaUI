import { USER_SOURCE_DI } from '../constants';

export const getSamAccountNameFromEntity = (entity) => {
  const di = entity.digitalIdentities.find((di) => di.source === USER_SOURCE_DI);
  return di.uniqueId.split("@")[0];
};

export const getSamAccountNameFromUniqueId = (uniqueId) => {
  return uniqueId.split("@")[0];
};
