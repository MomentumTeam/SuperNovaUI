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
  CREATE_OG: 'יצירת היררכיה',
  CREATE_ROLE: 'יצירת תפקיד',
  ASSIGN_ROLE_TO_ENTITY: 'יצירת משתמש',
  CREATE_ENTITY: 'יצירת ישות',
  RENAME_OG: 'שינוי היררכיה',
  RENAME_ROLE: 'שינוי שם של תפקיד',
  EDIT_ENTITY: 'עריכת ישות',
  DELETE_OG: 'מחיקת היררכיה',
  DELETE_ROLE: 'מחיקת תפקיד',
  DELETE_ENTITY: 'מחיקת משתמש',
  DISCONNECT_ROLE: 'ניתוק תפקיד',
  ADD_APPROVER: 'יצירת גורם מאשר',
  CHANGE_ROLE_HIERARCHY: 'שינוי היררכיית תפקיד',
  CREATE_ROLE_BULK: 'באלק ליצירת תפקיד',
  CHANGE_ROLE_HIERARCHY_BULK: 'באלק לשינוי היררכיית תפקיד',
  UNRECOGNIZED: 'לא ידוע',
};
