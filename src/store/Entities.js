import { action, makeAutoObservable, observable } from "mobx";
import {
  getEntitiesUnderOG,
  getEntitiesByHierarchy,
  getEntityByRoleId,
  searchEntitiesByFullName,
  getEntityByIdentifier,
  getEntityByDI,
  searchDIByUniqueId,
} from "../service/KartoffelService";

export default class EntitiesStore {
  entities = [];

  constructor() {
    makeAutoObservable(this, {
      entities: observable,
      loadEntitiesUnderOG: action,
      getEntitiesByEntity: action,
      getEntitiesByHierarchy: action,
      getEntitiesByRoleId: action,
    });
  }

  async loadEntitiesUnderOG(id, page, pageSize, append = false) {
    const entities = await getEntitiesUnderOG({ id, page, pageSize });
    this.entities = append ? [...this.entities, ...entities] : entities;
  }

  async getEntitiesByEntity(event) {
    let filteredResults = [];
    const { query } = event;

    if (query.trim().length) {
      try {
        if (query.match("[0-9]+") && query.length >= 6) {
          filteredResults = await getEntityByIdentifier(query);
          filteredResults = [filteredResults];
        } else {
          filteredResults = await searchEntitiesByFullName(query);
          filteredResults = filteredResults.entities;
        }
      } catch (error) {}
    }
    return filteredResults;
  }

  async getEntitiesByHierarchy(event) {
    let filteredResults = [];
    const { query } = event;

    if (query.trim().length) {
      try {
        filteredResults = await getEntitiesByHierarchy(query);
        filteredResults = filteredResults.entities;
      } catch (error) {}
    }

    return filteredResults;
  }

  //   async getEntitiesByRoleId(event) {
  //     let filteredResults = [];
  //     const { query } = event;
  //
  //     if (query.trim().length) {
  //       try {
  //         filteredResults = await getEntityByRoleId(query);
  //         filteredResults = [filteredResults];
  //       } catch (error) {}
  //     }
  //
  //     return filteredResults;
  //   }

  async getEntitiesByDI(event) {
    let filteredResults = [];
    const { query } = event;

    if (query.trim().length) {
      try {
        filteredResults = await getEntityByDI(query);
        filteredResults = [filteredResults];
      } catch (error) {}
    }

    return filteredResults;
  }

  async searchEntitiesByDI(event) {
    let filteredResults = [];
    const { query } = event;

    if (query.trim().length) {
      try {
         const dis = await searchDIByUniqueId(query);

         if (dis.length > 0) {
           filteredResults = await Promise.all(
             dis.map(async(di) => {
               try {
                 let entity = await getEntityByDI(di.uniqueId);
                 entity.uniqueIdSearch = di.uniqueId;
                 return entity;
               } catch (error) {
                 
               }
             })
           );
         }
      } catch (error) {}
    }

    return filteredResults;
  }
}
