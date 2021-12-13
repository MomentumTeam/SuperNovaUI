import { USER_TYPE } from '../constants';
import { useStores } from "../context/use-stores";
import { isUserHoldType } from "./user";

export const GetDefaultApprovers = (request, onlyForView) => {
  const { userStore } = useStores();

  if (request?.commanders) return request?.commanders;
  if (onlyForView) return [];
  if (isUserHoldType(userStore.user, USER_TYPE.COMMANDER)) {
    return [userStore.user];
  }
  return [];
};
