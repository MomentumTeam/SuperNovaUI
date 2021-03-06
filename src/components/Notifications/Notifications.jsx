import { useRef, useState, useEffect } from "react";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import AllNotifications from "./AllNotifications";
import HorizontalLine from "../HorizontalLine";
import NotificationsScroll from "./NotificationsScroll";
import { useStores } from "../../context/use-stores";
import { getMyNotifications } from "../../service/NotificationService";
import "../../assets/css/local/components/notifications.css";

const Notifications = ({ notifications }) => {
  const op = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { userStore } = useStores();
  const [readNotifications, setReadNotifications] = useState([]);

  const isNewNotificationsAvailable = notifications.length > 0;

  useEffect(() => {
    const updateReadNotifications = async () => {
      const data = (await getMyNotifications(true, 1, 5)).notifications;
      setReadNotifications(data);
    };

    if (!isNewNotificationsAvailable) {
      updateReadNotifications();
    }
  }, [setReadNotifications]);

  return (
    <div style={{ display: "inline-block" }}>
      <button
        className="btn btn-notification p-mr-4"
        title="Notification"
        type="button"
        onClick={(e) => {
          op.current.toggle(e);
        }}
      >
        {isNewNotificationsAvailable > 0 && (
          <Badge
            value={notifications.length}
            style={{ position: "relative", top: "1.2rem", left: "1.2rem" }}
          />
        )}
      </button>
      <OverlayPanel
        showCloseIcon={true}
        ref={op}
        id="overlay_panel"
        style={{ width: "350px", direction: "rtl", borderRadius: "40px" }}
        className="overlaypanel-demo"
        onHide={async () => {
          isNewNotificationsAvailable &&
            (await userStore.markNotificationsAsRead(
              notifications.map(({ id }) => id)
            ));
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          {isNewNotificationsAvailable ? "???????????? ??????????" : "???????????? ????????????"}
        </h2>
        <HorizontalLine />
        {isNewNotificationsAvailable && (
          <NotificationsScroll notifications={notifications} height="400px" />
        )}
        {!isNewNotificationsAvailable && (
          <NotificationsScroll
            notifications={readNotifications}
            height="400px"
          />
        )}
        <h2
          style={{
            textAlign: "center",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() => setIsVisible(true)}
        >
          ?????? ??????????????
        </h2>
      </OverlayPanel>
      <AllNotifications isVisible={isVisible} setIsVisible={setIsVisible} />
    </div>
  );
};

export default Notifications;
