
// CONST
export const USER_TYPE_TAG = {
  APPROVER: "גורם מאשר",
  SECURITY_APPROVER: "גורם מאשר במ",
  ADMIN: "מחשוב יחידתי",
  SUPER_SECURITY_APPROVER:'גורם מאשר בטח"ם',
  BULK:"הגשת בקשה מרובה"
};

export const USER_SEX = [
  { label: "---", value: "" },
  { label: "זכר", value: "זכר" },
  { label: "נקבה", value: "נקבה" },
];

export const USER_ENTITY_TYPE = {
  Soldier: "חייל",
  Civilian: "אזרח",
  GoalUser: "תפקידן"
};

export const USER_TYPE = {
  SECURITY: 'SECURITY',
  SUPER_SECURITY: 'SUPER_SECURITY',
  COMMANDER: 'COMMANDER',
  SOLDIER: 'SOLDIER',
  UNRECOGNIZED: 'UNRECOGNIZED',
  ADMIN: 'ADMIN',
  BULK: 'BULK',
  SPECIAL_GROUP: 'SPECIAL_GROUP',
};

export const APPROVER_TRANSFER_TYPE = [USER_TYPE.ADMIN, USER_TYPE.COMMANDER, USER_TYPE.SUPER_SECURITY, USER_TYPE.SECURITY];


export const APPROVER_TYPES = [
  {
    label: 'גורם מאשר ראשוני - גורם מאשר המוסמך לאשר בקשות באופן ראשוני',
    value: USER_TYPE.COMMANDER,
  },
  {
    label: 'גורם מאשר יחב"ם - גורם ביטחון מידע המוסמך לאשר בקשות',
    value: USER_TYPE.SECURITY,
  },
  {
    label: 'גורם מאשר בטח"ם - גורם ביטחון מידע המוסמך לאשר בקשות',
    value: USER_TYPE.SUPER_SECURITY,
  },
  {
    label: 'הרשאת בקשה מרובה - גורם המוסמך להגיש בקשות מרובות',
    value: USER_TYPE.BULK,
  },
  {
    label: 'מחשוב יחידתי - גורם מחשוב ביחידה המוסמך לאשר בקשות',
    value: USER_TYPE.ADMIN,
  },
  {
    label: 'הוספת שלב חובה מחשוב יחידתי לסבב אישורי בקשות',
    value: USER_TYPE.SPECIAL_GROUP,
  },
];