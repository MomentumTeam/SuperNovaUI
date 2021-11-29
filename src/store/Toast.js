import { useRef, createContext } from "react";

export const ToastStoreContext = createContext();

const ToastProvider = ({children}) => {
  const toastRef = useRef(null);

  const actionPopup = (actionType, error = null) => {
    if (error === null) {
      toastRef.current.show({
        severity: "success",
        summary: "Success Message",
        detail: `Success in action: ${actionType}`,
        life: 3000,
      });
    } else {
      toastRef.current.show({
        severity: "error",
        summary: "Error Message",
        detail: error.message || `action: ${actionType} failed`,
        life: 3000,
      });
    }
  };

  return <ToastStoreContext.Provider value={{actionPopup, toastRef}}>{children}</ToastStoreContext.Provider>;
};

export {ToastProvider};
