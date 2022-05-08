import configStore from '../store/Config';

export const getUserRelevantIdentity = (user) => {
  return user?.digitalIdentities && Array.isArray(user.digitalIdentities)
    ? user.digitalIdentities.find(
        (identity) => identity.source === configStore.USER_SOURCE_DI
      )
    : undefined;
};

export const getSamAccountNameFromEntity = (entity) => {
  const di = getUserRelevantIdentity(entity);
  return di?.uniqueId ? di.uniqueId.split('@')[0] : '';
};

export const getSamAccountNameFromUniqueId = (uniqueId) => {
  return uniqueId.split('@')[0];
};
