import { ScrollPanel } from "primereact/scrollpanel";
import { observer } from 'mobx-react';
import Notification from "./Notification";
import HorizontalLine from "../HorizontalLine";

const NotificationsScroll = observer(({ notifications, height }) => {
  return (
    <div>
      <ScrollPanel style={{ width: "100%", height }}>
        {notifications.map((notification) => (
          <Notification notification={notification} />
        ))}
      </ScrollPanel>
      <HorizontalLine />
    </div>
  );
});

export default NotificationsScroll;
