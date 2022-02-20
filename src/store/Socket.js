import cookies from "js-cookie";
import { io } from "socket.io-client";

export default class SocketStore {
  notificationStore;
  appliesApproveStore;
  configStore;
  socket;

  constructor(notificationStore, appliesApproveStore, configStore) {
    this.notificationStore = notificationStore;
    this.appliesApproveStore = appliesApproveStore;
    this.configStore = configStore;

    const token = cookies.get(this.configStore.TOKEN_NAME);
    this.socket = io("localhost:2001", {
      query: { token },
    });

    this.initSocket();
  }

  initSocket() {
    this.socket.on("unauthorized", (error) => {
      if (error.data.type == "UnauthorizedError" || error.data.code == "invalid_token") {
        // TODO : redirect user to login page perhaps?
        console.log("User token has expired");
        this.socket.disconnect();
      }
    });

    this.initNotificationEvents();
    this.initRequestEvents();
  }
  
  initNotificationEvents() {
    this.socket.on("newNotification", (notification) => {
      // user gets new unread notification
      this.notificationStore.addNotification(notification);
    });
    
    this.socket.on("readNotifications", () => {
      this.notificationStore.readNotifications();
    });
  }
  
  initRequestEvents() {
    this.socket.on("newRequest", (apply) => {
      this.appliesApproveStore.addApply(apply);
    });
  }
}
