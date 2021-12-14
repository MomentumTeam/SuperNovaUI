import { useRef, createContext } from "react";

export const ToastStoreContext = createContext();

const ToastProvider = ({children}) => {
  const toastRef = useRef(null);

  const actionPopup = (actionType = "זו", error = null) => {
    if (error === null) {
      toastRef.current.show({
        severity: "success",
        summary: "Success Message",
        detail: `פעולה ${actionType} הצליחה`,
        life: 3000,
      });
    } else {
      toastRef.current.show({
        severity: "error",
        summary: "Error Message",
        detail: error.message || `פעולה ${actionType} נכשלה`,
        life: 3000,
      });
    }
  };

  return <ToastStoreContext.Provider value={{actionPopup, toastRef}}>{children}</ToastStoreContext.Provider>;
};

export {ToastProvider};
