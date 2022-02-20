import AllNotifications from "./AllNotifications";
import HorizontalLine from "../HorizontalLine";
import NotificationsScroll from "./NotificationsScroll";
import { useRef, useState, useEffect } from "react";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import { observer } from "mobx-react";
import { useStores } from '../../context/use-stores';

import "../../assets/css/local/components/notifications.css";

const Notifications = observer(() => {
  const op = useRef(null);
  const {notificationStore} = useStores();
  const [isVisible, setIsVisible] = useState(false);
  const [hasUnreadNotify, setHasUnreadNotify] = useState(false);
  const unreadNotifications = notificationStore.userUnreadNotifications;

  useEffect(() => {
    const updateReadNotifications = async () => {
      await notificationStore.fetchUserReadNotifications(true, 1, 5);
    };
    if (!hasUnreadNotify) updateReadNotifications();
  }, [hasUnreadNotify]);

  useEffect(() => {
    setHasUnreadNotify(unreadNotifications && unreadNotifications.length > 0);
  }, [unreadNotifications]);

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
        {hasUnreadNotify && (
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
          hasUnreadNotify && (await notificationStore.markNotificationsAsRead(unreadNotifications.map(({ id }) => id)));
        }}
      >
        <h2 style={{ textAlign: "center" }}>{hasUnreadNotify ? "התראות חדשות" : "התראות שנקראו"}</h2>
        <HorizontalLine />
        <NotificationsScroll
          notifications={hasUnreadNotify ? unreadNotifications : notificationStore.userReadNotifications}
          height="400px"
        />

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
});

export default Notifications;
