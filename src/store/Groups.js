import { action, makeAutoObservable, observable } from "mobx";
import {
  getOGChildren,
  getRoleByRoleId,
  searchOG,
} from "../service/KartoffelService";

export default class GroupsStore {
  groups = [];

  constructor() {
    makeAutoObservable(this, {
      groups: observable,
      loadOGChildren: action,
      getHierarchyByHierarchy: action,
      getHierarchyByRoleId: action,
    });
  }


  async loadOGChildren(id, page, pageSize, append = false) {
    const groups = await getOGChildren({ id, page, pageSize });
    this.groups = append ? [...this.groups, ...groups] : groups;
  }

  async getHierarchyByHierarchy(event) {
    let filteredResults;
    const { query } = event;

    if (!query.trim().length) {
      filteredResults = [];
    } else {
      filteredResults = await searchOG(query);
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

      if (role && role.hierarchy) {
        filteredResults = await searchOG(role.hierarchy);
      }
    }

    return filteredResults;
  }
}
