import { observer } from "mobx-react";
import { toJS } from "mobx";
import { useState, useEffect } from "react";
import { getCookie } from "react-use-cookie";
import SearchBox from "../../components/SearchBox";
import HierarchyTree from "../../components/HierarchyTree";
import SideToolbar from "../../components/SideToolbar";
import userpic from "../../assets/images/userpic.png";
import "../../assets/css/local/pages/dashboard.min.css";
import UserProfileCard from "./UserProfileCard";
import { useStores } from "../../hooks/use-stores";
import axios from "axios";
import TreeStore from "../../store/Tree";

const Dashboard = observer(() => {
  const [user, setUser] = useState(null);
  const [hierarchy, setHierarchy] = useState([{}]);
  const [requestList, setRequestList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const { countryStore, treeStore } = useStores();

  useEffect(() => {
    countryStore.loadContries();
    // treeStore.loadTree();

    setRequestList([
      {
        id: "1",
        date: "28/05/21",
        description: "בקשה ליצירת תפקיד חדש",
        status: "נשלחה",
      },
      {
        id: "2",
        date: "28/05/21",
        description: "בקשה לשינוי היררכיה",
        status: "נשלחה",
      },
      {
        id: "3",
        date: "28/05/21",
        description: "בקשה למעבר תפקיד",
        status: "נדחתה",
      },
      {
        id: "4",
        date: "28/05/21",
        description: "btn-actions",
        status: "נדחתה",
      },
    ]);
    setMessagesList([
      {
        id: "1",
        date: "28/05/21",
        description: "בקשה ליצירת תפקיד חדש",
        status: "נשלחה",
      },
      {
        id: "2",
        date: "28/05/21",
        description: "בקשה לשינוי היררכיה",
        status: "נשלחה",
      },
      {
        id: "3",
        date: "28/05/21",
        description: "בקשה למעבר תפקיד",
        status: "נדחתה",
      },
      {
        id: "4",
        date: "28/05/21",
        description: "btn-actions",
        status: "נדחתה",
      },
    ]);
    setHierarchy([
      {
        label: "ספיר",
        expanded: true,
        children: [
          {
            label: "יחידה 1",
            className: "style2",
            expanded: true,
            children: [
              {
                label: "יחידה 2",
              },
              {
                label: "יחידה 2",
              },
            ],
          },
          {
            label: "8200",
            expanded: true,
            children: [
              {
                label: "יחידה 2",
              },
              {
                label: "יחידה 2",
              },
            ],
          },
        ],
      },
    ]);
    setUser({
      name: "לירן עזרא",
      privateNumber: "45808006",
      role: "צלם מומחה1",
      phone: "054-4769588",
      endOfService: "12/12/22",
      mail: "iron@dynaamic.com",
      address: "עליזה בגין 8 ראשלצ",
      picture: userpic,
    });
  }, []);

  useEffect(() => {
    (async () => {
      const gamba = await axios.get("http://localhost:2000/api/requests/ui", {
        headers: {
          authorization: getCookie("ppp"),
        },
      });
      alert(gamba.data);
    })();
  }, []);

  return (
    <>
      <div className="main-inner-item main-inner-item2">
        <div className="main-inner-item2-content">
          <div className="display-flex title-wrap">
            <h2>פרטים אישיים</h2>
          </div>
          <UserProfileCard user={user} />
          <div className="content-unit-wrap">
            <div className="content-unit-inner content-unit-inner-before">
              <div className="search-row">
                <div className="search-row-inner">
                  <SearchBox data={toJS(countryStore.countries)} />
                </div>
              </div>
              <div className="chart-wrap">
                {TreeStore.treeRecieved ? (
                  <HierarchyTree data={TreeStore.tree} />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SideToolbar lastRequests={requestList} lastMessages={messagesList} />
    </>
  );
});

export default Dashboard;
