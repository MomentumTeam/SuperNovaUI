import { USER_ENTITY_TYPE, USER_TYPE, USER_TYPE_TAG } from "../constants";

// permissions
export const isUserCanSeeAllApproveApplies = (user) => {
  const allowedTypes = [USER_TYPE.SUPER_SECURITY, USER_TYPE.SECURITY, USER_TYPE.ADMIN];
  return user?.types && allowedTypes.some((allowedType) => user.types.includes(allowedType));
};

export const isUserCanSeeMyApproveApplies = (user) => {
  const allowedTypes = [USER_TYPE.COMMANDER, USER_TYPE.SUPER_SECURITY, USER_TYPE.SECURITY, USER_TYPE.ADMIN];
  return user?.types && allowedTypes.some((allowedType) => user.types.includes(allowedType));
};

export const isUserHoldType = (user, type) => {
  return user?.types && user.types.includes(type);
};

export const isUserApproverType = (user) => {
  return isUserHoldType(user, USER_TYPE.COMMANDER) || isUserHoldType(user, USER_TYPE.ADMIN);
}


export const getUserTags = (types) => {
  let tags = [];
  let isValidType = true;

  types.map(type => {
    switch (type) {
      case USER_TYPE.BULK:
      case 6:
        tags.push(USER_TYPE_TAG.BULK)
        break;
      case USER_TYPE.ADMIN:
      case 5:
        tags.push(USER_TYPE_TAG.ADMIN);
        break;
      case USER_TYPE.SUPER_SECURITY:
      case 2:
        tags.push(USER_TYPE_TAG.SUPER_SECURITY_APPROVER);
        break;
      case USER_TYPE.SECURITY:
      case 1:
        tags.push(USER_TYPE_TAG.SECURITY_APPROVER);
        break;
      case USER_TYPE.COMMANDER:
      case 3:
        tags.push(USER_TYPE_TAG.APPROVER);
        break;
      default:
        isValidType = false;
        break;
    }
  })

  return tags;
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
  return user[0]? user[0]: user[1]? user[1]: "---"
};

export const kartoffelIdentityCardValidation = (identityCard) => {
  //kartoffel validation for identityCard
  identityCard = identityCard.padStart(9, '0');

  const accumulator = identityCard
    .split('')
    .reduce((count, currChar, currIndex) => {
      const num = Number(currChar) * ((currIndex % 2) + 1);
      return (count += num > 9 ? num - 9 : num);
    }, 0);

  return accumulator % 10 === 0;
};
