import {
  USER_TYPE,
  STATUSES,
  TYPES,
  checkIfRequestIsDone,
  REQ_TYPES,
  REQ_STATUSES,
} from '../constants';
import datesUtil from '../utils/dates';
import { isUserApproverType, isUserHoldType } from './user';


export const organizeRows = (rows) => {
  rows.sort((a, b) => {
    //sort requests by row order.
    return a.rowNumber - b.rowNumber;
  });

  rows.forEach((row) => {
    //fix requests to start from row 1 and not from row 2.
    row.rowNumber--;
  });
  return rows;
};

export const getFormattedDate = (timestamp) => {
  const newDate = new Date(parseInt(timestamp));
  return datesUtil.formattedDate(newDate);
};

export const getResponsibleFactor = (apply, user) => {
  const fields = getResponsibleFactorFields(user);
  let responsibles = [];
  fields.map((field) => {
    responsibles = [...responsibles, ...apply[field]];
  });

  return responsibles;
};

export const getResponsibleFactors = (apply, user) => {
  let fields = [];
  const isReqDone = checkIfRequestIsDone(apply);
  const isSecurityNeeded = apply.needSecurityDecision;
  const isSuperSecurityNeeded = apply.needSuperSecurityDecision;
  const isAdminNeeded = apply.needAdminDecision;

  if (!isReqDone) {
    if (!IsRequestCompleteForApprover(apply, USER_TYPE.COMMANDER)) {
      fields = apply['commanders'];
      return fields;
    }

    if (
      isAdminNeeded && isUserHoldType(user, USER_TYPE.ADMIN) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.ADMIN)
    ) {
      if (apply['adminApprovers'].length > 0) {
        fields = apply['adminApprovers'];
      } else {
        fields = [
          ...fields,
          isUserHoldType(user, USER_TYPE.ADMIN)
            ? '---'
            : 'ממתין לאישור מחשוב יחידתי',
        ];
      }

      return fields;
    }

    if (
      isSecurityNeeded &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.SECURITY)
    ) {
      if (apply['securityApprovers'].length > 0) {
        fields = apply['securityApprovers'];
      } else {
        fields = [
          ...fields,
          isUserHoldType(user, USER_TYPE.SECURITY)
            ? '---'
            : 'ממתין לאישור ע"י יחב"ם',
        ];
      }

      return fields;
    }

    if (
      isSuperSecurityNeeded &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.SUPER_SECURITY)
    ) {
      if (apply['superSecurityApprovers'].length > 0) {
        fields = apply['superSecurityApprovers'];
      } else {
        fields = [
          ...fields,
          isUserHoldType(user, USER_TYPE.SUPER_SECURITY)
            ? '---'
            : 'ממתין לאישור ע"י בטח"ם',
        ];
      }

      return fields;
    }
  } else {
    fields = [...fields, ...apply['commanders']];
    fields = [...fields, ...apply['adminApprovers']];
    fields = [...fields, ...apply['securityApprovers']];
    fields = [...fields, ...apply['superSecurityApprovers']];
  }

  return fields;
};

export const getResponsibleFactorFields = (user) => {
  const fields = [];
  if (user === undefined || isUserHoldType(user, USER_TYPE.SUPER_SECURITY))
    fields.push('superSecurityApprovers');
  if (user === undefined || isUserHoldType(user, USER_TYPE.ADMIN))
    fields.push('adminApprovers');
  if (
    user === undefined ||
    isUserHoldType(user, USER_TYPE.SECURITY) ||
    isUserHoldType(user, USER_TYPE.SECURITY_ADMIN)
  )
    fields.push('securityApprovers');
  if (user === undefined || isUserApproverType(user)) fields.push('commanders');
  return fields;
};

export const getApproverComments = (apply, user) => {
  const comments = [];
  const applyComments = apply['approversComments'];

  if (isUserApproverType(user)) {
    if (apply.needAdminDecision && isUserHoldType(user, USER_TYPE.ADMIN)) {
      comments.push({
        comment: applyComments['adminComment'],
        label: 'הערות מחשוב יחידתי',
        userType: USER_TYPE.ADMIN,
      });
    } else {
      comments.push({
        comment: applyComments['commanderComment'],
        label: 'הערות גורם מאשר',
        userType: USER_TYPE.COMMANDER,
      });
    }
  }
  if (
    isUserHoldType(user, USER_TYPE.SECURITY) ||
    isUserHoldType(user, USER_TYPE.SECURITY_ADMIN)
  )
    comments.push({
      comment: applyComments['securityComment'],
      label: 'הערות יחב"ם',
      userType: USER_TYPE.SECURITY,
    });
  if (isUserHoldType(user, USER_TYPE.SUPER_SECURITY))
    comments.push({
      comment: applyComments['superSecurityComment'],
      label: 'הערות בטח"ם',
      userType: USER_TYPE.SUPER_SECURITY,
    });

  return comments;
};

export const isApproverAndCanEdit = (apply, user) => {
  return isApprover(apply, user) && canEditApply(apply, user);
};

export const isApprover = (apply, user) => {
  if (apply === undefined) return false;
  const approvers = getResponsibleFactor(apply, user);
  const isApprover = approvers.some((approver) => approver.id === user.id);
  return isApprover;
};

export const canEditApply = (apply, user) => {
  if (apply === undefined) return false;
  return (
    (isUserHoldType(user, USER_TYPE.SUPER_SECURITY) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.SUPER_SECURITY)) ||
    (isUserHoldType(user, USER_TYPE.SECURITY) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.SECURITY)) ||
    (apply.needAdminDecision && isUserHoldType(user, USER_TYPE.ADMIN) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.ADMIN)) ||
    (isUserApproverType(user) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.COMMANDER)) ||
    (isUserHoldType(user, USER_TYPE.SECURITY_ADMIN) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.SECURITY_ADMIN))
  );
};

export const canPassApply = (apply, user) => {
  if (apply === undefined) return false;
  return (
    (isUserHoldType(user, USER_TYPE.SUPER_SECURITY) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.SUPER_SECURITY)) ||
    (isUserHoldType(user, USER_TYPE.SECURITY) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.SECURITY)) ||
    (apply.needAdminDecision && isUserHoldType(user, USER_TYPE.ADMIN) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.ADMIN)) ||
    (isUserHoldType(user, USER_TYPE.COMMANDER) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.COMMANDER)) ||
    (isUserHoldType(user, USER_TYPE.SECURITY_ADMIN) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.SECURITY_ADMIN))
  );
};

export const getUserPassOptions = (apply, user) => {
  let passOptions = [];

  if (
    isUserHoldType(user, USER_TYPE.ADMIN) &&
    !IsRequestCompleteForApprover(apply, USER_TYPE.COMMANDER)
  )
    passOptions.push({ label: 'גורם מאשר ראשוני', value: USER_TYPE.COMMANDER });
  if (
    (isUserHoldType(user, USER_TYPE.SECURITY) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.SECURITY)) ||
    (isUserHoldType(user, USER_TYPE.SECURITY_ADMIN) &&
      !IsRequestCompleteForApprover(apply, USER_TYPE.SECURITY_ADMIN))
  )
    passOptions.push({ label: 'יחב"ם/קב"ם יחידתי', value: USER_TYPE.SECURITY });
  if (apply.needAdminDecision &&
    isUserHoldType(user, USER_TYPE.ADMIN) &&
    !IsRequestCompleteForApprover(apply, USER_TYPE.ADMIN)
  )
    passOptions.push({ label: 'מחשוב יחידתי', value: USER_TYPE.ADMIN });
    if (
    isUserHoldType(user, USER_TYPE.SUPER_SECURITY) &&
    !IsRequestCompleteForApprover(apply, USER_TYPE.SUPER_SECURITY)
  )
    passOptions.push({ label: 'בטח"ם', value: USER_TYPE.SUPER_SECURITY });

  return passOptions;
};

export const isStatusComplete = (status) => {
  switch (status) {
    case 'DECISION_UNKNOWN':
      return false;
    default:
      return true;
  }
};

export const IsRequestCompleteForApprover = (apply, approverType) => {
  const isReqDone = checkIfRequestIsDone(apply);
  if (isReqDone) return true;

  switch (approverType) {
    case USER_TYPE.SUPER_SECURITY:
      return (
        !apply?.needSuperSecurityDecision ||
        isStatusComplete(apply['superSecurityDecision']['decision'])
      );
    case USER_TYPE.SECURITY:
    case USER_TYPE.SECURITY_ADMIN:
      return (
        !apply?.needSecurityDecision ||
        isStatusComplete(apply['securityDecision']['decision']) ||
        apply['status'] === STATUSES.APPROVED_BY_SECURITY
      );
    case USER_TYPE.COMMANDER:
    case USER_TYPE.ADMIN:
      if (apply.needAdminDecision && approverType === USER_TYPE.ADMIN) {
        return (
           apply['status'] === STATUSES.APPROVED_BY_ADMIN ||
           isStatusComplete(apply['adminDecision']['decision'])
        );
      }
      return (
        apply['status'] === STATUSES.APPROVED_BY_COMMANDER ||
        isStatusComplete(apply['commanderDecision']['decision'])
      );
    default:
      return true;
  }
};


export const processApprovalTableData = (tableData) => {
  return tableData.map((action) => {
    let newAction = {};

    newAction['מספר בקשה'] = action.serialNumber;
    newAction['שם מבקש'] = action.submittedBy.displayName;
    newAction['מספר אישי/ת"ז'] = action.submittedBy?.personalNumber
      ? action.submittedBy.personalNumber
      : action.submittedBy.identityCard;
    newAction['סוג בקשה'] = TYPES[action.type];
    newAction['תאריך יצירה'] = getFormattedDate(action.createdAt);
    newAction['סיבה'] = action.comments;
    newAction['סטטוס בקשה'] = STATUSES[action.status];

    return newAction;
  });
};

/**
 * Check if d2 is greater than d1
 * @param {String|Object} d1 Datestring or Date object
 * @param {Number} days Optional number of days to add to d1
 */
export const isDateGreater = (d1, days) => {
  d1 = datesUtil.moment(d1);
  const d2 = datesUtil.moment(datesUtil.now());
  return d2.diff(d1, 'days') > (days || 0);
};

export const getDenyReason = (apply) => {
  const commanderReason = apply['commanderDecision']['reason'];
  const adminReason = apply['adminDecision']['reason'];
  const securityReason = apply['securityDecision']['reason'];
  const superSecurityReason = apply['superSecurityDecision']['reason'];

  if (commanderReason && commanderReason !== '') return commanderReason;

  if (adminReason && adminReason !== '') return adminReason;

  if (securityReason && securityReason !== '') return securityReason;

  if (superSecurityReason && superSecurityReason !== '')
    return superSecurityReason;
};

export const isSubmitterReq = (request, user) => {
  return (
    request?.submittedBy?.id === user.id &&
    request?.status !== REQ_STATUSES.IN_PROGRESS &&
    request?.status !== REQ_STATUSES.DECLINED &&
    request?.status !== REQ_STATUSES.DONE &&
    request?.status !== REQ_STATUSES.FAILED
  );
};

export const isAutomaticallyApproved = (request, user) => {
  return (
    request.commanders.some((commander) => commander.id === user.id) &&
    (request?.type === REQ_TYPES.CREATE_OG ||
      request?.type === REQ_TYPES.CREATE_ENTITY ||
      (request?.type === REQ_TYPES.ADD_APPROVER &&
        request?.submittedBy?.id === user.id))
  );
};

export const isCreateSoldierApply = (apply, kartoffelSoldierEnum) => {
  return (
    apply?.type === REQ_TYPES.CREATE_ENTITY &&
    apply?.kartoffelParams?.entityType === kartoffelSoldierEnum
  );
};
