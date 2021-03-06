import React from 'react';
import { TableNames } from '../../constants/applies';
import { useStores } from '../../context/use-stores';
import { isUserCanSeeAllApproveApplies } from '../../utils/user';
import { SearchAppliesField } from './SearchAppliesField';
import { FilterAppliesField } from './FilterAppliesField';
import { AUTOCOMPLETE_STATUSES_APPROVER, TYPES } from "../../constants";

const HeaderTable = ({
  user,
  selectedTab,
  setTab,
  setSearchFields,
  getData,
}) => {
  const { appliesStore } = useStores();

  const HeaderTemplate = ({ tab, name, badgeValue }) => {
    return (
      <div
        className={`title-wrap tabletab ${
          selectedTab !== tab ? 'inactive' : ''
        }`}
        onClick={() => setTab(tab)}
      >
        <h2>{name}</h2>
        <h3 className="request-count-badge">{badgeValue}</h3>
      </div>
    );
  };

  return (
    <div className="display-flex display-flex-start table-title-wrap flex-wrap">
      {isUserCanSeeAllApproveApplies(user) ? (
        <div className="display-flex inner-flex">
          <HeaderTemplate
            tab={TableNames.allreqs.tab}
            name={TableNames.allreqs.tableName}
            badgeValue={appliesStore.approveAllApplies.waitingForApproveCount}
          />
          <HeaderTemplate
            tab={TableNames.myreqs.tab}
            name={TableNames.myreqs.tableName}
            badgeValue={appliesStore.approveMyApplies.waitingForApproveCount}
          />
        </div>
      ) : (
        <div>
          <h2 style={{ display: "inline" }}>{TableNames.myreqs.tableName}</h2>
          <h3 style={{ display: "inline", marginRight: "10px" }}>
            <b style={{ color: "black" }}>{appliesStore.approveMyApplies.waitingForApproveCount}</b>/
            {appliesStore.approveMyApplies.totalCount} סה"כ
          </h3>
        </div>
      )}

      <div className="display-flex inner-flex">
        <SearchAppliesField selectedTab={selectedTab} setSearchFields={setSearchFields} getData={getData} />


        <FilterAppliesField
          selectedTab={selectedTab}
          setSearchFields={setSearchFields}
          getData={getData}
          searchField="type"
          searchFieldDisplayName="סוג בקשה"
          searchOptions={TYPES}
        />
  
        <FilterAppliesField
          selectedTab={selectedTab}
          setSearchFields={setSearchFields}
          getData={getData}
          searchField="status"
          searchFieldDisplayName="סטטוס בקשה"
          searchOptions={AUTOCOMPLETE_STATUSES_APPROVER}
        />
      </div>
    </div>
  );
};

export { HeaderTable };
