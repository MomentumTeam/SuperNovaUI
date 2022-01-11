export const STATUSES = {
  SUBMITTED: 'ממתין לאישור',
  APPROVED_BY_COMMANDER: 'ממתין לאישור',
  APPROVED_BY_SECURITY: 'ממתין לאישור',
  IN_PROGRESS: 'אושר',
  DECLINED: 'סורב',
  DONE: 'בוצע',
  FAILED: 'נכשל',
};

export const STATUSES_CLASS = {
  [STATUSES.SUBMITTED]: 'start',
  [STATUSES.APPROVED_BY_COMMANDER]: 'neutral',
  [STATUSES.APPROVED_BY_SECURITY]: 'neutral',
  [STATUSES.IN_PROGRESS]: 'neutralplus',
  [STATUSES.DECLINED]: 'bad',
  [STATUSES.DONE]: 'good',
  [STATUSES.FAILED]: 'bad',
};

export const AUTOCOMPLETE_STATUSES = {
  SUBMITTED: 'הוגש לאישור ראשוני',
  APPROVED_BY_COMMANDER: 'בתהליך לאישור יחב"ם',
  APPROVED_BY_SECURITY: 'בתהליך לאישור בטח"ם',
  IN_PROGRESS: 'אושר',
  DECLINED: 'סורב',
  DONE: 'בוצע',
  FAILED: 'נכשל',
};

export const checkIfRequestIsDone = (req) => {
  return (
    req.status === 'DECLINED' ||
    req.status === 'DONE' ||
    req.status === 'FAILED' ||
    req.status === 'IN_PROGRESS'
  );
};

export const REQ_STATUSES = {
  IN_PROGRESS: 'IN_PROGRESS',
  DECLINED: 'DECLINED',
  DONE: 'DONE',
  FAILED: 'FAILED',
};


export const getStatus = (approverTableType) => {
  // switch (approverTableType) {
  //   case 'secuirty':
  //     return SECURITY_APPROVE_TABLE_STATUSES;
  //   case 'commander':
  //     return COMMANDER_APPROVE_TABLE_STATUSES;
  //   case 'soldier':
      return STATUSES;
  // }
};