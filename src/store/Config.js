import { makeAutoObservable, observable } from 'mobx';
import { getConfig } from '../service/ConfigService';

class ConfigStore {
  // USER
  USER_CITIZEN_ENTITY_TYPE = 'digimon';
  USER_CLEARANCE = ['1', '2', '3', '4', '5', '6'];
  USER_SOURCE_DI = 'sf_name';
  USER_NO_PICTURE = 'pictureUrl';
  USER_HIGH_COMMANDER_RANKS = ['rookie', 'champion'];
  USER_DI_TYPE = 'domainUser';
  USER_ROLE_ENTITY_TYPE = 'goalUser';

  // GENERAL
  TOKEN_NAME = 'sp-token';
  PAGE_SIZE = 10;
  ITEMS_IN_PAGE = 6;
  FIRST_PAGE = 0;
  SECURITY_MAIL = 'T82130201@gmail.com';
  SUPER_SECURITY_MAIL = 'T02250B49@gmail.com';
  INSTRUCTION_VIDEOS =
    'https://www.youtube.com/watch?v=OcUDK4kAUIw&ab_channel=KaliUchis-Topic';
  HI_CHAT_SUPPORT_GROUP_NAME = 'לגו תמיכה';

  constructor() {
    makeAutoObservable(this, {
      USER_CITIZEN_ENTITY_TYPE: observable,
      USER_CLEARANCE: observable,
      USER_SOURCE_DI: observable,
      USER_NO_PICTURE: observable,
      USER_HIGH_COMMANDER_RANKS: observable,
      USER_DI_TYPE: observable,
      USER_ROLE_ENTITY_TYPE: observable,
      TOKEN_NAME: observable,
      PAGE_SIZE: observable,
      ITEMS_IN_PAGE: observable,
      FIRST_PAGE: observable,
      SECURITY_MAIL: observable,
      SUPER_SECURITY_MAIL: observable,
      INSTRUCTION_VIDEOS: observable,
      HI_CHAT_SUPPORT_GROUP_NAME: observable,
    });
  }

  async loadConfig() {
    try {
      const config = await getConfig();
      if (config?.USER_CITIZEN_ENTITY_TYPE)
        this.USER_CITIZEN_ENTITY_TYPE = config.USER_CITIZEN_ENTITY_TYPE;
      if (config?.USER_CLEARANCE) this.USER_CLEARANCE = config.USER_CLEARANCE;
      if (config?.USER_SOURCE_DI) this.USER_SOURCE_DI = config.USER_SOURCE_DI;
      if (config?.USER_NO_PICTURE)
        this.USER_NO_PICTURE = config.USER_NO_PICTURE;
      if (config?.USER_HIGH_COMMANDER_RANKS)
        this.USER_HIGH_COMMANDER_RANKS = config.USER_HIGH_COMMANDER_RANKS;
      if (config?.USER_DI_TYPE) this.USER_DI_TYPE = config.USER_DI_TYPE;
      if (config?.USER_ROLE_ENTITY_TYPE)
        this.USER_ROLE_ENTITY_TYPE = config.USER_ROLE_ENTITY_TYPE;
      if (config?.TOKEN_NAME) this.TOKEN_NAME = config.TOKEN_NAME;
      if (config?.PAGE_SIZE) this.PAGE_SIZE = config.PAGE_SIZE;
      if (config?.ITEMS_IN_PAGE) this.ITEMS_IN_PAGE = config.ITEMS_IN_PAGE;
      if (config?.FIRST_PAGE) this.FIRST_PAGE = config.FIRST_PAGE;
      if (config?.SECURITY_MAIL) this.SECURITY_MAIL = config.SECURITY_MAIL;
      if (config?.SUPER_SECURITY_MAIL)
        this.SUPER_SECURITY_MAIL = config.SUPER_SECURITY_MAIL;
      if (config?.INSTRUCTION_VIDEOS)
        this.INSTRUCTION_VIDEOS = config.INSTRUCTION_VIDEOS;
    } catch (error) {
      console.log('problem with config');
    }
  }
}

const configStore = new ConfigStore();
configStore.loadConfig();
export default configStore;
