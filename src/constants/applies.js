import { DateFieldTemplate } from "../components/AppliesTable/DateFieldTemplate";
import { RequestorFieldTemplate } from "../components/AppliesTable/RequestorFieldTemplate";
import { ResponsibleFactorFieldTemplate } from "../components/AppliesTable/ResponsibleFactorTemplate";
import { StatusFieldTemplate } from "../components/AppliesTable/StatusFieldTemplate";
import { TextFieldTemplate } from "../components/AppliesTable/TextFieldTemplate";
import { getFormattedDate, getResponsibleFactorFields } from "../utils/applies";

export const STATUSES = {
  SUBMITTED: 'הוגש',
  APPROVED_BY_COMMANDER: 'בתהליך',
  APPROVED_BY_SECURITY: 'בתהליך',
  IN_PROGRESS: 'אושר',
  DECLINED: 'סורב',
  DONE: 'בוצע',
  FAILED: 'נכשל',
};

export const AUTOCOMPLETE_STATUSES = {
  SUBMITTED: "הוגש לאישור ראשוני",
  APPROVED_BY_COMMANDER: 'בתהליך לאישור יחב"ם',
  APPROVED_BY_SECURITY: 'בתהליך לאישור בטח"ם',
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
  // DELETE_OG: "מחיקת היררכיה",
  // DELETE_ROLE: "מחיקת תפקיד",
  // DELETE_ENTITY: "מחיקת משתמש",
  // DISCONNECT_ROLE: "ניתוק תפקיד",
  ADD_APPROVER: "יצירת גורם מאשר",
  CHANGE_ROLE_HIERARCHY: "שינוי היררכיה לתפקיד",
  CREATE_ROLE_BULK: "יצירת תפקידים חדשים",
  CHANGE_ROLE_HIERARCHY_BULK: "שינוי היררכיה לתפקידים",
};

export const TableNames = {
  myreqs: { tab: "myreqs", tableName: "בקשות לאישורי" },
  allreqs: { tab: "allreqs", tableName: "סל הבקשות" },
};

export const TableTypes = (selectedTab, user) => {
  return [
    { field: "serialNumber", displayName: "מספר בקשה" },
    {
      field: "type",
      displayName: "סוג בקשה",
      enum: TYPES,
      default: "לא ידוע",
      sortable: true,
      sortFields: sortFields.REQUEST_TYPE,
    },
    {
      field: "submittedBy",
      displayName: "שם מבקש",
      sortable: true,
      sortFields: sortFields.SUBMITTED_BY,
      template: RequestorFieldTemplate,
    },
    {
      field: getResponsibleFactorFields(user),
      displayName: "גורם מטפל",
      hide: selectedTab !== TableNames.allreqs.tab,
      template: ResponsibleFactorFieldTemplate,
    },
    {
      field: "createdAt",
      displayName: "ת׳ בקשה",
      formatter: getFormattedDate,
      sortable: true,
      sortFields: sortFields.CREATED_AT,
      template: DateFieldTemplate,
    },
    {
      field: "additionalParams.directGroup",
      displayName: "היררכיה",
      template: TextFieldTemplate,
    },
    { field: "comments", displayName: "סיבה", template: TextFieldTemplate },
    {
      field: "status",
      displayName: "סטטוס",
      enum: STATUSES,
      sortable: true,
      sortFields: sortFields.STATUS,
      template: StatusFieldTemplate,
    },
  ];
};

export const searchFields = ["שם", "מספר אישי", 'ת"ז', "מספר בקשה"];
export const searchTooltipMessage = `ניתן לחפש לפי השדות הבאים: ${searchFields.join(
  ", "
)}`;

export const sortFields = {
  REQUEST_TYPE: "REQUEST_TYPE",
  SUBMITTED_BY: "SUBMITTED_BY",
  CREATED_AT: "CREATED_AT",
  STATUS: "STATUS",
};
export const sortOrder = {
  INC: "INC",
  DEC: "DEC",
};

export const pageSize = 10;
export const itemsPerRow = 5; // must be smaller than the page size

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

export const ROLE_CLEARANCE = [
  'בלמ"ס',
  'בלמ"ס',
  'שמור',
  'סודי',
  'סודי ביותר',
  'לבן',
  'אדום',
  'סגול',
  'סגול טאבו',
  'סגול מצומצם',
  'סמ"צ',
  'כחול',
];

export const BulkTypes = [
  'CREATE_ROLE_REQUEST',
  'CHANGE_ROLE_HIERARCHY_REQUEST',
  'UNRECOGNIZED',
]
  ;
export const bulkExampleFileName = [
  'createRoleBulkExample',
  'renameOGBulkExample',
];
