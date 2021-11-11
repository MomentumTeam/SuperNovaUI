import { action, makeAutoObservable, observable } from "mobx";
import {
  getRolesUnderOG,
  getRoleByRoleId,
  getRolesByHierarchy,
} from "../service/KartoffelService";

export default class RolesStore {
  roles = [];

  constructor() {
    makeAutoObservable(this, {
      roles: observable,
      loadRolesUnderOG: action,
      getRolesByRoleId: action,
    });
  }

  async loadRolesUnderOG(id, page, pageSize, append = false) {
    const roles = await getRolesUnderOG({ id, page, pageSize });
    this.roles = append ? [...this.roles, ...roles] : roles;
  }


  async getRolesByRoleId(event) {
    let filteredResults;
    const { query } = event;

    if (!query.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await getRoleByRoleId(query);
      filteredResults = [filteredResults];
    }

    return filteredResults;
  }

  async getRolesByHierarchy(event) {
    let filteredResults;
    const { query } = event;

    if (!query.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await getRolesByHierarchy(query);
      filteredResults = [filteredResults];
    }

    return filteredResults;
  }
}
