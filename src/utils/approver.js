import { USER_TYPE } from '../constants';
import { isApproverValid } from '../service/ApproverService';
import { isUserHoldType } from './user';

export const GetDefaultApprovers = async ({request, onlyForView, user, showJob = false, groupId = null}) => {
  if (request?.commanders) return request?.commanders;
  if (onlyForView) return [];

  if (isUserHoldType(user, USER_TYPE.COMMANDER)) {
    if (showJob) return [];

    if (groupId) {
      const {isValid} = await isApproverValid(user.id, groupId);
      if (!isValid) return [];
    }

    return [user];
  }
  
  return [];
};
