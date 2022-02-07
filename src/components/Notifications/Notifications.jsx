import AllNotifications from "./AllNotifications";
import HorizontalLine from "../HorizontalLine";
import NotificationsScroll from "./NotificationsScroll";
import { useRef, useState, useEffect } from "react";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import { getMyNotifications } from "../../service/NotificationService";

import "../../assets/css/local/components/notifications.css";
import { useStores } from '../../context/use-stores';

const Notifications = () => {
  const op = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);
  const {notificationStore} = useStores();
  const [unreadNotifications, setUnreadNotifications] = useState(notificationStore.userUnreadNotifications);

  useEffect(() => {
    const updateReadNotifications = async () => {
      const data = (await getMyNotifications(true, 1, 5)).notifications;
      setReadNotifications(data);
    };

    if (!(unreadNotifications.length)) updateReadNotifications();
  }, [setReadNotifications]);

  useEffect(() => {
    console.log(notificationStore.userUnreadNotifications);
    setUnreadNotifications(notificationStore.userUnreadNotifications);
  }, [notificationStore.userUnreadNotifications]);

  return (
    <div style={{ display: "inline-block" }}>
      <button
        className="btn btn-notification p-mr-4"
        title="התראות"
        type="button"
        onClick={(e) => {
          op.current.toggle(e);
        }}
      >
        {unreadNotifications.length && (
          <Badge value={unreadNotifications.length} style={{ position: "relative", top: "1.2rem", left: "1.2rem" }} />
        )}
      </button>

      <OverlayPanel
        showCloseIcon={true}
        ref={op}
        id="overlay_panel"
        style={{ width: "350px", direction: "rtl", borderRadius: "40px" }}
        className="overlaypanel-demo"
        onHide={async () => {
          unreadNotifications.length &&
            (await notificationStore.markNotificationsAsRead(
              notificationStore.userUnreadNotifications.map(({ id }) => id)
            ));
        }}
      >
        <h2 style={{ textAlign: "center" }}>{unreadNotifications.length ? "התראות חדשות" : "התראות שנקראו"}</h2>
        <HorizontalLine />
        {unreadNotifications.length && (
          <NotificationsScroll notifications={notificationStore.userUnreadNotifications} height="400px" />
        )}
        {!(unreadNotifications.length) && <NotificationsScroll notifications={readNotifications} height="400px" />}
        <h2
          style={{
            textAlign: "center",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => setIsVisible(true)}
        >
          לכל ההתראות
        </h2>
      </OverlayPanel>
      <AllNotifications isVisible={isVisible} setIsVisible={setIsVisible} />
    </div>
  );
};

export default Notifications;
