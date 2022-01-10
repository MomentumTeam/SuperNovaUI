import env from "react-dotenv";

// ENV
export const USER_CITIZEN_ENTITY_TYPE = env.UI_USER_CITIZEN_ENTITY_TYPE || "agumon";
export const USER_CLEARANCE = env.UI_USER_CLEARANCE? env.UI_USER_CLEARANCE.split(","): ["1", "2", "3", "4", "5", "6"];
export const USER_SOURCE_DI = env.UI_USER_SOURCE_DI || "sf_name";
export const USER_NO_PICTURE = env.UI_USER_NO_PICTURE_STRING || "pictureUrl";
export const highCommanderRanks = env.UI_HIGH_COMMANDER_RANKS? env.UI_HIGH_COMMANDER_RANKS.split(","): ["rookie", "champion"];
export const USER_DI_TYPE = env.UI_DI_TYPE || "domainUser";
export const USER_ROLE_ENTITY_TYPE = env.UI_ROLE_ENTITY_TYPE || "goalUser";

// CONST
export const USER_TYPE_TAG = {
  APPROVER: "גורם מאשר",
  SECURITY_APPROVER: "גורם מאשר במ",
  ADMIN: "מחשוב יחידתי",
};

export const USER_SEX = [
  { label: "---", value: "" },
  { label: "זכר", value: "זכר" },
  { label: "נקבה", value: "נקבה" },
];

export const USER_ENTITY_TYPE = {
  Soldier: "חייל",
  Civilian: "אזרח",
  GoalUser: "GoalUser",
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