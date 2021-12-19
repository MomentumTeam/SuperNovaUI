import { USER_TYPE } from '../constants';
import { useStores } from '../context/use-stores';
import { isUserHoldType } from './user';

export const GetDefaultApprovers = (request, onlyForView, showJob = false) => {
  const { userStore } = useStores();

  if (request?.commanders) return request?.commanders;
  if (onlyForView) return [];

  //happens in BackEnd--->

  if (isUserHoldType(userStore.user, USER_TYPE.COMMANDER)) {
    if (showJob) {
      return [];
    }
    else {
      return [userStore.user];
    }
  }
  return [];
};
