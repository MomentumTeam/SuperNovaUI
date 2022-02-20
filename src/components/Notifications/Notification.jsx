import HorizontalLine from "../HorizontalLine";
import PreviewRequestsDialog from "../Modals/Request/PreviewRequestsDialog1";
import { useEffect, useState } from "react";
import { getRequestById } from "../../service/AppliesService";

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
