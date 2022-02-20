import NotificationsScroll from "./NotificationsScroll";
import { observer } from 'mobx-react';
import { useEffect } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useStores } from "../../context/use-stores";

import "../../assets/css/local/components/notifications.css";

const AllNotifications = observer(({ isVisible, setIsVisible }) => {
  const {notificationStore} = useStores();

  useEffect(async() => {
    isVisible && await notificationStore.fetchUserAllNotification();
  }, [isVisible]);

  return (
    <Dialog
      className="notification-header"
      visible={isVisible}
      header="כל ההתראות"
      onHide={() => setIsVisible(false)}
      dismissableMask={true}
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
      <NotificationsScroll notifications={notificationStore.userNotifications} height="600px" />
    </Dialog>
  );
});

export default AllNotifications;
