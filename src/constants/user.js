export const USER_TYPE = {
  SECURITY: 'SECURITY',
  SUPER_SECURITY: 'SUPER_SECURITY',
  COMMANDER: 'COMMANDER',
  SOLDIER: 'SOLDIER',
  UNRECOGNIZED: 'UNRECOGNIZED',
  ADMIN: 'ADMIN',
  BULK: 'BULK',
};

export const USER_CITIZEN_ENTITY_TYPE = process.env.UI_USER_CITIZEN_ENTITY_TYPE || "digimon";
export const USER_CLEARANCE = process.env.UI_USER_CLEARANCE
  ? process.env.UI_USER_CLEARANCE.split(",")
  : ["1", "2", "3", "4", "5", "6"];
export const USER_SOURCE_DI = process.env.UI_USER_SOURCE_DI || 'sf_name';
export const USER_NO_PICTURE = process.env.UI_USER_NO_PICTURE_STRING || 'pictureUrl';
export const highCommanderRanks = process.env.UI_HIGH_COMMANDER_RANKS
  ? process.env.UI_HIGH_COMMANDER_RANKS.split(",")
  : ["rookie", "champion"];

export const USER_TYPE_TAG = {
  APPROVER: 'גורם מאשר',
  SECURITY_APPROVER: 'גורם מאשר במ',
  ADMIN: 'מחשוב יחידתי',
};

export const USER_SEX = [
  { label: "---", value: "" },
  { label: "זכר", value: "1" },
  { label: "נקבה", value: "2" },
];
