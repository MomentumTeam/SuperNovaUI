import HorizontalLine from "../HorizontalLine";

const Notification = ({ notification }) => {
  return (
    <div>
      <div
        style={{ textAlign: "initial" }}
        dangerouslySetInnerHTML={{ __html: notification.message }}
      />
      <div style={{ marginTop: "8px", color: "grey" }}>
        {new Date(+notification.createdAt).toLocaleString("en-GB")}
      </div>
      <HorizontalLine />
    </div>
  );
};

export default Notification;
