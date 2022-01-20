import { USER_TYPE } from '.';
import Dashboard from "../pages/Dashboard";
import ListUsersPage from "../pages/Entities";
import MyRequests from "../pages/MyRequests";

const appRoutes = [
  {
    path: "/",
    classIcon: "aside-item-btn1",
    label: "דף בית",
    component: Dashboard,
  },
  {
    path: "/myRequests",
    classIcon: "aside-item-btn3",
    label: "בקשות שלי",
    component: MyRequests,
  },
  {
    path: "/listUsersPage",
    classIcon: "aside-item-btn5",
    label: "טבלאות",
    component: ListUsersPage,
  },
];

export default appRoutes;
