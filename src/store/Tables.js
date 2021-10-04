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

  async loadEntitiesUnderOG(id, page, pageSize, append = false) {
    const entities = await getEntitiesUnderOG({ id, page, pageSize });
    this.entities =  (append)? [...this.entities, ...entities]:entities;
  }

  async loadRolesUnderOG(id, page, pageSize, append = false) {
    const roles = await getRolesUnderOG({ id, page, pageSize });
    this.roles = (append)? [...this.roles, ...roles]: roles;
  }

  async loadOGChildren(id, page, pageSize, append = false) {
    const groups = await getOGChildren({ id, page, pageSize });
    this.groups = append ? [...this.groups, ...groups] : groups;
  }
}
