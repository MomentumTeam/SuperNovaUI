import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import Table from '../../components/Table';
import Header from './Header';
import SearchEntity from './SearchEntity';
import AddEntity from './AddEntity';
import { useToast } from '../../context/use-toast';
import { useStores } from '../../context/use-stores';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { TableNames, TableTypes } from '../../constants/usersTable';

import '../../assets/css/local/pages/listUsersPage.min.css';
import { USER_TYPE } from '../../constants';
import configStore from '../../store/Config';

const Entities = observer(() => {
  const { actionPopup } = useToast();
  const { entitiesStore, rolesStore, groupsStore, userStore } = useStores();
  const { trackPageView } = useMatomo();

  const userTypes = userStore.user?.types
    ? userStore.user.types
    : USER_TYPE.SOLDIER;
  const tabs = Object.assign(
    {},
    ...Object.entries(TableNames)
      .filter(
        ([key, value]) =>
          !value?.roles || value.roles.some((role) => userTypes.includes(role))
      )
      .map(([k, v]) => ({ [k]: v }))
  );

  const [tabId, setTabId] = useState(Object.values(tabs)[0].tab);
  const [first, setFirst] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const sendTrack = (documentTitle) => {
    trackPageView({
      documentTitle,
    });
  };

  const getData = async ({ append = false, reset = false }) => {
    setIsSearch(false);
    setIsLoading(true);

    let data = [];
    if (reset) {
      setFirst(0);
      setPage(0);
    }

    if (userStore.user.directGroup) {
      try {
        switch (tabId) {
          case TableNames.entities.tab:
            await entitiesStore.loadEntitiesUnderOG(
              userStore.user.directGroup,
              reset ? 1 : page + 1,
              configStore.PAGE_SIZE,
              append
            );
            data = entitiesStore.entities;
            sendTrack('רשימת משתמשים');
            break;
          case TableNames.roles.tab:
            await rolesStore.loadRolesUnderOG(
              userStore.user.directGroup,
              reset ? 1 : page + 1,
              configStore.PAGE_SIZE,
              append
            );
            data = rolesStore.roles;
            sendTrack('רשימת תפקידים');
            break;
          case TableNames.hierarchy.tab:
            await groupsStore.loadOGChildren(
              userStore.user.directGroup,
              reset ? 1 : page + 1,
              configStore.PAGE_SIZE,
              append
            );
            data = groupsStore.groups;
            sendTrack('רשימת היררכיות');
            break;
          default:
            break;
        }

        setPage(reset ? 1 : page + 1);
      } catch (error) {
        console.log(error);
        actionPopup('הבאת מידע', error);
      }
    }

    setIsLoading(false);
    setTableData(data);
  };

  const onVirtualScroll = async (event) => {
    let getNextPage = true;
    if (tabId && userStore.user) {
      if (event && event.first !== undefined) {
        setFirst(event.first);
        if (
          first >= event.first ||
          tableData.length / (event.page + 1) > configStore.ITEMS_IN_PAGE
        )
          getNextPage = false;
      }

      if (getNextPage && !isSearch) await getData({ append: getNextPage });
    }
  };

  useEffect(() => {
    // Get table's data
    const firstData = async () => {
      await getData({ reset: true });
    };
    firstData();
  }, [tabId, userStore.user]);

  const setSearchData = (data) => {
    setIsSearch(true);
    setTableData(data);
    setFirst(0);
    setPage(0);
  };

  useEffect(() => {
    if (tabId === TableNames.entities.tab) setTableData(entitiesStore.entities);
    else if (tabId === TableNames.roles.tab) setTableData(rolesStore.roles);
    else if (tabId === TableNames.hierarchy.tab)
      setTableData(groupsStore.groups);

    setFirst(0);
    setPage(0);
  }, [tabId]);
  return (
    <>
      <div className="main-inner-item main-inner-item2 main-inner-item2-table">
        <div className="main-inner-item2-content">
          <Header setTab={setTabId} selectedTab={tabId} tabs={tabs} />
          <div className="content-unit-wrap">
            <div className="content-unit-inner">
              <div className="display-flex search-row-wrap-flex">
                <SearchEntity
                  tableType={tabId}
                  setTableData={setSearchData}
                  getData={getData}
                />

                <AddEntity tableType={tabId} />
              </div>
              <Table
                data={tableData}
                tableTypes={TableTypes[tabId]}
                tableType={tabId}
                isLoading={isLoading}
                isPaginator={true}
                isSelectedCol={true}
                onScroll={onVirtualScroll}
                first={first}
                scrollable={true}
                scrollHeight="300px"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Entities;
