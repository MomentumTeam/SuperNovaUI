import { action, makeAutoObservable, observable } from 'mobx';
import { getPictureByConnectedEntity, getUser } from "../service/UserService";
import {
  getOGById,
} from '../service/KartoffelService';

import { Base64 } from 'js-base64';
import cookies from 'js-cookie';
import configStore from './Config';

export default class UserStore {
  isUserLoading = true;
  user = null;
  users = null;
  isUserExternal = false;  

  constructor() {
    makeAutoObservable(this, {
      user: observable,
      isUserLoading: observable,
      fetchUserInfo: action,
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
    await this.checkIfUserExternal();
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
async checkIfUserExternal() {
    if (this.user && (this.user.entityType === configStore.KARTOFFEL_EXTERNAL ||
        configStore.ENTITIES_WITH_VISIBLE_CREATE_EXTERNAL.includes(this.user.id) ||
        configStore.organizationIds && configStore.organizationIds.includes(this.user.directGroup))) {
      this.isUserExternal = true
    }

    if (!this.isUserExternal) {
      let userOG = await getOGById(this.user.directGroup);
      userOG.ancestors.forEach((ancestor) => {
        if (configStore.organizationIds && configStore.organizationIds.includes(ancestor)) {
          this.isUserExternal = true;
        }
      })
    }
  }

  async getMyPicture() {
    const myPicture = await getPictureByConnectedEntity();
    this.user = {...this.user, picture: myPicture.image};
  }
}
