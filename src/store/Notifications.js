import { action, makeAutoObservable, observable } from "mobx";
import { getMyNotifications, markAsRead } from "../service/NotificationService";

export default class NotificationsStore {
  userNotifications = [];
  userUnreadNotifications = [];

  constructor() {
    makeAutoObservable(this, {
      userNotifications: observable,
      userUnreadNotifications: observable,
      fetchUserNotifications: action,
      addNotification: action
    });

    this.fetchUserNotifications();
  }

  async fetchUserNotifications() {
    const userUnreadNotifications = await getMyNotifications(false);
    this.userUnreadNotifications = userUnreadNotifications.notifications;
  }

  addNotification(notification) {
   this.userUnreadNotifications = [notification, ...this.userUnreadNotifications];
  }

  async markNotificationsAsRead(ids) {
    await markAsRead(ids);
    this.userUnreadNotifications = [];
  }
}
