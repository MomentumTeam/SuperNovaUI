import { useEffect } from "react";
import { toJS } from "mobx";

import { useStores } from "../../context/use-stores";
import Norifications from "../../components/Notifications/Notifications";

import "../../assets/css/main.css";

const Header = ({ setTab, selectedTab, tabs }) => {
  const { userStore } = useStores();
  const notifications = toJS(userStore.userUnreadNotifications);

  useEffect(() => {
    userStore.fetchUserNotifications();
  }, [userStore]);

  return (
    <div className="display-flex title-wrap">
      <div className="display-flex h-wrap" style={{ cursor: "pointer" }}>
        {Object.entries(tabs).map(([_, tableValue]) => {
          return (
            <h3 style={{ color: selectedTab === tableValue.tab && "#201961" }} onClick={() => setTab(tableValue.tab)}>
              {tableValue.tableName}
            </h3>
          );
        })}
      </div>
      <Norifications notifications={notifications} />
    </div>
  );
};

export default Header;
