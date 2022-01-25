import { USER_TYPE } from '../constants';
import { useStores } from '../context/use-stores';
import { isUserHoldType } from './user';

export const canEditRole = (selectedEntity, user) => {
  return (
    isRoleBelongToEntity(user, selectedEntity) ||
    isUserHoldType(user, USER_TYPE.SUPER_SECURITY) ||
    isUserHoldType(user, USER_TYPE.SECURITY)
  );
};

export const isRoleBelongToEntity = (user, role) => {
  return (
    role && user.digitalIdentities && user.digitalIdentities.find((di) => di.role?.roleId && di.role.roleId === role.roleId)
  );
}
export const CanEditRoleFields = (selectedRole) => {
  const { userStore } = useStores();
  const canEdit = isRoleBelongToEntity(userStore.user, selectedRole);
  return canEdit;
};

export const roleItemTemplate = (item) => {
//   const getRole = () => {
//     if (item?.hierarchy && item?.jobTitle && item.jobTitle != "" && item.jobTitle != "unknown") {
//       return `${ item.jobTitle + "/" + item?.hierarchy}`
//     } else {
//       return `${ item.roleId}`
// 
//     }
//   }

  const getRole = () => {return item.roleId};
  return (
    <>
    {getRole()}
    </>
  );
};

