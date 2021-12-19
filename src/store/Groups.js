import { action, makeAutoObservable, observable } from "mobx";
import {
  getOGByHierarchy,
  getOGChildren,
  searchOG,
  searchRolesByRoleId,
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
    const groups = await getOGChildren({ id, page, pageSize, withRoles: true });
    this.groups = append ? [...this.groups, ...groups] : groups;
  }

  async getHierarchyByHierarchy(event) {
    let filteredResults = [];
    const { query } = event;

    if (query.trim().length) {
      try {
        filteredResults = await searchOG(query);
      } catch (error) {}
    }

    return filteredResults;
  }

  async getHierarchyByRoleId(event) {
    let filteredResults = [];
    const { query } = event;

    if (query.trim().length) {
      const roles = await searchRolesByRoleId(query);

      if (roles.length > 0) {
        let hierarchies = [];
        hierarchies = roles.map((role) => {
          if (role?.hierarchy) return { hierarchy: role.hierarchy, roleId: role.roleId };
        });

        filteredResults = await Promise.all(
          hierarchies.map(async (hierarchy) => {
            const res = await getOGByHierarchy(hierarchy.hierarchy);
            res.roleIdSearch = hierarchy.roleId;
            return res;
          })
        );
      }
    }

    return filteredResults;
  }

  //   async getHierarchyByDI(event) {
  //     let filteredResults = [];
  //     const { query } = event;
  //
  //     if (query.trim().length) {
  //       const dis = await searchDIByUniqueId(query);
  //
  //       if (dis.length > 0) {
  //         let hierarchies = [];
  //         hierarchies = dis.map((di) => {
  //           if (di?.role && di.role?.hierarchy) return {hierarchy: di.role.hierarchy, uniqueId: di.uniqueId};
  //         });
  //         const uniqueHierarchy = [...new Set(hierarchies)];
  //
  //         filteredResults = await Promise.all(
  //           uniqueHierarchy.map(async(hierarchy) => {
  //             const res = await getOGByHierarchy(hierarchy.hierarchy);
  //             res.uniqueIdSearch = hierarchy.uniqueId;
  //             return res;
  //           })
  //         );
  //       }
  //     }
  //
  //     return filteredResults;
  //   }

  //   async getHierarchyByRoleId(event) {
  //     let filteredResults = [];
  //     const { query } = event;
  //
  //     if (query.trim().length) {
  //       const roles = await searchRolesByRoleId(query);
  //
  //       if (roles.length > 0) {
  //         let hierarchies = [];
  //         hierarchies = roles.map((role) => {
  //           if (role?.hierarchy) return role.hierarchy;
  //         });
  //         const uniqueHierarchy = [...new Set(hierarchies)];
  //
  //         filteredResults = await Promise.all(uniqueHierarchy.map((hierarchy) => {
  //           const res = getOGByHierarchy(hierarchy);
  //           return res;
  //         }))
  //       }
  //
  //     }
  //
  //     return filteredResults;
  //   }
}
