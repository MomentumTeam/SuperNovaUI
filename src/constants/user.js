
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
  GoalUser: "GoalUser"
};

export const USER_TYPE = {
  SECURITY: "SECURITY",
  SUPER_SECURITY: "SUPER_SECURITY",
  COMMANDER: "COMMANDER",
  SOLDIER: "SOLDIER",
  UNRECOGNIZED: "UNRECOGNIZED",
  ADMIN: "ADMIN",
  BULK: "BULK",
};


export const APPROVER_TYPES = [
  { label: "גורם מאשר ראשוני", value: USER_TYPE.COMMANDER },
  { label: 'גורם מאשר יחב"ם', value: USER_TYPE.SECURITY },
  { label: 'גורם מאשר בטח"ם', value: USER_TYPE.SUPER_SECURITY },
  { label: "הרשאת בקשה מרובה", value: USER_TYPE.BULK },
  { label: "מחשוב יחידתי", value: USER_TYPE.ADMIN },
];