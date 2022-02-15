import { action, makeAutoObservable, observable } from 'mobx';
import { getPictureByConnectedEntity, getUser } from "../service/UserService";
import { getMyNotifications, markAsRead } from '../service/NotificationService';
import { Base64 } from 'js-base64';
import cookies from 'js-cookie';
import configStore from './Config';

export default class UserStore {
  isUserLoading = true;
  user = null;
  users = null;
  userNotifications = [];
  userUnreadNotifications = [];
  isUserExternal = false;  

  constructor() {
    makeAutoObservable(this, {
      user: observable,
      isUserLoading: observable,
      userUnreadNotifications: observable,
      fetchUserInfo: action,
      fetchUserNotifications: action,
      getMyPicture: action,
      isUserExternal: observable
    });

    this.getUserToken();
  }

  async getUserToken() {
    const shragaUser = this.parseToken();
    this.user = shragaUser;
    this.getMyPicture();
  }

  async fetchUserInfo() {
    this.isUserLoading = true;

    try {
      const kartoffelUser = await getUser();
      if (kartoffelUser.displayName === "") kartoffelUser.displayName = kartoffelUser.fullName;
      this.user = { ...this.user, ...kartoffelUser };
      
    } catch (error) {
      console.log("problem in fetching user data");
    }
    
    this.isUserLoading = false;
    this.checkIfUserExternal();
  }

  parseToken() {
    try {
      const token = cookies.get(configStore.TOKEN_NAME);
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('token malford');
      }

      let user = JSON.parse(Base64.decode(parts[1]));
      return user;
    } catch (err) {
      console.log(err);
    }
  }
  
  checkIfUserExternal() {
     configStore.WORKER_ORGANIZATIONS_ID_LIST.forEach((ogId) => {
       if (ogId === this.user.directGroup) {
         this.isUserExternal = true;
       }
     })
  }

  async fetchUserNotifications() {
    const userUnreadNotifications = await getMyNotifications(false);
    this.userUnreadNotifications.replace(userUnreadNotifications.notifications);
  }

  async markNotificationsAsRead(ids) {
    await markAsRead(ids);
    this.userUnreadNotifications.clear();
  }

  async getMyPicture() {
    const myPicture = await getPictureByConnectedEntity();
    this.user = {...this.user, picture: myPicture.image};
  }
}
