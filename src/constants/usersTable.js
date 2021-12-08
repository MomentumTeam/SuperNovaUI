import { USER_TYPE } from ".";
import { useStores } from "../context/use-stores";
import { TextFieldTemplate } from "../components/Fields/TextFieldTemplate";

export const TableTypes = {
  entities: [
    { field: "firstName", displayName: "שם פרטי" },
    { field: "lastName", displayName: "שם משפחה" },
    { field: "personalNumber", displayName: 'מ"א/ת"ז' },
    {
      field: "clearance",
      displayName: "סיווג",
      secured: [USER_TYPE.SECURITY, USER_TYPE.SUPER_SECURITY],
    },
    { field: "jobTitle", displayName: "תפקיד" },
    { field: "displayName", displayName: "יוזר", template: TextFieldTemplate },
    { field: "rank", displayName: "דרגה" },
    { field: "akaUnit", displayName: "יחידה" },
    { field: "serviceType", displayName: "סוג שירות" },
  ],
  hierarchy: [
    { field: "hierarchy", displayName: "היררכיה" },
    { field: "id", displayName: "מזהה היררכיה", hide: true },
    { field: "directRoles.length", displayName: "מספר תפקידים", default: 0 },
  ],
  roles: [
    { field: "jobTitle", displayName: "שם תפקיד" },
    { field: "hierarchy", displayName: "היררכיה" },
    { field: "clearance", displayName: "סיווג התפקיד" },
    { field: "digitalIdentityUniqueId", displayName: "מזהה תפקיד" },
  ],
};

export const TableNames = {
  entities: { tab: "entities", tableName: "רשימת משתמשים" },
  hierarchy: { tab: "hierarchy", tableName: "רשימת היררכיה" },
  roles: { tab: "roles", tableName: "רשימת תפקידים" },
};

export const tableActionsEnum = {
  VIEW_ENTITY: "VIEW_ENTITY",
  EDIT_ENTITY: "EDIT_ENTITY",
  VIEW_HIERARCHY: "VIEW_HIERARCHY",
  EDIT_HIERARCHY: "EDIT_HIERARCHY",
  DELETE_HIERARCHY: "DELETE_HIERARCHY",
  VIEW_ROLE: "VIEW_ROLE",
  EDIT_ROLE: "EDIT_ROLE",
  DELETE_ROLE: "DELETE_ROLE",
};

export const TableActionsTypes = {
  entities: {
    view: tableActionsEnum.VIEW_ENTITY,
    edit: tableActionsEnum.EDIT_ENTITY,
  },
  hierarchy: {
    view: tableActionsEnum.VIEW_HIERARCHY,
    edit: tableActionsEnum.EDIT_HIERARCHY,
    // delete: tableActionsEnum.DELETE_HIERARCHY,
  },
  roles: {
    view: tableActionsEnum.VIEW_ROLE,
    edit: tableActionsEnum.EDIT_ROLE,
    // delete: tableActionsEnum.DELETE_ROLE,
  },
};

export const TableSearch = (tableType) => {
  const { entitiesStore, rolesStore, groupsStore } = useStores();

  const searchFields = {
    entities: [
      {
        searchField: "displayName",
        searchDisplayName: 'שם/מ"א/ת"ז',
        searchFunc: entitiesStore.getEntitiesByEntity,
      },
      {
        searchField: "displayName",
        searchDisplayName: "היררכיה",
        searchFunc: entitiesStore.getEntitiesByHierarchy,
      },
      {
        searchField: "displayName",
        searchDisplayName: "חיפוש לפי מזהה תפקיד (T)",
        searchFunc: entitiesStore.getEntitiesByRoleId,
      },
    ],
    hierarchy: [
      {
        searchField: "hierarchy",
        searchDisplayName: "היררכיה",
        searchFunc: groupsStore.getHierarchyByHierarchy,
      },
      {
        searchField: "hierarchy",
        searchDisplayName: "חיפוש לפי מזהה תפקיד (T)",
        searchFunc: groupsStore.getHierarchyByRoleId,
      },
    ],
    roles: [
      {
        searchField: "roleId",
        searchDisplayName: 'שם/מ"א/ת"ז',
        searchFunc: rolesStore.getRolesByRoleId,
      },
      {
        searchField: "roleId",
        searchDisplayName: "היררכיה",
        searchFunc: rolesStore.getRolesByHierarchy,
      },
    ],
  };
  return searchFields[tableType] ? searchFields[tableType] : [];
};
