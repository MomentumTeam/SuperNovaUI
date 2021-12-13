import { useContext } from "react";
import { ToastStoreContext } from '../store/Toast';

export const useToast = () => useContext(ToastStoreContext);
