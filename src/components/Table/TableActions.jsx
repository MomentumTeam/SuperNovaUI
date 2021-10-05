import React from "react";
import { toJS } from "mobx";
import { useStores } from "../../context/use-stores";
import { USER_TYPE } from "../../constants";

const TableActions = ({ toast, data, openFullDetailsModal }) => {
  const { userStore } = useStores();
  const user = toJS(userStore.user);

  let actions = [
    {
      label: "צפייה",
      command: () => {
        openFullDetailsModal();
        // console.log(data);
        // toast.current.show({
        //   severity: "success",
        //   summary: "צפייה",
        //   detail: `Data Viewing ${data.id}`,
        //   life: 3000,
        // });
      },
    },
    {
      label: "עריכה",
      command: () => {
        toast.current.show({
          severity: "success",
          summary: "עריכה",
          detail: "Data Editing",
          life: 3000,
        });
      },
    },
  ];

  if (user.types.includes(USER_TYPE.COMMANDER)) {
    actions.push({
      label: "מחיקה",
      command: () => {
        toast.current.show({
          severity: "success",
          summary: "מחיקה",
          detail: "Data deletion",
          life: 3000,
        });
      },
    });
  }

  return actions;
};

export { TableActions };
