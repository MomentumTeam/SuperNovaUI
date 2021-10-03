import { action, makeAutoObservable, observable } from 'mobx';
import {
  getEntitiesUnderOG,
  getRolesUnderOG,
  getOGChildren,
} from '../service/KartoffelService';

export default class TablesStore {
  entities = [];
  roles = [];
  groups = [];

  constructor() {
    makeAutoObservable(this, {
      entities: observable,
      roles: observable,
      groups: observable,
      loadEntityByEntity: action,
      loadEntitiesUnderOG: action,
      loadRolesUnderOG: action,
      loadOGChildren: action,
    });
  }

  async loadEntitiesByEntity(entity) {
    this.entities = entity;
  }

  async loadEntitiesUnderOG(rootId, page = 0, pageSize = 100) {
    const entities = await getEntitiesUnderOG(rootId);
    this.entities = entities;
  }

  async loadRolesUnderOG(rootId) {
    const roles = await getRolesUnderOG(rootId);

    this.roles = roles;
  }

  async loadOGChildren(rootId) {
    const groups = await getOGChildren(rootId);

    this.groups = groups;
  }
}
