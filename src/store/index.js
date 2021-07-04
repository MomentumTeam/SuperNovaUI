/** @format */

import { createContext } from 'react';
import CountryStore from './Country';
import ProductStore from './Product';
import TreeStore from './Tree';

const stores = {
  countryStore: new CountryStore(),
  productStore: new ProductStore(),
  treeStore: new TreeStore(),
};

export const StoresContext = createContext(stores);

export const StoreProvider = ({ children }) => (
  <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
);
