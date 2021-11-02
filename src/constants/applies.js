import { DateFieldTemplate } from '../components/AppliesTable/DateFieldTemplate';
import { RequestorFieldTemplate } from '../components/AppliesTable/RequestorFieldTemplate';
import { ResponsibleFactorFieldTemplate } from '../components/AppliesTable/ResponsibleFactorTemplate';
import { StatusFieldTemplate } from '../components/AppliesTable/StatusFieldTemplate';
import { TextFieldTemplate } from '../components/AppliesTable/TextFieldTemplate';
import { getFormattedDate, getResponsibleFactor } from "../utils/applies";
import { getUserNameFromDisplayName } from '../utils/user';

export const STATUSES = {
  SUBMITTED: "הוגש",
  APPROVED_BY_COMMANDER: "בתהליך",
  APPROVED_BY_SECURITY: "בתהליך",
  IN_PROGRESS: "אושר",
  DECLINED: "סורב",
  DONE: "בוצע",
  FAILED: "נכשל",
};

export const TYPES = {
  CREATE_OG: "יצירת היררכיה חדשה",
  CREATE_ROLE: "יצירת תפקיד חדש",
  ASSIGN_ROLE_TO_ENTITY: "חיבור משתמש חדש לתפקיד",
  CREATE_ENTITY: "יצירת משתמש מיוחד",
  RENAME_OG: "עריכת שם היררכיה",
  RENAME_ROLE: "עריכת שם תפקיד",
  EDIT_ENTITY: "עריכת משתמש מיוחד",
  DELETE_OG: "מחיקת היררכיה",
  DELETE_ROLE: "מחיקת תפקיד",
  DELETE_ENTITY: "מחיקת משתמש",
  DISCONNECT_ROLE: "ניתוק תפקיד",
  ADD_APPROVER: "יצירת גורם מאשר",
  CHANGE_ROLE_HIERARCHY: "שינוי היררכיה לתפקיד",
  CREATE_ROLE_BULK: "יצירת תפקידים חדשים",
  CHANGE_ROLE_HIERARCHY_BULK: "שינוי היררכיה לתפקידים",
  UNRECOGNIZED: "לא ידוע",
};

export const TableNames = {
  myreqs: { tab: "myreqs", tableName: "בקשות לאישורי" },
  allreqs: { tab: "allreqs", tableName: "סל הבקשות" },
};

export const TableTypes = (selectedTab, user) => {
  return [
    { field: "type", displayName: "סוג בקשה", enum: TYPES, sortable: true, default: "לא ידוע" },
    { field: "submittedBy", displayName: "שם מבקש", sortable: true, template: RequestorFieldTemplate },
    {
      field: getResponsibleFactor(user),
      displayName: "גורם מטפל",
      hide: selectedTab !== TableNames.allreqs.tab,
      sortable: true,
      template: ResponsibleFactorFieldTemplate,
    },
    {
      field: "createdAt",
      displayName: "ת׳ בקשה",
      formatter: getFormattedDate,
      sortable: true,
      template: DateFieldTemplate,
    },
    { field: "additionalParams.directGroup", displayName: "היררכיה", sortable: true, template: TextFieldTemplate },
    { field: "comments", displayName: "סיבה", sortable: true, template: TextFieldTemplate },
    { field: "status", displayName: "סטטוס", enum: STATUSES, sortable: true, template: StatusFieldTemplate },
  ];
};

export const pageSize = 100;
export const itemsPerRow = 50; // must be smaller than the page size


export const TableAppliesActionsEnum = {
  VIEW_APPLY: "VIEW_APPLY",
  VIEW_MY_APPLY: "VIEW_MY_APPLY",
  PASS_APPLY: "PASS_APPLY",
  TAKE_APPLY: "TAKE_APPLY",
};

export const TableAppliesActionsTypes = {
  myreqs: {
    view: TableAppliesActionsEnum.VIEW_MY_APPLY,
    pass: TableAppliesActionsEnum.PASS_APPLY,
  },
  allreqs: {
    view: TableAppliesActionsEnum.VIEW_APPLY,
    pass: TableAppliesActionsEnum.PASS_APPLY,
    take: TableAppliesActionsEnum.TAKE_APPLY,
  },
};
