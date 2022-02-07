import { useEffect } from "react";
import { useStores } from "../../context/use-stores";
import Actions from "./Actions";
import List from "../List";
import Notifications from "../Notifications/Notifications";
import "../../assets/css/local/components/aside.min.css";
import { StatCount } from "./StatCount";
import { Link } from "react-router-dom";
import HelpHamburgerMenu from "../HelpMenu/HelpHamburgerMenu";
import "../../assets/css/local/components/aside.min.css";

const SideToolbar = ({ recentApplies }) => {
  const { userStore, notificationStore } = useStores();

  useEffect(() => {
    notificationStore.fetchUserNotifications();
  }, [userStore]);

  return (
    <div className="main-inner-item main-inner-item3">
      <div className="main-inner-item3-content">
        <div className="display-flex display-flex-end btns-wrap">
          <HelpHamburgerMenu />
          <Notifications />
        </div>
        <StatCount />
        <div className="actions-inner-wrap">
          <h2>פעולות</h2>
          <Actions />
        </div>
        <div className="requests-inner-wrap">
          <div className="display-flex title-wrap">
            <h2>בקשות שלי</h2>
            <Link to="/myRequests" title="כל הבקשות">
              הכל
            </Link>
          </div>
          <div className="table-item-wrap">
            <div className="table-item-inner">
              <List list={recentApplies? recentApplies.slice(0, 5): []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideToolbar;
