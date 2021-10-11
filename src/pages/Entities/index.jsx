import { useEffect, useState } from "react";
import { observer } from "mobx-react";

import "../../assets/css/local/pages/listUsersPage.min.css";

import Table from "../../components/Table";
import Header from "./Header";
import SearchEntity from "./SearchEntity";
import AddEntity from "./AddEntity";
import Footer from "./Footer";
import { firstPage, itemsInPage, pageSize } from "../../constants/api";
import { useStores } from "../../context/use-stores";

const Entities = observer(() => {
  const { tablesStore, userStore } = useStores();

  const [tabId, setTabId] = useState("entities");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [first, setFirst] = useState(0);

  const setData = async (event) => {
    let append;
    let getNewData = true;
    let getPage = event.restore ? firstPage : page;

    if (tabId && userStore.user) {
      const userOGId = userStore.user.directGroup;

      if (event.first !== undefined) {
        append = true;
        if (first >= event.first || tableData.length / (event.page + 1) > itemsInPage) getNewData = false;
        setFirst(event.first);
      }

      if (getNewData) {
        setIsLoading(true);

        try {
          switch (tabId) {
            case "entities":
              await tablesStore.loadEntitiesUnderOG(userOGId, getPage, pageSize, append);
              setTableData(tablesStore.entities);
              break;
            case "roles":
              await tablesStore.loadRolesUnderOG(userOGId, getPage, pageSize, append);
              setTableData(tablesStore.roles);
              break;
            case "hierarchy":
              await tablesStore.loadOGChildren(userOGId, getPage, pageSize, append);
              setTableData(tablesStore.groups);
              break;
            default:
              break;
          }

          setPage(getPage + 1);
        } catch (error) {
          // TODO: popup error
          console.log(error);
        }

        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    userStore.fetchUserNotifications(userStore.user?.id);
  }, [userStore]);

  useEffect(() => {
    const firstData = async () => {
      // Get table's data
      setFirst(0);
      await setData({ restore: true });
    };

    firstData();
  }, [tabId, userStore, tablesStore]);

  return (
    <>
      <div className="main-inner-item main-inner-item2 main-inner-item2-table">
        <div className="main-inner-item2-content">
          <Header setTab={setTabId} selectedTab={tabId} />
          <div className="content-unit-wrap">
            <div className="content-unit-inner">
              <div className="display-flex search-row-wrap-flex">
                <SearchEntity setTableData={setTableData} tableType={tabId} />
                <AddEntity />
              </div>
              <Table data={tableData} tableType={tabId} isLoading={isLoading} onScroll={setData} first={first} />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Entities;
