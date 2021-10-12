import { Button } from "primereact/button";
import { ScrollPanel } from "primereact/scrollpanel";
import "../assets/css/local/components/notifications.css";
import { Dialog } from "primereact/dialog";

const AllNotifications = ({ notifications, isVisible, setIsVisible }) => {
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
      <ScrollPanel style={{ width: "100%", height: "600px" }}>
        {notifications.map((notification) => (
          <div>
            <div
              style={{ textAlign: "initial" }}
              dangerouslySetInnerHTML={{ __html: notification.message }}
            />
            <div
              style={{ marginTop: "5px", marginBottom: "3px", color: "grey" }}
            >
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
    </Dialog>
  );
};

export default AllNotifications;
