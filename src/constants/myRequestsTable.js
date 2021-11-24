import { TYPES } from ".";
import { ResponsibleFactorFieldTemplate } from "../components/AppliesTable/ResponsibleFactorTemplate";
import { DateFieldTemplate } from "../components/Fields/DateFieldTemplate";
import { StatusFieldTemplate } from "../components/Fields/StatusFieldTemplate";
import { TextFieldTemplate } from "../components/Fields/TextFieldTemplate";
import { getFormattedDate, getResponsibleFactorFields } from "../utils/applies";
import { STATUSES } from "./status";

export const TableTypes = {
  myRequests: [
    { field: "serialNumber", displayName: "מספר סידורי" },
    { field: "type", displayName: "סוג בקשה", enum: TYPES },
    {
      field: getResponsibleFactorFields(), // todo: fix function
      displayName: "גורם מטפל",
      template: ResponsibleFactorFieldTemplate,
    },
    { field: "createdAt", displayName: "תאריך בקשה", formatter: getFormattedDate, template: DateFieldTemplate },
    { field: "comments", displayName: "סיבה", template: TextFieldTemplate },
    { field: "status", displayName: "סטטוס", enum: STATUSES, template: StatusFieldTemplate },
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
