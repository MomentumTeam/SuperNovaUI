import { action, makeAutoObservable, observable } from 'mobx';
import { getConfig } from '../service/ConfigService';
import { getEntityByMongoId } from '../service/KartoffelService';

class ConfigStore {
  soldierRequestsApprovers = [];

  // USER
  USER_CITIZEN_ENTITY_TYPE = 'digimon';
  USER_EXTERNAL_ENTITY_TYPE = 'External';
  KARTOFFEL_CIVILIAN = 'Civilian';
  KARTOFFEL_SOLDIER = 'Soldier';
  KARTOFFEL_EXTERNAL = 'External';
  USER_CLEARANCE = ['1', '2', '3', '4', '5', '6'];
  KARTOFFEL_RANKS = ['טוראי', 'רב"ט', 'סמל', 'סמ"ר'];
  KARTOFFEL_SERVICE_TYPES = ['חובה', 'חובה בתנאי קבע', 'קבע', 'מילואים'];
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
  CREATE_ADMIN_REQS_APPROVERS = [
    '61c039d8e4de0300121de45a',
    '61dd539ce4de030012202d5e',
  ];
  CREATE_BULK_REQS_APPROVERS = [
    '61dd539ce4de030012202d5e',
    '619e3a6fe4de0300121d78c7',
  ];
  CREATE_SOLDIER_APPROVERS = [
    '619e3a6fe4de0300121d78c7',
    '619e406ee4de0300121dc4c8',
  ];
  CREATE_WORKER_APPROVERS = [
    '619e3a6fe4de0300121d78c7,61c039d8e4de0300121de45a',
  ];
  WORKER_ORGANIZATION_PREFIXES = ['8747', '8200', '8100'];
  WORKER_ORGANIZATIONS_ID_LIST = ['619e3210f235dc001846faff'];

  constructor() {
    makeAutoObservable(this, {
      KARTOFFEL_EXTERNAL: observable,
      USER_CITIZEN_ENTITY_TYPE: observable,
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
      CREATE_ADMIN_REQS_APPROVERS: observable,
      CREATE_BULK_REQS_APPROVERS: observable,
      soldierRequestsApprovers: observable,
      loadConfig: action,
      loadAdminApprovers: action,
    });
  }

  async loadConfig() {
    try {
      const config = await getConfig();
      if (config?.USER_CITIZEN_ENTITY_TYPE)
        this.USER_CITIZEN_ENTITY_TYPE = config.USER_CITIZEN_ENTITY_TYPE;
      if (config?.USER_EXTERNAL_ENTITY_TYPE)
        this.USER_EXTERNAL_ENTITY_TYPE = config.USER_EXTERNAL_ENTITY_TYPE;
      if (config?.KARTOFFEL_CIVILIAN)
        this.KARTOFFEL_CIVILIAN = config.KARTOFFEL_CIVILIAN;
      if (config?.KARTOFFEL_SOLDIER)
        this.KARTOFFEL_SOLDIER = config.KARTOFFEL_SOLDIER;
      if (config?.KARTOFFEL_EXTERNAL)
        this.KARTOFFEL_EXTERNAL = config.KARTOFFEL_EXTERNAL;
      if (config?.KARTOFFEL_RANKS)
        this.KARTOFFEL_RANKS = config.KARTOFFEL_RANKS;
      if (config?.KARTOFFEL_SERVICE_TYPES)
        this.KARTOFFEL_SERVICE_TYPES = config.KARTOFFEL_SERVICE_TYPES;
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
      if (config?.CREATE_ADMIN_APPROVERS) {
        // this.CREATE_ADMIN_REQS_APPROVERS = config.CREATE_ADMIN_APPROVERS;
        const approvers = await this.loadApprovers(
          config.CREATE_ADMIN_APPROVERS
        );
        this.CREATE_ADMIN_REQS_APPROVERS = approvers;
      }
      if (config?.CREATE_BULK_APPROVERS) {
        // this.CREATE_BULK_REQS_APPROVERS = config.CREATE_BULK_APPROVERS;
        const approvers = await this.loadApprovers(
          config.CREATE_BULK_APPROVERS
        );
        this.CREATE_BULK_REQS_APPROVERS = approvers;
      }
      if (config.CREATE_SOLDIER_APPROVERS) {
        this.CREATE_SOLDIER_APPROVERS = config.CREATE_SOLDIER_APPROVERS;
        const approvers = await this.loadApprovers(
          this.CREATE_SOLDIER_APPROVERS
        );
        this.soldierRequestsApprovers = approvers;
      }
      if (config?.organizationNumbers)
        this.organizationNumbers = config.organizationNumbers;
      if (config?.organizationIds)
        this.organizationIds = config.organizationIds;
      if (config?.organizationNumberToGroupId)
        this.organizationNumberToGroupId = config.organizationNumberToGroupId;
    } catch (error) {
      console.log('problem with config');
    }
  }

  async loadApprovers(approversIdsArray) {
    const approverForAdmin = await Promise.all(
      approversIdsArray.map(async (id) => {
        try {
          const entity = await getEntityByMongoId(id);
          return entity;
        } catch {
          return null;
        }
      })
    );

    return approverForAdmin.filter((approver) => approver !== null);
  }
}

const configStore = new ConfigStore();
configStore.loadConfig();
export default configStore;
