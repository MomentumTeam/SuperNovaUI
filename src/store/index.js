import { createContext } from "react";
import configStore from './Config';
import ToastStore from "./Toast";
import RolesStore from "./Roles";
import EntitiesStore from "./Entities";
import GroupsStore from "./Groups";
import AppliesStore from "./Applies";
import TreeStore from "./Tree";
import UserStore from "./User";
import MyRequestsStore from "./MyRequests";

const stores = {
  configStore,
  rolesStore: new RolesStore(),
  entitiesStore: new EntitiesStore(),
  groupsStore: new GroupsStore(),
  userStore: new UserStore(),
  appliesStore: new AppliesStore(),
  treeStore: new TreeStore(),
  myRequestsStore: new MyRequestsStore(),
};

export const StoresContext = createContext(stores);

export const StoreProvider = ({ children }) => (
  <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
);
