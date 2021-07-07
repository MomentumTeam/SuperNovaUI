import { createContext } from 'react';
import CountryStore from './Country';
import UserStore from './User';
import AppliesStore from './Applies';
import TreeStore from './Tree';

const stores = {
    countryStore: new CountryStore(),
    userStore: new UserStore(),
    appliesStore: new AppliesStore(),
    treeStore: new TreeStore(),
}

export const StoresContext = createContext(stores);

export const StoreProvider = ({ children }) => (
  <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
);
