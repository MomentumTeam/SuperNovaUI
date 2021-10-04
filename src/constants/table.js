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
    { field: "name", displayName: "סוג קבוצה" }, // ASK: which field
    { field: "directRoles", displayName: "מספר תפקידים" }, // ASK: which field
    { field: "directEntities", displayName: "תפקידים לא מאויישים" }, // ASK: which field
  ],
  roles: [
    { field: "jobTitle", displayName: "שם תפקיד" },
    { field: "hierarchy", displayName: "היררכיה" },
    { field: "clearance", displayName: "סיווג התפקיד" },
    { field: "digitalIdentityUniqueId", displayName: "משתמש" },
    { field: "a", displayName: "סטטוס" }, // ASK: which field
    { field: "displayName", displayName: "משתמש בתפקיד" }, // ASK: which field
  ],
};

export const TableKeys = {
  entities: "id",
  hierarchy: "id",
  roles: "roleId",
};