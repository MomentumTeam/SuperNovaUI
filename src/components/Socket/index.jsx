import cookies from "js-cookie";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { useStores } from "../../context/use-stores";

const SocketProvider = observer(() => {
  const [socket, setSocket] = useState(null);
  const {
    notificationStore,
    appliesApproveStore,
    userStore,
    appliesStore,
    appliesMyStore,
    configStore,
  } = useStores();

  useEffect(() => {
    if (socket) socket.close();
  
    initSocket({
      socketUrl: configStore.SOCKET_URL,
      tokenName: configStore.TOKEN_NAME,
    });
  }, [configStore.SOCKET_URL, configStore.TOKEN_NAME]);

  useEffect(() => {
    if (socket) {
      socket.on("unauthorized", (error) => {
        if (
          error.data.type == "UnauthorizedError" ||
          error.data.code == "invalid_token"
        ) {
          // TODO : redirect user to login page perhaps?
          console.log("User token has expired");
          socket.disconnect();
        }
      });

      initNotificationEvents();
      initRequestEvents();
    }
  }, [socket]);

  const initSocket = ({ socketUrl, tokenName }) => {
    const token = cookies.get(tokenName);
    const socketInit = io(socketUrl, {
      query: { token },
      transports: ["websocket"],
    });
    setSocket(socketInit);
  };

  const initNotificationEvents = () => {
    // user gets new unread notification
    socket.on("newNotification", (notification) => {
      notificationStore.addNotification(notification);
    });

    // user read notification
    socket.on("readNotifications", () => {
      notificationStore.readNotifications();
    });
  };

  const initRequestEvents = () => {
    // user get new request for my
    socket.on("newRequestMy", (apply) => {
            console.log("newRequestMy");

      appliesApproveStore.addOrUpdateApplyMy({
        user: userStore.user,
        apply,
      });
    });

    // user get new request for all
    socket.on("newRequestAll", (apply) => {
      console.log("newRequestAll");
      appliesApproveStore.addOrUpdateApplyAll({
        user: userStore.user,
        apply,
      });
    });

    // user get update on request
    socket.on("updateRequest", (apply) => {
      console.log('updaterequest')
      if (apply.submittedBy.id === userStore.user.id) {
        appliesStore.updateApply(apply);
        appliesMyStore.updateApply(apply);
      }

  
      appliesApproveStore.addOrUpdateApplyMy({
        user: userStore.user,
        apply,
      });
    });

    // user get delete request
    socket.on("deleteRequest", (apply) => {
      appliesApproveStore.removeApply(apply, userStore.user);

      if (apply.submittedBy.id === userStore.user.id)
        appliesMyStore.removeApply(apply);
    });
  };

  return <></>;
});

export { SocketProvider };
