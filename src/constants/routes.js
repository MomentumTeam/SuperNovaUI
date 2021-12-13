import Dashboard from "../pages/Dashboard";
import ListUsersPage from "../pages/Entities";
import MyRequests from "../pages/MyRequests";

const appRoutes = [
  {
    path: "/",
    classIcon: "aside-item-btn1",
    label: "Home",
    component: Dashboard,
  },
  {
    path: "/myRequests",
    classIcon: "aside-item-btn3",
    label: "Home",
    component: MyRequests,
  },
  {
    path: "/listUsersPage",
    classIcon: "aside-item-btn5",
    label: "Home",
    component: ListUsersPage,
  },
];

export default appRoutes;
