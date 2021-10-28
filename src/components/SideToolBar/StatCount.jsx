import { toJS } from "mobx";

import { useStores } from "../../context/use-stores";
import { isUserCanSeeAllApproveApplies, isUserCanSeeMyApproveApplies } from "../../utils/user";

const StatCount = () => {
  const { appliesStore, userStore } = useStores();
  const user = toJS(userStore.user);

  return (
    <>
    {isUserCanSeeMyApproveApplies(user) && (
    <div className="display-flex comments">
        <dl>
          <dt> בקשות לאישורי</dt>
          <dd className="green">{appliesStore.approveMyApplies.totalCount || "-"}</dd>
        </dl>
     
      {isUserCanSeeAllApproveApplies(user) && (
        <dl>
          <dt> סל הבקשות</dt>
          <dd>{appliesStore.approveAllApplies?.totalCount || "-"}</dd>
        </dl>
      )}
    </div>
     )}
     </>
  );
};

export { StatCount };
