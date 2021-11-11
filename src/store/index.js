import { createContext } from 'react';
import CountryStore from './Country';
import RolesStore from './Roles';
import EntitiesStore from './Entities';
import GroupsStore from "./Groups";
import AppliesStore from './Applies';
import AppliesApproveStore from './AppliesApprove';
import TreeStore from './Tree';
import UserStore from './User';

const stores = {
  rolesStore: new RolesStore(),
  entitiesStore: new EntitiesStore(),
  groupsStore: new GroupsStore(),
  countryStore: new CountryStore(),
  userStore: new UserStore(),
  appliesStore: new AppliesStore(),
  appliesApproveStore: new AppliesApproveStore(),
  treeStore: new TreeStore(),
};

export const StoresContext = createContext(stores);

export const StoreProvider = ({ children }) => (
  <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
);
