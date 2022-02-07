import cookies from "js-cookie";
import configStore from '../../store/Config';
import { io } from "socket.io-client";
import { useStores } from '../../context/use-stores';

const SocketWrapper = () => {
  const { notificationStore } = useStores();

  const token = cookies.get(configStore.TOKEN_NAME);
  const socket = io("localhost:2001", {
    query: { token },
  });

  socket.on("unauthorized", (error) => {
    if (error.data.type == "UnauthorizedError" || error.data.code == "invalid_token") {
      // TODO : redirect user to login page perhaps?
      console.log("User token has expired");
    }
  });

  socket.on("newNotification", (data) => {
    notificationStore.addNotification(data);
  });

  return <></>;
};


export default SocketWrapper;