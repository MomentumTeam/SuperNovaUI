import { ScrollPanel } from "primereact/scrollpanel";
import Notification from "./Notification";
import HorizontalLine from "../HorizontalLine";

const NotificationsScroll = ({ notifications, height }) => {
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
};

export default NotificationsScroll;
