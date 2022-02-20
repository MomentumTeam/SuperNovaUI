import Notifications from "../../components/Notifications/Notifications";
import { useEffect } from "react";
import { TableNames } from "../../constants/myRequestsTable";
import { useStores } from "../../context/use-stores";

import "../../assets/css/main.css";

const Header = ({ setTab, selectedTab }) => {
  const { userStore, notificationStore } = useStores();

  useEffect(() => {
    notificationStore.fetchUserUnreadNotifications();
  }, [userStore]);

  return (
    <div className="display-flex title-wrap">
      <div className="display-flex h-wrap" style={{ cursor: "pointer" }}>
        {Object.entries(TableNames).map(([tableKey, tableValue]) => {
          return (
            <h3 style={{ color: selectedTab === tableValue.tab && "#201961" }} onClick={() => setTab(tableValue.tab)}>
              {tableValue.tableName}
            </h3>
          );
        })}
      </div>
      <Notifications />
    </div>
  );
};

export default Header;
