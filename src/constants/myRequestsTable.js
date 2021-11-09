export const TableTypes = {
  myRequests: [
    { field: "serialNumber", displayName: "מספר סידורי" },
    { field: "formattedType", displayName: "סוג בקשה" },
    { field: "handler", displayName: "גורם מטפל" },
    { field: "date", displayName: "תאריך בקשה" },
    { field: "reason", displayName: "סיבה" },
    { field: "PrettyStatus", displayName: "סטטוס" },
  ],
};

export const TableNames = {
  myRequests: { tab: "myRequests", tableName: "הבקשות שלי" },
};

export const tableActionsEnum = {
  VIEW_MY_REQUESTS: "VIEW_MY_REQUESTS",
};

export const TableActionsTypes = {
  myRequests: {
    view: tableActionsEnum.VIEW_MY_REQUESTS,
  },
};

export const TableSearch = (tableType) => {
  const searchFields = {
    myRequests: [
      {
        searchField: "serialNumber",
        searchDisplayName: "מספר סידורי",
        searchFuncName: "loadMyRequestsBySerialNumber",
      },
      {
        searchField: "formattedType",
        searchDisplayName: "סוג בקשה",
        searchFuncName: "loadMyRequestsByType",
      },
      {
        searchField: "status",
        searchDisplayName: "סטטוס",
        searchFuncName: "loadMyRequestsByStatus",
      },
      {
        searchField: "handler",
        searchDisplayName: "חיפוש חופשי",
        searchFuncName: "loadMyRequestsBySearch",
      },
    ],
  };
  return searchFields[tableType] ? searchFields[tableType] : [];
};
