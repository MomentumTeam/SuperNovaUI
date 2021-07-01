import { createContext } from 'react';
import CountryStore from './Country';
import ProductStore from './Product';
import UserStore from './User';

const stores = {
    countryStore: new CountryStore(),
    productStore: new ProductStore(),
    userStore: new UserStore()
}

export const StoresContext = createContext(stores);

export const StoreProvider = ({ children }) => (
    <StoresContext.Provider value={stores}>
        {children}
    </StoresContext.Provider>
);