import { action, makeAutoObservable, observable } from "mobx";
import { getMyNotifications, markAsRead, markAllAsRead } from "../service/NotificationService";

export default class NotificationsStore {
  userNotifications = [];
  userReadNotifications = [];
  userUnreadNotifications = [];

  constructor() {
    makeAutoObservable(this, {
      userNotifications: observable,
      userReadNotifications: observable,
      userUnreadNotifications: observable,
      fetchUserUnreadNotifications: action,
      addNotification: action,
    });

    this.fetchUserUnreadNotifications();
  }

  async fetchUserAllNotification() {
    const userNotification = await getMyNotifications();
    this.userNotifications = userNotification.notifications;
  }

  async fetchUserReadNotifications(read, rangeStart, rangeEnd) {
    const userNotification = await getMyNotifications(read, rangeStart, rangeEnd);
    this.userReadNotifications = userNotification.notifications;
  }

  async fetchUserUnreadNotifications() {
    const userUnreadNotifications = await getMyNotifications(false);
    this.userUnreadNotifications = userUnreadNotifications.notifications;
  }

  addNotification(notification) {
    if (!notification.read) {
      const notifications = new Set([notification, ...this.userUnreadNotifications]);
      this.userUnreadNotifications = [...notifications];
    }
  }

  readNotifications() {
    this.userUnreadNotifications = [];
  }
  async markNotificationsAsRead(ids) {
    await markAsRead(ids);
    this.readNotifications();
  }

  async markAllNotificationsAsRead() {
    await markAllAsRead();
    this.readNotifications();
  }
}
