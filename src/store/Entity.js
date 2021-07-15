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
    
      async loadEntityByEntity(entity) {
        this.entities = entity;
      }
    
      // TODO: change this function to axios call via Entity Service, need to call: getEntitiesUnderOG
      async loadEntityByOG(rootId) {
        const entities = await getEntitiesUnderOG(rootId);

        this.entities = entities;
      }
}