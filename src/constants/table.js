export const TableTypes = {
    entities: [
        { field: "firstName", displayName: "שם פרטי" },
        { field: "lastName", displayName: "שם משפחה" },
        { field: "personalNumber", displayName: "מספר אישי/תעודת זהות" },
        { field: "clearance", displayName: "סיווג" },
        { field: "jobTitle", displayName: "תפקיד" },
        { field: "displayName", displayName: "יוזר" },
        { field: "rank", displayName: "דרגה" },
        { field: "akaUnit", displayName: "יחידה" },
        { field: "serviceType", displayName: "סוג שירות" },
    ],
    hierarchy: [
        { field: "hierarchy", displayName: "היררכיה" },
        { field: "lastName", displayName: "סוג קבוצה" },
        { field: "personalNumber", displayName: "מספר תפקידים" },
        { field: "clearance", displayName: "תפקידים לא מאויישים" },
    ],
    roles: [
        { field: "jobTitle", displayName: "שם תפקיד" },
        { field: "hierarchy", displayName: "היררכיה" },
        { field: "personalNumber", displayName: "סיווג התפקיד" },
        { field: "digitalIdentityUniqueId", displayName: "משתמש" },
        { field: "a", displayName: "סטטוס" },
        { field: "displayName", displayName: "משתמש בתפקיד" }
    ]
}