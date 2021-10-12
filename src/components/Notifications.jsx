import { useRef, useState } from "react";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import { ScrollPanel } from "primereact/scrollpanel";
import AllNotifications from "./AllNotifications";
import "../assets/css/local/components/notifications.css";

const Notifications = ({ notifications }) => {
  const op = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="display-flex display-flex-end btns-wrap">
      <button
        className="btn btn-notification p-mr-4"
        title="Notification"
        type="button"
        onClick={(e) => op.current.toggle(e)}
      >
        {notifications?.length > 0 && (
          <Badge
            value={notifications.length}
            style={{ position: "relative", top: "1.2rem", left: "1.2rem" }}
          />
        )}
      </button>
      <OverlayPanel
        ref={op}
        id="overlay_panel"
        style={{ width: "350px", direction: "rtl", borderRadius: "40px" }}
        className="overlaypanel-demo"
      >
        <h2 style={{ textAlign: "center" }}>התראות</h2>
        <hr
          style={{
            height: 5,
            width: "inherit",
          }}
        />
        <ScrollPanel style={{ width: "100%", height: "400px" }}>
          {notifications.map((notification) => (
            <div>
              <div
                style={{ textAlign: "initial" }}
                dangerouslySetInnerHTML={{ __html: notification.message }}
              />
              <div style={{ marginTop: "8px", color: "grey" }}>
                {new Date(+notification.createdAt).toLocaleString("en-GB")}
              </div>
              <hr
                style={{
                  height: 2,
                  width: "inherit",
                }}
              />
            </div>
          ))}
        </ScrollPanel>
        <hr
          style={{
            height: 5,
            width: "inherit",
          }}
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
      <AllNotifications
        isVisible={isVisible}
        notifications={notifications}
        setIsVisible={setIsVisible}
      />
    </div>
  );
};

export default Notifications;
