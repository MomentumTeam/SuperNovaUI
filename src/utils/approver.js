import { USER_TYPE } from '../constants';
import { useStores } from '../context/use-stores';
import { isUserHoldType } from './user';

export const GetDefaultApprovers = (request, onlyForView, showJob=false,replaceApprover) => {
  console.log('request', request);
  const { userStore } = useStores();

  if (request?.commanders) return request?.commanders;
  if (onlyForView) return [];
  if (isUserHoldType(userStore.user, USER_TYPE.COMMANDER)) {
    if (showJob)
   { console.log('replaceApprover', replaceApprover)
      return [];}
    else
      return [userStore.user];
  }
  return [];
};
