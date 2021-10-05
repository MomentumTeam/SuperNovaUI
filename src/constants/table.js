export const TableTypes = {
  entities: [
    { field: "firstName", displayName: "שם פרטי" },
    { field: "lastName", displayName: "שם משפחה" },
    { field: "personalNumber", displayName: 'מ"א/ת"ז' },
    { field: "clearance", displayName: "סיווג" },
    { field: "jobTitle", displayName: "תפקיד" },
    { field: "displayName", displayName: "יוזר" },
    { field: "rank", displayName: "דרגה" },
    { field: "akaUnit", displayName: "יחידה" },
    { field: "serviceType", displayName: "סוג שירות" },
  ],
  hierarchy: [
    { field: "hierarchy", displayName: "היררכיה" },
    { field: "id", displayName: "מפתח" },
    { field: "directRoles", displayName: "מספר תפקידים" },
  ],
  roles: [
    { field: "jobTitle", displayName: "שם תפקיד" },
    { field: "hierarchy", displayName: "היררכיה" },
    { field: "clearance", displayName: "סיווג התפקיד" },
    { field: "digitalIdentityUniqueId", displayName: "משתמש" },
  ],
};

export const TableSearch = {
  entities: "",
};
export const TableKeys = {
  entities: "id",
  hierarchy: "id",
  roles: "roleId",
};
