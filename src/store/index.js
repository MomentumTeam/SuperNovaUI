import { createContext } from 'react';
import CountryStore from './Country';
import EntityStore from './Entity';
import AppliesStore from './Applies';
import TreeStore from './Tree';
import UserStore from './User';

const stores = {
  entityStore: new EntityStore(),
  countryStore: new CountryStore(),
  userStore: new UserStore(),
  appliesStore: new AppliesStore(),
  treeStore: new TreeStore(),
};

export const StoresContext = createContext(stores);

export const StoreProvider = ({ children }) => (
  <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
);
