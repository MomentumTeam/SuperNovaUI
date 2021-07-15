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
        console.log(entity)
        this.entities = [entity];
      }
    
      async loadEntityByOG(rootId) {
        const entities = await getEntitiesUnderOG(rootId);

        this.entities = entities;
      }
}