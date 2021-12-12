import { isDateGreater, IsRequestCompleteForApprover } from '../../utils/applies';

const DateFieldTemplate = (date, props) => {
  const apply = {
    commanderDecision: props.commanderDecision,
    superSecurityDecision: props.superSecurityDecision,
    securityDecision: props.securityDecision,
  };

  let isReqDone = true;
  props.user.types.map((approverType) =>{
    if (!IsRequestCompleteForApprover(apply, approverType)) isReqDone = false;
  });
  const isWarn = isDateGreater(date, 3) && !isReqDone;
  return <div style={{ color: isWarn ? "red" : "black" }}>{date}</div>;
};

export { DateFieldTemplate };
