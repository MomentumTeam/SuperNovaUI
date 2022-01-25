import { action, makeAutoObservable, observable } from "mobx";
import {
  getRolesUnderOG,
  searchRolesByRoleId,
  getEntityByIdentifier,
  searchEntitiesByFullName,
  getRoleByRoleId,
  searchDIByUniqueId,
  searchOG,
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

    async searchRolesByRoleId(event) {
      let filteredResults;
      const { query } = event;
  
      if (!query.trim().length) {
        filteredResults = [];
      } else {
        filteredResults = await searchRolesByRoleId(query.toLowerCase());
        filteredResults = filteredResults;
      }
  
      return filteredResults;
    }

  async searchRolesByDI(event) {
    let filteredResults = [];
    const { query } = event;

    if (query.trim().length) {
      try {
        const dis = await searchDIByUniqueId(query);

        if (dis.length > 0) {
          let diRoles = [];
          dis.map((di) => {
            if (di?.role && di.role?.roleId) {
              diRoles = [...diRoles, di.role];
            }
          });
          filteredResults = diRoles;
        }
      } catch (error) {
        
      }
    }

    return filteredResults;
  }

  async getRolesByHierarchy(event) {
    let filteredResults = [];
    const { query } = event;

    if (query.trim().length) {
      try {
        const ogs = await searchOG(query, true);

        if (ogs.length > 0) {
            ogs.map(async (og) => {
                if (og.directRoles) filteredResults = [...filteredResults, ...og.directRoles];
            })
        }
      } catch (error) {}
    }

    return filteredResults;
  }

  async getRolesByEntity(event) {
    let filteredResults = [];

    const getEntitiesByEntity = async (event) => {
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
    };

    const entities = await getEntitiesByEntity(event);
    if (entities.length > 0) {
      let entityRoles = [];
      entities.map((entity) => {
        if (entity?.digitalIdentities && entity?.digitalIdentities.length > 0) {
          entity?.digitalIdentities.map((di) => {
            if (di?.role) entityRoles = [...entityRoles, di.role];
          });
        }
      });

      filteredResults = await Promise.all(
        entityRoles.map(async (entityRole) => {
          const role = getRoleByRoleId(entityRole.roleId);
          return role;
        })
      );
    }

    return filteredResults;
  }
}
