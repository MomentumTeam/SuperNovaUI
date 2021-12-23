// export const apiBaseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:2000";
export const apiBaseUrl =
  window.location.hostname === 'localhost' ? 'http://localhost:2000' : '';

export const tokenName = process.env.UI_REACT_TOKEN_NAME || 'sp-token';
export const pageSize = process.env.UI_REACT_PAGE_SIZE || 10;
export const itemsInPage = process.env.UI_REACT_ITEMS_IN_PAGE || 6;
export const firstPage = process.env.UI_REACT_FIRST_PAGE || 0;
