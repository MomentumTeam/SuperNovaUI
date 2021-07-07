import { createContext } from 'react';
import CountryStore from './Country';
import UserStore from './User';

const stores = {
    countryStore: new CountryStore(),
    userStore: new UserStore(),
}

export const StoresContext = createContext(stores);

export const StoreProvider = ({ children }) => (
    <StoresContext.Provider value={stores}>
        {children}
    </StoresContext.Provider>
);