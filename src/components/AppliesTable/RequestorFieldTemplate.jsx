import { getUserNameFromDisplayName } from '../../utils/user'

const RequestorFieldTemplate = (requestor) => {
    const username = getUserNameFromDisplayName(requestor.displayName);
    const id = requestor.personalNumber ?  requestor.personalNumber: requestor.identityCard;
    return (
      <div className="display-flex display-flex-center flex-wrap">
        <div>{username}</div>|<div>{id}</div>
      </div>
    );
}

export { RequestorFieldTemplate };