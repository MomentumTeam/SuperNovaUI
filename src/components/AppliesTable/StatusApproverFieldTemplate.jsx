import { USER_TYPE } from '../../constants';
import { STATUSES_CLASS, STATUSES } from "../../constants/status";
import { IsRequestCompleteForApprover } from "../../utils/applies";

const StatusApproverFieldTemplate = (apply, user) => {
  let isReqDoneForApprover = true;
  let status = STATUSES[apply.status];

  user.types.map((approverType) => {
    if ([USER_TYPE.ADMIN, USER_TYPE.COMMANDER, USER_TYPE.SUPER_SECURITY, USER_TYPE.SECURITY].indexOf(approverType) >= 0) {
      if (!IsRequestCompleteForApprover(apply, approverType)) isReqDoneForApprover = false;
    }
  });

  if ([STATUSES.SUBMITTED, STATUSES.APPROVED_BY_COMMANDER, STATUSES.APPROVED_BY_SECURITY].indexOf(status) >= 0) {
      if (isReqDoneForApprover) status = STATUSES.IN_PROGRESS;
  }

  return (
    <>
      <button className={"btn-status " + STATUSES_CLASS[status]} type="button" title={status}>
        {status}
      </button>
    </>
  );
};

export { StatusApproverFieldTemplate };
