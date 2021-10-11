export const USER_TYPE = {
  SECURITY: "SECURITY",
  SUPER_SECURITY: "SUPER_SECURITY",
  COMMANDER: "COMMANDER",
  SOLDIER: "SOLDIER",
  ADMIN: "ADMIN",
  UNRECOGNIZED: "UNRECOGNIZED",
};

export const USER_RANK_CITIZEN = process.env.USER_RANK_CITIZEN || "אזרח";
export const USER_CLEARANCE = process.env.USER_CLEARANCE || [1, 2, 3];
export const USER_SOURCE_DI = process.env.USER_SOURCE_DI || "oneTree";
export const USER_NO_PICTURE = process.env.USER_NO_PICTURE || "pictureUrl";