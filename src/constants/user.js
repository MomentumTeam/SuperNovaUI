export const USER_TYPE = {
  SECURITY: 'SECURITY',
  SUPER_SECURITY: 'SUPER_SECURITY',
  COMMANDER: 'COMMANDER',
  SOLDIER: 'SOLDIER',
  UNRECOGNIZED: 'UNRECOGNIZED',
  ADMIN: 'ADMIN',
  BULK: 'BULK',
};

export const USER_CITIZEN = process.env.USER_CITIZEN || 'אזרח';
export const USER_CLEARANCE = process.env.USER_CLEARANCE || ['1', '2', '3'];
export const USER_SOURCE_DI = process.env.USER_SOURCE_DI || 'sf_name';
export const USER_NO_PICTURE = process.env.USER_NO_PICTURE || 'pictureUrl';

export const USER_TYPE_TAG = {
  APPROVER: 'גורם מאשר',
  SECURITY_APPROVER: 'גורם מאשר במ',
  ADMIN: 'מחשוב יחידתי',
};
