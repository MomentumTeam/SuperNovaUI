import { USER_TYPE } from '../constants';
import { isApproverValid } from '../service/ApproverService';
import configStore from '../store/Config';
import { isUserHoldType } from './user';

export const GetDefaultApprovers = async ({request, onlyForView, user, showJob = false, groupId = null, highCommander = false}) => {
  if (request?.commanders) return request?.commanders;
  if (onlyForView) return [];

  if (isUserHoldType(user, USER_TYPE.COMMANDER)) {
    if (showJob) return [];
    if (highCommander) {
     if (!user?.rank || !configStore.USER_HIGH_COMMANDER_RANKS.includes(user.rank)) return [];
    }

    if (groupId) {
      try {
        const {isValid} = await isApproverValid(user?.entityId || user?.id, groupId);
        if (!isValid) return [];
        
      } catch (error) {
        return [];
      }
    }

    return [user];
  }
  
  return [];
};
