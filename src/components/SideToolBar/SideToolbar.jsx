import { useEffect } from "react";
import { toJS } from "mobx";
import { useStores } from "../../context/use-stores";
import Actions from "./Actions";
import List from "../List";
import Notifications from "../Notifications/Notifications";
import HelpHamburgerMenu from "../HelpMenu/HelpHamburgerMenu";
import "../../assets/css/local/components/aside.min.css";
import { StatCount } from "./StatCount";

const SideToolbar = ({ recentApplies }) => {
  const { userStore } = useStores();
  const notifications = toJS(userStore.userUnreadNotifications);

  useEffect(() => {
    userStore.fetchUserNotifications();
  }, [userStore]);

  return (
    <div className="main-inner-item main-inner-item3">
      <div className="main-inner-item3-content">
        <div className="display-flex display-flex-end btns-wrap">
          <HelpHamburgerMenu />
          <Notifications notifications={notifications} />
        </div>
        <StatCount />
        <div className="actions-inner-wrap">
          <h2>פעולות</h2>
          <Actions />
        </div>
        <div className="requests-inner-wrap">
          <div className="display-flex title-wrap">
            <h2>בקשות שלי</h2>
            <a href="#all" title="הכל - נפתך בחלון חדש">
              הכל
            </a>
          </div>
          <div className="table-item-wrap">
            <div className="table-item-inner">
              <List list={recentApplies.slice(0, 5)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideToolbar;
