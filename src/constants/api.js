import env from 'react-dotenv';

export const apiBaseUrl = env.hostname === "localhost" ? "http://localhost:2000" : "";
export const tokenName = env.REACT_APP_TOKEN_NAME || 'sp-token';
export const pageSize = env.REACT_APP_PAGE_SIZE || 10;
export const itemsInPage = env.UI_REACT_ITEMS_IN_PAGE || 6;
export const firstPage = env.UI_REACT_FIRST_PAGE || 0;
console.log("check-env-api", process.env.REACT_APP_TOKEN_NAME);
