export const STATUSES = {
  SUBMITTED: 'הוגש',
  APPROVED_BY_COMMANDER : 'בתהליך',
  APPROVED_BY_SECURITY: 'בתהליך',
  IN_PROGRESS: 'אושר',
  DECLINED: 'סורב',
  DONE: 'בוצע',
  FAILED: 'נכשל',
};

export const TYPES = {
  CREATE_OG: 'יצירת היררכיה חדשה',
  CREATE_ROLE: 'יצירת תפקיד חדש',
  ASSIGN_ROLE_TO_ENTITY: 'חיבור משתמש חדש לתפקיד',
  CREATE_ENTITY: 'יצירת משתמש מיוחד',
  RENAME_OG: 'עריכת שם היררכיה',
  RENAME_ROLE: 'עריכת שם תפקיד',
  EDIT_ENTITY: 'עריכת משתמש מיוחד',
  DELETE_OG: 'מחיקת היררכיה',
  DELETE_ROLE: 'מחיקת תפקיד',
  DELETE_ENTITY: 'מחיקת משתמש',
  DISCONNECT_ROLE: 'ניתוק תפקיד',
  ADD_APPROVER: 'יצירת גורם מאשר',
  CHANGE_ROLE_HIERARCHY: 'שינוי היררכיה לתפקיד',
  CREATE_ROLE_BULK: 'יצירת תפקידים חדשים',
  CHANGE_ROLE_HIERARCHY_BULK: 'שינוי היררכיה לתפקידים',
  UNRECOGNIZED: 'לא ידוע',
};
