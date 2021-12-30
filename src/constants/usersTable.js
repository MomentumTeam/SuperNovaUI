import { USER_TYPE } from ".";
import { useStores } from "../context/use-stores";
import { TextFieldTemplate } from "../components/Fields/TextFieldTemplate";
import { concatHierarchy, hierarchyItemTemplate } from '../utils/hierarchy';
import { actions } from './actions';
import { formatServiceType, userTemplate } from '../utils/user';

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
    { field: ["serviceType", "entityType"], displayName: "סוג שירות", formatter: formatServiceType },
  ],
  hierarchy: [
    { field: ["hierarchy", "name"], displayName: "היררכיה", formatter: concatHierarchy},
    { field: "id", displayName: "מזהה היררכיה", hide: true },
    { field: "directRoles.length", displayName: "מספר תפקידים", default: 0 },
  ],
  roles: [
    { field: "jobTitle", displayName: "שם תפקיד" },
    { field: "hierarchy", displayName: "היררכיה", template: TextFieldTemplate },
    { field: "clearance", displayName: "סיווג התפקיד" },
    { field: "roleId", displayName: "מזהה תפקיד" },
  ],
};

export const TableNames = {
  entities: {
    tab: "entities",
    tableName: "רשימת משתמשים",
    roles: [USER_TYPE.ADMIN, USER_TYPE.BULK, USER_TYPE.COMMANDER, USER_TYPE.SECURITY, USER_TYPE.SUPER_SECURITY],
  },
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
        searchTemplate: userTemplate,
      },
      {
        searchField: "hierarchy",
        searchDisplayName: "היררכיה",
        searchFunc: entitiesStore.getEntitiesByHierarchy,
      },
      {
        searchField: "roleIdSearch",
        searchDisplayName: "חיפוש לפי מזהה תפקיד (T)",
        searchFunc: entitiesStore.searchEntitiesByRoleId,
      },
    ],
    hierarchy: [
      {
        searchField: "hierarchy",
        searchDisplayName: "היררכיה",
        searchFunc: groupsStore.getHierarchyByHierarchy,
        searchTemplate: hierarchyItemTemplate,
      },
      {
        searchField: "roleIdSearch",
        searchDisplayName: "חיפוש לפי מזהה תפקיד (T)",
        searchFunc: groupsStore.getHierarchyByRoleId,
        searchIdField: "id",
      },
    ],
    roles: [
      {
        searchField: "displayName",
        searchDisplayName: 'שם/מ"א/ת"ז',
        searchFunc: rolesStore.getRolesByEntity,
      },
      {
        searchField: "hierarchy",
        searchDisplayName: "היררכיה",
        searchFunc: rolesStore.getRolesByHierarchy,
      },
      {
        searchField: "roleId",
        searchDisplayName: "חיפוש לפי מזהה תפקיד (T)",
        searchFunc: rolesStore.searchRolesByRoleId,
      },
    ],
  };
  return searchFields[tableType] ? searchFields[tableType] : [];
};

export const TableAdd = {
  entities: {
    actionName: "משתמש חדש",
    addClass: "btn-add-user",
    dialogClass: actions[3].dialogClass,
    infoText: actions[3].infoText,
    infoWithTitle: actions[3].infoWithTitle,
    modalName: actions[3].modalName,
  },
  hierarchy: {
    actionName: "היררכיה חדשה",
    addClass: "btn-add-group",
    dialogClass: actions[4].dialogClass,
    infoText: actions[4].infoText,
    infoWithTitle: actions[4].infoWithTitle,
    modalName: actions[4].modalName,
  },
  roles: {
    actionName: "תפקיד חדש",
    addClass: "btn-add-role",
    dialogClass: actions[0].dialogClass,
    infoText: actions[0].infoText,
    infoWithTitle: actions[0].infoWithTitle,
    modalName: actions[0].modalName,
  },
};
