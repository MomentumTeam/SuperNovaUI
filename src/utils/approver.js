import configStore from '../store/Config';
import { isApproverValid } from '../service/ApproverService';
import { isUserApproverType, isUserHoldType } from './user';
import { USER_TYPE } from '../constants';

export const GetDefaultApprovers = async ({request, onlyForView, user, showJob = false, groupId = null, highCommander = false}) => {
  if (request?.commanders) return request?.commanders;
  if (onlyForView) return [];

  if (isUserApproverType(user)) {
    if (showJob) return [];

    if (!isUserHoldType(user, USER_TYPE.ADMIN)) {
      if (highCommander) {
        if (!user?.rank || !configStore.USER_HIGH_COMMANDER_RANKS.includes(user.rank)) return [];
      }
  
      if (groupId) {
        try {
          const { isValid } = await isApproverValid(user?.entityId || user?.id, groupId);
          if (!isValid) return [];
        } catch (error) {
          return [];
        }
      }
    }

    return [user];
  }
  
  return [];
};

export const checkValidExternalApprover = async ({
  user,
  organizationNumber = null,
}) => {
  const organizationId = configStore.organizationNumberToGroupId[organizationNumber]
  console.log(user, organizationNumber, organizationId)
    if (isUserHoldType(user, USER_TYPE.SECURITY) || isUserHoldType(user, USER_TYPE.SUPER_SECURITY)) 
      return [user];
    if (!user?.rank || !configStore.USER_HIGH_COMMANDER_RANKS.includes(user.rank)) return [];

    if (organizationId) {
      try {
        let isOrganization = true;
        const {
          isValid
        } = await isApproverValid(user?.entityId || user?.id, organizationId, isOrganization);
        if (!isValid) return [];
      } catch (error) {
        return [];
      }
      return [user];
    }
    return [];
  };
