import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { getMyNotifications } from "../../service/NotificationService";
import NotificationsScroll from "./NotificationsScroll";
import "../../assets/css/local/components/notifications.css";

const AllNotifications = ({ isVisible, setIsVisible }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const updateReadNotifications = async () => {
      const data = (await getMyNotifications()).notifications;
      setNotifications(data);
    };

    updateReadNotifications();
  }, [setNotifications]);

  return (
    <Dialog
      className="notification-header"
      visible={isVisible}
      header="כל ההתראות"
      onHide={() => setIsVisible(false)}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            label="סגור"
            onClick={() => setIsVisible(false)}
            className="btn-gradient orange"
          />
        </div>
      }
    >
      <NotificationsScroll notifications={notifications} height="600px" />
    </Dialog>
  );
};

export default AllNotifications;
