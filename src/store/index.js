import { createContext } from 'react';
import CountryStore from './Country';
import ProductStore from './Product';

const stores = {
    countryStore: new CountryStore(),
    productStore: new ProductStore(),
}

export const StoresContext = createContext(stores);

export const StoreProvider = ({ children }) => (
    <StoresContext.Provider value={stores}>
        {children}
    </StoresContext.Provider>
);