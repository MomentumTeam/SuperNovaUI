import { toJS } from "mobx";

import { useStores } from "../../context/use-stores";
import { isUserCanSeeAllApproveApplies, isUserCanSeeMyApproveApplies } from "../../utils/user";

const StatCount = () => {
  const { appliesApproveStore, userStore } = useStores();
  const user = toJS(userStore.user);

  return (
    <>
      {isUserCanSeeMyApproveApplies(user) && (
        <div className="display-flex comments">
          <dl>
            <dt> בקשות לאישורי</dt>
            <dd className="green">
              {appliesApproveStore.approveMyAppliesCount !== undefined
                ? appliesApproveStore.approveMyAppliesCount
                : "-"}
            </dd>
          </dl>

          {isUserCanSeeAllApproveApplies(user) && (
            <dl>
              <dt> סל הבקשות</dt>
              <dd>
                {appliesApproveStore.approveAllAppliesCount !== undefined
                  ? appliesApproveStore.approveAllAppliesCount
                  : "-"}
              </dd>
            </dl>
          )}
        </div>
      )}
    </>
  );
};

export { StatCount };
