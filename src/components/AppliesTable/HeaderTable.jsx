import React from "react";
import { USER_TYPE_TAG } from "../../constants";
import { TableNames } from "../../constants/applies";
import { isUserCanSeeAllApproveApplies } from '../../utils/user';

const HeaderTable = ({ user, myApplies, allApplies, selectedTab, setTab }) => {
  const HeaderTemplate = ({ tab, name, badgeValue }) => {
    return (
      <div className={`tabletab ${selectedTab !== tab ? "inactive" : ""}`} onClick={() => setTab(tab)}>
        <h2>{name}</h2>
        <h3 className="request-count-badge">{badgeValue}</h3>
      </div>
    );
  };

  return (
    <>
      {isUserCanSeeAllApproveApplies(user) ? (
        <div className="display-flex display-flex-start title-wrap">
          <HeaderTemplate
            tab={TableNames.allreqs.tab}
            name={TableNames.allreqs.tableName}
            badgeValue={allApplies.totalCount}
          />
          <HeaderTemplate
            tab={TableNames.myreqs.tab}
            name={TableNames.myreqs.tableName}
            badgeValue={myApplies.totalCount}
          />
        </div>
      ) : (
        <div className="display-flex title-wrap">
          <h2>{TableNames.myreqs.tableName}</h2>
          <h3>{myApplies.totalCount} סה"כ</h3>
        </div>
      )}
    </>
  );
};

export { HeaderTable };
