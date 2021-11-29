import { Toast } from 'primereact/toast';
import { useToast } from "../context/use-toast";

const ToastAlert = () => {
  const { toastRef } = useToast();
  return <Toast ref={toastRef} />;
};

export { ToastAlert };
