import { action, makeAutoObservable, observable } from "mobx";
import {
  getEntitiesUnderOG,
  getRolesUnderOG,
  getOGChildren,
  getEntitiesByHierarchy,
  getEntityByRoleId,
  searchEntitiesByFullName,
  getEntityByIdentifier,
  getRoleByRoleId,
  searchOG,
} from "../service/KartoffelService";

export default class TablesStore {
  entities = [];
  roles = [];
  groups = [];

  constructor() {
    makeAutoObservable(this, {
      entities: observable,
      roles: observable,
      groups: observable,
      loadEntitiesUnderOG: action,
      loadRolesUnderOG: action,
      loadOGChildren: action,
      getEntitiesByEntity: action,
      getEntitiesByHierarchy: action,
      getEntitiesByRoleId: action,
    });
  }

  async loadEntitiesUnderOG(id, page, pageSize, append = false) {
    const entities = await getEntitiesUnderOG({ id, page, pageSize });
    this.entities = append ? [...this.entities, ...entities] : entities;
  }

  async loadRolesUnderOG(id, page, pageSize, append = false) {
    const roles = await getRolesUnderOG({ id, page, pageSize });
    this.roles = append ? [...this.roles, ...roles] : roles;
  }

  async loadOGChildren(id, page, pageSize, append = false) {
    const groups = await getOGChildren({ id, page, pageSize });
    this.groups = append ? [...this.groups, ...groups] : groups;
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

  async getHierarchyByHierarchy(event) {
    let filteredResults;
    const { query } = event;

    if (!query.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await searchOG(query);
      filteredResults = [filteredResults];
    }
    return filteredResults;
  }

  async getHierarchyByRoleId(event) {
    let filteredResults;
    const { query } = event;

    if (!query.trim().length) {
      filteredResults = [];
    } else {
      const role = await getRoleByRoleId(query);

      if(role) {
        console.log(roles)
        const filteredResults = await searchOG(query);

      }
      filteredResults = [filteredResults];
    }
    return filteredResults;
  }
}
