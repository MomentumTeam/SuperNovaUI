import { USER_TYPE } from '../constants';
import { useStores } from "../context/use-stores";
import { isUserHoldType } from "./user";

export const GetDefaultApprovers = (request, onlyForView, setValue) => {
  const { userStore } = useStores();

  if (request?.commanders) return request?.commanders;
  if (onlyForView) return [];
  if (isUserHoldType(userStore.user, USER_TYPE.COMMANDER)) {
    setValue("approvers", [userStore.user]);
    return [userStore.user];
  }
  return [];
};
