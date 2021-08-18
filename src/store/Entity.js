import { action, makeAutoObservable, observable } from 'mobx';
import { getEntitiesUnderOG } from '../service/EntityService';

export default class EntityStore {
    entities = [];

    constructor() {
        makeAutoObservable(this, {
          entities: observable,
          loadEntityByEntity: action,
          loadEntityByOG: action,
        });
      }
    
      async loadEntitiesByEntity(entity) {
        this.entities = entity;
      }
    
      async loadEntitiesByOG(rootId) {
        const entities = await getEntitiesUnderOG(rootId);

        this.entities = entities;
      }
}