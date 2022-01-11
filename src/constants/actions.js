import ApproverForm from "../components/Modals/ApproverForm";
import AssignRoleToEntityForm from "../components/Modals/AssignRoleToEntityForm";
import CreateEntityForm from "../components/Modals/Entity/CreateEntityForm";
import CreateOGForm from "../components/Modals/Hierarchy/CreateOGForm";
import RenameOGForm from "../components/Modals/Hierarchy/RenameOGForm";
import CreateRoleForm from "../components/Modals/Role/CreateRoleForm";

export const actions = [
  {
    id: 1,
    className: "btn-actions btn-actions1",
    actionName: "תפקיד חדש",
    infoText: `פתיחת תפקיד חדש תחת היררכיה נבחרת`,
    infoWithTitle: false,
    displayResponsive: false,
    dialogClass: "dialogClass1",
    modalName: CreateRoleForm,
  },
  {
    id: 2,
    className: "btn-actions btn-actions2",
    actionName: "מעבר היררכיה",
    infoText: `העברת תפקיד נבחר להיררכיה ארגונית אחרת`,
    infoWithTitle: false,
    displayResponsive: false,
    dialogClass: "dialogClass2",
    modalName: RenameOGForm,
  },
  {
    id: 3,
    className: "btn-actions btn-actions3",
    actionName: "מעבר תפקיד",
    infoText: `מעבר משתמש בין תפקידים:
    הכנסת פרטי המשתמש שרוצה לעבור תפקיד
    ▼
    בחירת ההיררכיה בה נמצא התפקיד הרצוי
    ▼
    בחירת התפקיד מרשימת התפקידים (ניתן להכניס מזהה תפקיד להשלמה אוטומטית של הערכים)
    ▼
    בחירת גורם מאשר מהיררכית התפקיד לאישור הבקשה 🤓`,
    infoWithTitle: true,
    displayResponsive: false,
    dialogClass: "dialogClass3",
    modalName: AssignRoleToEntityForm,
  }, //disconnect true
  {
    id: 4,
    className: "btn-actions btn-actions4",
    actionName: "משתמש חדש",
    infoText: `חיבור משתמש חדש לתפקיד קיים ויצירת אזרח`,
    infoWithTitle: false,
    displayResponsive: false,
    dialogClass: "dialogClass4",
    modalName: CreateEntityForm,
  }, //disconnect false
  {
    id: 5,
    className: "btn-actions btn-actions5",
    actionName: "היררכיה חדשה",
    infoText: `פתיחת היררכיה חדשה תחת היררכית אב:
    בחירת היררכית האב להיררכיה חדשה
    ▼
    הכנסת שם להיררכיה החדשה
    ▼
    בחירת גורם מאשר מיחידתך לאישור הבקשה 🤓`,
    infoWithTitle: true,
    displayResponsive: false,
    dialogClass: "dialogClass5",
    modalName: CreateOGForm,
  },
  {
    id: 6,
    className: "btn-actions btn-actions6",
    actionName: "בקשה להרשאות",
    infoText: `בקשה לקבלת הרשאות שונות במערכת:
    בחירת סוג הגורם המאשר הרצוי
    ▼
    הכנסת פרטי המשתמש עבורו תינתן ההרשאה
    ▼
    בחירת ההיררכיה שבה יהיה גורם מאשר
    ▼
    בחירת גורם מאשר מיחידתך לאישור הבקשה 🤓`,
    infoWithTitle: true,
    displayResponsive: false,
    dialogClass: "dialogClass6",
    modalName: ApproverForm,
  },
];




export const headersInfo = {
  'תפקיד חדש': `פתיחת תפקיד חדש תחת היררכיה נבחרת:
  בחירת היררכיה לתפקיד
  ▼
  הכנסת שם לתפקיד החדש
  ▼
  בחירת סיווג תפקיד
  ▼
  בחירת גורם מאשר מיחידתך לאישור הבקשה 🤓`,
  'תפקידים חדשים': `פתיחת מס' תפקידים תחת היררכיה נבחרת:
  הורדת פורמט הבקשה ומילוי בהתאם להסבר
  ▼
  בחירת היררכיה לתפקידים
  ▼
  העלאת הקובץ המלא ובחירת גורם מאשר מיחידתך לאישור הבקשה 😎`,
  'מעבר היררכיה לתפקיד': `העברת תפקיד נבחר להיררכיה ארגונית אחרת:
  בחירת ההיררכיה בה נמצא התפקיד להעברה
  ▼
  בחירת התפקיד מרשימת התפקידים (ניתן להכניס מזהה תפקיד להשלמה אוטומטית של הערכים)
  ▼
  בחירת ההיררכיה החדשה להעברת התפקיד
  ▼
  בחירת גורם מאשר מיחידתך לאישור הבקשה 🤓`,
  'מעבר היררכיה לתפקידים': `מעבר היררכיה למס' תפקידים:
  הורדת פורמט הבקשה ומילוי בהתאם להסבר
  ▼
  בחירת ההיררכיה הנוכחית בה נמצאים התפקידים
  ▼
  בחירת ההיררכיה החדשה אליה יעברו התפקידים
  ▼
  העלאת הקובץ המלא ובחירת גורם מאשר מיחידתך לאישור הבקשה 😎
  `,
  'חיבור משתמש חדש לתפקיד': `חיבור בין חייל חדש לתפקיד קיים במערכת:
  הכנסת פרטי המשתמש עבורו מחברים תפקיד
  ▼
  בחירת ההיררכיה בה נמצא התפקיד הרצוי
  ▼
  בחירת התפקיד מרשימת התפקידים (ניתן להכניס מזהה תפקיד להשלמה אוטומטית של הערכים)
  ▼
  בחירת גורם מאשר מיחידתך לאישור הבקשה 🤓`,
  'יצירת משתמש מיוחד': `יצירת אזרח/יועץ והכנסתו למערכת הארגונית:
  הכנסת פרטיו האישיים של המשתמש ויצירתו
  ▼
  לאחר מכן, ניתן לחבר בין המשתמש לתפקיד קיים`,
};