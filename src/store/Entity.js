import { action, makeAutoObservable, observable } from 'mobx';
import { getEntitiesUnderOG , getRolesUnderOG, getChildrenOfOG } from '../service/EntityService';

export default class EntityStore {
    entities = [];
    roles = [];
    groups = [];

    constructor() {
        makeAutoObservable(this, {
          entities: observable,
          roles:observable,
          groups:observable,
          loadEntityByEntity: action,
          loadEntitiesUnderOG: action,
          loadRolesUnderOG: action,
          loadChildrenOfOG: action,
        });
      }
    
      async loadEntitiesByEntity(entity) {
        this.entities = entity;
      }
    
      async loadEntitiesUnderOG(rootId) {
        const entities = await getEntitiesUnderOG(rootId);

        this.entities = entities;
      }

      async loadRolesUnderOG(rootId) {
        const roles = await getRolesUnderOG(rootId);

        this.roles = roles;
      }

      async loadChildrenOfOG(rootId) {
        const groups = await getChildrenOfOG(rootId);

        this.groups = groups;
      }
}