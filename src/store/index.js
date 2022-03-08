import { createContext } from "react";
import configStore from './Config';
import RolesStore from "./Roles";
import EntitiesStore from "./Entities";
import GroupsStore from "./Groups";
import TreeStore from "./Tree";
import UserStore from "./User";
import AppliesApproveStore from "./AppliesApprove";
import AppliesMyStore from "./AppliesMy";
import AppliesStore from "./Applies";
import healthStore from './Health';
import NotificationsStore from './Notifications';
import SocketStore from './Socket';
const stores = {
  configStore,
  healthStore,
  rolesStore: new RolesStore(),
  entitiesStore: new EntitiesStore(),
  groupsStore: new GroupsStore(),
  userStore: new UserStore(),
  notificationStore: new NotificationsStore(),
  appliesStore: new AppliesStore(),
  appliesApproveStore: new AppliesApproveStore(),
  appliesMyStore: new AppliesMyStore(),
  treeStore: new TreeStore(),
};

const socketStore = new SocketStore({
  notificationStore: stores.notificationStore,
  appliesApproveStore: stores.appliesApproveStore,
  appliesStore: stores.appliesStore,
  appliesMyStore: stores.appliesMyStore,
  userStore: stores.userStore,
  configStore: configStore,
});
export const StoresContext = createContext({...stores, socketStore});

export const StoreProvider = ({ children }) => (
  <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
);
