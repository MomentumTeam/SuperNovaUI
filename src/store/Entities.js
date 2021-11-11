import { action, makeAutoObservable, observable } from "mobx";
import {
  getEntitiesUnderOG,
  getEntitiesByHierarchy,
  getEntityByRoleId,
  searchEntitiesByFullName,
  getEntityByIdentifier,
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
    let filteredResults;
    const { query } = event;

    if (!query.trim().length) {
      filteredResults = [];
    } else if (query.match("[0-9]+") && query.length >= 6) {
      filteredResults = await getEntityByIdentifier(query);
      filteredResults = [filteredResults];
    } else {
      filteredResults = await searchEntitiesByFullName(query);
      filteredResults = filteredResults.entities;
    }
    return filteredResults;
  }

  async getEntitiesByHierarchy(event) {
    let filteredResults;
    const { query } = event;

    if (!query.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await getEntitiesByHierarchy(query);
      filteredResults = filteredResults.entities;
    }

    return filteredResults;
  }

  async getEntitiesByRoleId(event) {
    let filteredResults;
    const { query } = event;

    if (!query.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await getEntityByRoleId(query);
      filteredResults = [filteredResults];
    }

    return filteredResults;
  }
}
