export const STATUSES = {
  SUBMITTED: 'ממתין לאישור',
  APPROVED_BY_COMMANDER: 'ממתין לאישור',
  APPROVED_BY_SECURITY: 'ממתין לאישור',
  APPROVED_BY_ADMIN: 'ממתין לאישור',
  IN_PROGRESS: 'אושר',
  DECLINED: 'סורב',
  DONE: 'בוצע',
  FAILED: 'נכשל',
};

export const STATUSES_CLASS = {
  [STATUSES.SUBMITTED]: 'start',
  [STATUSES.APPROVED_BY_COMMANDER]: 'neutral',
  [STATUSES.APPROVED_BY_SECURITY]: 'neutral',
  [STATUSES.APPROVED_BY_ADMIN]: 'neutral',
  [STATUSES.IN_PROGRESS]: 'neutralplus',
  [STATUSES.DECLINED]: 'bad',
  [STATUSES.DONE]: 'good',
  [STATUSES.FAILED]: 'bad',
};

export const AUTOCOMPLETE_STATUSES = {
  SUBMITTED: 'הוגש לאישור ראשוני',
  APPROVED_BY_COMMANDER: 'בתהליך לאישור יחב"ם',
  APPROVED_BY_SECURITY: 'בתהליך לאישור בטח"ם',
  APPROVED_BY_ADMIN: "בתהליך לאישור מחשוב יחידתי",
  IN_PROGRESS: 'אושר',
  DECLINED: 'סורב',
  DONE: 'בוצע',
  FAILED: 'נכשל',
};

export const AUTOCOMPLETE_STATUSES_APPROVER = {
  SUBMITTED: "הוגש לאישור ראשוני",
  APPROVED_BY_COMMANDER: 'בתהליך לאישור יחב"ם',
  APPROVED_BY_SECURITY: 'בתהליך לאישור בטח"ם',
  APPROVED_BY_ADMIN: "בתהליך לאישור מחשוב יחידתי",
  IN_PROGRESS: "אושר עבור כל הגורמים",
  DECLINED: "סורב",
  DONE: "בוצע",
  FAILED: "נכשל",
};

export const REQ_STATUSES = {
  IN_PROGRESS: 'IN_PROGRESS',
  DECLINED: 'DECLINED',
  DONE: 'DONE',
  FAILED: 'FAILED',
};

export const checkIfRequestIsDone = (req) => {
  return (
    req?.status === REQ_STATUSES.DECLINED ||
    req?.status === REQ_STATUSES.DONE ||
    req?.status === REQ_STATUSES.FAILED ||
    req?.status === REQ_STATUSES.IN_PROGRESS
  );
};
