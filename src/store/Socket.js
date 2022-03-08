import cookies from "js-cookie";
import { io } from "socket.io-client";

export default class SocketStore {
  notificationStore;
  appliesApproveStore;
  userStore;
  appliesStore;
  appliesMyStore;
  configStore;

  socket;

  constructor({ notificationStore, appliesApproveStore, userStore, appliesStore, appliesMyStore, configStore }) {
    this.notificationStore = notificationStore;
    this.appliesApproveStore = appliesApproveStore;
    this.userStore = userStore;
    this.appliesStore = appliesStore;
    this.appliesMyStore = appliesMyStore;
    this.configStore = configStore;
    configStore.configPromise.then((result) => {
      this.initSocket({
        socketUrl: result?.SOCKET_URL ? result.SOCKET_URL : configStore?.SOCKET_URL,
        tokenName: result?.TOKEN_NAME ? result.TOKEN_NAME : configStore?.TOKEN_NAME,
      });
    })
  }
  
  initSocket({socketUrl, tokenName}) {
    const token = cookies.get(tokenName);
    this.socket = io(socketUrl, {
      query: { token },
    });

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
    // user gets new unread notification
    this.socket.on("newNotification", (notification) => {
      this.notificationStore.addNotification(notification);
    });

    // user read notification
    this.socket.on("readNotifications", () => {
      this.notificationStore.readNotifications();
    });
  }

  initRequestEvents() {
    // user get new request for my
    this.socket.on("newRequestMy", (apply) => {
      this.appliesApproveStore.addOrUpdateApplyMy({ user: this.userStore.user, apply });
    });

    // user get new request for all
    this.socket.on("newRequestAll", (apply) => {
      this.appliesApproveStore.addOrUpdateApplyAll({ user: this.userStore.user, apply });
    });

    // user get update on request
    this.socket.on("updateRequest", (apply) => {
      if (apply.submittedBy.id === this.userStore.user.id) this.appliesStore.updateApply(apply);
      this.appliesMyStore.updateApply(apply);
      this.appliesApproveStore.updateApplyAndCount({
        user: this.userStore.user,
        reqId: apply.id,
        apply,
        removeApply: true,
      });
    });
  }
}
