import { isDateGreater, IsRequestCompleteForApprover } from '../../utils/applies';

const DateFieldTemplate = (date, props) => {
  const apply = {
    adminDecision: props.adminDecision,
    commanderDecision: props.commanderDecision,
    superSecurityDecision: props.superSecurityDecision,
    securityDecision: props.securityDecision,
    status: props.status,
    needAdminDecision: props.needAdminDecision,
    needSecurityDecision: props.needSecurityDecision,
    needSuperSecurityDecision: props.needSuperSecurityDecision,

  };

  let isReqDone = true;
  props.user.types.map((approverType) =>{
    if (!IsRequestCompleteForApprover(apply, approverType)) isReqDone = false;
  });
  const isWarn = isDateGreater(date, 3) && !isReqDone;
  return <div style={{ color: isWarn ? "red" : "black" }}>{date}</div>;
};

export { DateFieldTemplate };
