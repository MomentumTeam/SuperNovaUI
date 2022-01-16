import { USER_ENTITY_TYPE, USER_TYPE, USER_TYPE_TAG } from "../constants";

// permissions
export const isUserCanSeeAllApproveApplies = (user) => {
  const allowedTypes = [USER_TYPE.SUPER_SECURITY, USER_TYPE.SECURITY, USER_TYPE.ADMIN];
  return allowedTypes.some((allowedType) => user.types.includes(allowedType));
};

export const isUserCanSeeMyApproveApplies = (user) => {
  const allowedTypes = [USER_TYPE.COMMANDER, USER_TYPE.SUPER_SECURITY, USER_TYPE.SECURITY, USER_TYPE.ADMIN];
  return allowedTypes.some((allowedType) => user.types.includes(allowedType));
};

export const isUserHoldType = (user, type) => {
  return user.types.includes(type);
};

export const isUserApproverType = (user) => {
  return isUserHoldType(user, USER_TYPE.COMMANDER) || isUserHoldType(user, USER_TYPE.ADMIN);
}


export const getUserTag = (type) => {
  let tag;
  let isValidType = true;

  switch (type) {
    case USER_TYPE.ADMIN:
    case 5:
      tag = USER_TYPE_TAG.ADMIN;
      break;
    case USER_TYPE.SUPER_SECURITY:
    case 2:
      tag = USER_TYPE_TAG.SUPER_SECURITY_APPROVER;
    case USER_TYPE.SECURITY:
    case 1:
      tag = USER_TYPE_TAG.SECURITY_APPROVER;
      break;
    case USER_TYPE.COMMANDER:
    case 3:
      tag = USER_TYPE_TAG.APPROVER;
      break;
    case USER_TYPE.BULK:
    case 6:
      break;
    default:
      isValidType = false;
      break;
  }

  const userType = { type: isValidType ? type : USER_TYPE.SOLDIER };
  if (tag) userType.tag = tag;

  return userType;
};

export const getUserNameFromDisplayName = (displayName) => {
  const name = displayName.split("/").pop();
  return name;
};

export const userTemplate = (user) => {
  return <>{user.displayName ? user.displayName : user.fullName + `${user.jobTitle ? "-" + user.jobTitle : ""}`}</>;
}

export const userConverse = (user) => {
  if (user && (user?.displayName || user?.fullName)) return user.displayName ? user.displayName : user.fullName + `${user.jobTitle ? "-" + user.jobTitle : ""}`;
  return undefined
};

export const formatServiceType = (user) => {
  return <>{user[1] ? user[0] : USER_ENTITY_TYPE[user[0]]}</>;
}

export const identityOrPersonalNumber = (user) => {
  return user[0]? user[0]: user[1]
};