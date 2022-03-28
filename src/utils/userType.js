import { USER_TYPE, USER_TYPE_TAG } from '../constants/user';

export const sortUserType = (userTypesArray) => {
  let userType;

  if (userTypesArray.includes('SOLDIER') || userTypesArray.includes(4)) {
    userType = {
      type: USER_TYPE.SOLDIER,
    };
  }

  if (userTypesArray.includes('COMMANDER') || userTypesArray.includes(3)) {
    userType = {
      type: USER_TYPE.COMMANDER,
      tag: USER_TYPE_TAG.APPROVER,
    };
  }

  if (userTypesArray.includes('SECURITY') || userTypesArray.includes(1)) {
    userType = {
      type: USER_TYPE.SECURITY,
      tag: USER_TYPE_TAG.SECURITY_APPROVER,
    };
  }

  if (userTypesArray.includes('SECURITY_ADMIN') || userTypesArray.includes(8)) {
    userType = {
      type: USER_TYPE.SECURITY_ADMIN,
      tag: USER_TYPE_TAG.SECURITY_ADMIN,
    };
  }

  if (userTypesArray.includes('SUPER_SECURITY') || userTypesArray.includes(2)) {
    userType = {
      type: USER_TYPE.SUPER_SECURITY,
      tag: USER_TYPE_TAG.SECURITY_APPROVER,
    };
  }

  if (userTypesArray.includes('ADMIN') || userTypesArray.includes(5)) {
    userType = {
      type: USER_TYPE.ADMIN,
      tag: USER_TYPE_TAG.ADMIN,
    };
  }

  if (!userType) {
    userType = {
      type: USER_TYPE.SOLDIER,
    };
  }

  if (userTypesArray.includes('BULK') || userTypesArray.includes(6)) {
    userType = {
      ...userType,
      bulk: true,
    };
  } else {
    userType = {
      ...userType,
      bulk: false,
    };
  }
  return userType;
};
