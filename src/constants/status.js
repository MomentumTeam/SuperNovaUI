
export const STATUSES = {
    SUBMITTED: "הוגש",
    APPROVED_BY_COMMANDER: "בתהליך",
    APPROVED_BY_SECURITY: "בתהליך",
    IN_PROGRESS: "אושר",
    DECLINED: "סורב",
    DONE: "בוצע",
    FAILED: "נכשל",
};

export const STATUSES_CLASS = {
  [STATUSES.SUBMITTED]: "neutral",
  [STATUSES.APPROVED_BY_COMMANDER]: "neutral",
  [STATUSES.APPROVED_BY_SECURITY]: "neutral",
  [STATUSES.IN_PROGRESS]: "neutral",
  [STATUSES.DECLINED]: "bad",
  [STATUSES.DONE]: "good",
  [STATUSES.FAILED]: "bad",
};

export const AUTOCOMPLETE_STATUSES = {
  SUBMITTED: "הוגש לאישור ראשוני",
  APPROVED_BY_COMMANDER: 'בתהליך לאישור יחב"ם',
  APPROVED_BY_SECURITY: 'בתהליך לאישור בטח"ם',
  IN_PROGRESS: "אושר",
  DECLINED: "סורב",
  DONE: "בוצע",
  FAILED: "נכשל",
};