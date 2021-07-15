import { createContext } from 'react';
import CountryStore from './Country';
import EntityStore from './Entity';
import AppliesStore from './Applies';
import TreeStore from './Tree';
import UserStore from './User';

const stores = {
    countryStore: new CountryStore(),
    entityStore: new EntityStore(),
    appliesStore: new AppliesStore(),
    treeStore: new TreeStore(),
    userStore: new UserStore(),
  }

export const StoresContext = createContext(stores);

export const StoreProvider = ({ children }) => (
  <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
);
