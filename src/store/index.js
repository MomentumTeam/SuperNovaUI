import { createContext } from 'react';
import CountryStore from './Country';
import ProductStore from './Product';
import AppliesStore from './Applies';
import TreeStore from './Tree';

const stores = {
    countryStore: new CountryStore(),
    productStore: new ProductStore(),
    appliesStore: new AppliesStore(),
    treeStore: new TreeStore(),
}

export const StoresContext = createContext(stores);

export const StoreProvider = ({ children }) => (
  <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
);
