import { useEffect, useState } from "react";
import HorizontalLine from "../HorizontalLine";
import { getRequestById } from "../../service/AppliesService";
import PreviewRequestsDialog from "../Modals/Request/PreviewRequestsDialog1";

const Notification = ({ notification }) => {
  const [request, setRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getRequest = async () => {
      setRequest(await getRequestById(notification.requestId));
    };

    getRequest();
  }, []);

  return (
    <>
      <div onClick={() => setIsModalOpen(true)}>
        <div
          style={{ textAlign: "initial" }}
          dangerouslySetInnerHTML={{ __html: notification.message }}
        />
        <div style={{ marginTop: "8px", color: "grey" }}>
          {new Date(+notification.createdAt).toLocaleString("en-GB")}
        </div>
        <HorizontalLine />
      </div>
      {request && isModalOpen && (
        <PreviewRequestsDialog
          isDialogVisible={isModalOpen}
          setDialogVisiblity={setIsModalOpen}
          request={request}
        />
      )}
    </>
  );
};

export default Notification;
